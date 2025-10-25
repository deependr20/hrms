# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create .env.local from environment variables
RUN echo "MONGODB_URI=\${MONGODB_URI}" > .env.local && \
    echo "JWT_SECRET=\${JWT_SECRET}" >> .env.local && \
    echo "NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}" >> .env.local && \
    echo "NEXTAUTH_URL=\${NEXTAUTH_URL}" >> .env.local

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
