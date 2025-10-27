#!/bin/bash

# HRMS SSL Setup Script with Let's Encrypt
# This script sets up SSL certificates for your HRMS application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get server IP and domain
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "199.59.27.50")

# Allow user to specify domain or use IP
if [ -n "$1" ]; then
    DOMAIN="$1"
    print_status "🌐 Using domain: $DOMAIN"
else
    DOMAIN="$SERVER_IP"
    print_status "📍 Using IP address: $SERVER_IP"
fi

print_status "🚀 Starting HRMS SSL Setup"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Navigate to project directory
cd /root/hrms

# Step 1: Update environment for HTTPS
print_status "🔧 Updating environment configuration for HTTPS..."

# Update .env file for HTTPS
if [ -f .env ]; then
    # Backup current .env
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

    # Update NEXTAUTH_URL to use HTTPS
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://$DOMAIN|g" .env

    # Update NEXT_PUBLIC_APP_URL to use HTTPS
    if grep -q "NEXT_PUBLIC_APP_URL" .env; then
        sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$DOMAIN|g" .env
    else
        echo "NEXT_PUBLIC_APP_URL=https://$DOMAIN" >> .env
    fi

    print_success "Environment updated for HTTPS"
else
    print_error ".env file not found!"
    exit 1
fi

# Step 2: Create necessary directories
print_status "📁 Creating SSL directories..."
mkdir -p ssl
mkdir -p certbot/conf
mkdir -p certbot/www

# Step 3: Stop current containers
print_status "🛑 Stopping current containers..."
docker-compose down || true

# Step 4: Start with HTTP-only nginx for certificate generation
print_status "🌐 Starting HTTP-only setup for certificate generation..."

# Create temporary nginx config for certificate generation
cat > nginx.temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream hrms_app {
        server hrms-app:3000;
    }

    server {
        listen 80;
        server_name _;

        # Let's Encrypt challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Temporary: serve app over HTTP during certificate generation
        location / {
            proxy_pass http://hrms_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Create temporary docker-compose for certificate generation
cat > docker-compose.temp.yml << EOF
services:
  hrms-app:
    build:
      context: .
      args:
        - MONGODB_URI=\${MONGODB_URI}
        - JWT_SECRET=\${JWT_SECRET}
        - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
        - NEXTAUTH_URL=\${NEXTAUTH_URL}
        - NEXT_PUBLIC_APP_URL=\${NEXT_PUBLIC_APP_URL:-http://$DOMAIN}
        - NEXT_PUBLIC_APP_NAME=\${NEXT_PUBLIC_APP_NAME:-HRMS System}
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - hrms-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.temp.conf:/etc/nginx/nginx.conf
      - ./certbot/www:/var/www/certbot
    depends_on:
      - hrms-app
    restart: unless-stopped
    networks:
      - hrms-network

networks:
  hrms-network:
    driver: bridge
EOF

# Start temporary setup
docker-compose -f docker-compose.temp.yml up -d

# Wait for services to start
print_status "⏳ Waiting for services to start..."
sleep 30

# Step 5: Generate SSL certificate
print_status "🔐 Generating SSL certificate with Let's Encrypt..."

# Run certbot to get certificate
docker run --rm \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    print_success "SSL certificate generated successfully!"
else
    print_error "Failed to generate SSL certificate"
    print_warning "Continuing with HTTP-only setup..."
    
    # Clean up temporary files
    rm -f nginx.temp.conf docker-compose.temp.yml
    
    # Use regular docker-compose without SSL
    docker-compose down
    docker-compose up -d
    
    print_success "HRMS is running on HTTP: http://$DOMAIN"
    exit 0
fi

# Step 6: Stop temporary setup and start SSL setup
print_status "🔄 Switching to SSL configuration..."
docker-compose -f docker-compose.temp.yml down

# Clean up temporary files
rm -f nginx.temp.conf docker-compose.temp.yml

# Update nginx SSL config with correct domain
print_status "🔧 Updating nginx SSL configuration..."
sed -i "s|DOMAIN_PLACEHOLDER|$DOMAIN|g" nginx.ssl.conf

# Step 7: Start with SSL configuration
print_status "🚀 Starting HRMS with SSL..."
docker-compose -f docker-compose.ssl.yml up -d

# Wait for services to start
sleep 30

# Step 8: Verify setup
print_status "🔍 Verifying SSL setup..."

# Test HTTP redirect
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN || echo "000")
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    print_success "HTTP to HTTPS redirect working"
else
    print_warning "HTTP redirect status: $HTTP_STATUS"
fi

# Test HTTPS
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -k https://$DOMAIN || echo "000")
if [ "$HTTPS_STATUS" = "200" ]; then
    print_success "HTTPS is working"
else
    print_warning "HTTPS status: $HTTPS_STATUS"
fi

# Final status
print_success "🎉 HRMS SSL Setup Complete!"
echo ""
echo "📋 Access Information:"
echo "🌐 HTTPS URL: https://$DOMAIN"
echo "🔒 HTTP URL: http://$DOMAIN (redirects to HTTPS)"
echo "🔧 Direct App: http://$DOMAIN:3000"
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.ssl.yml ps
echo ""
echo "🔍 To check logs:"
echo "docker-compose -f docker-compose.ssl.yml logs -f"
echo ""
echo "🔄 Certificate will auto-renew every 12 hours"
