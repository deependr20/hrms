# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Copy environment files
COPY .env* ./

# Create .env.local from .env for Next.js build process
RUN if [ -f .env ]; then cp .env .env.local; fi

# Set default environment variables for build (will be overridden by .env files)
ENV NODE_ENV=production
ENV MONGODB_URI=""
ENV JWT_SECRET=""
ENV NEXTAUTH_SECRET=""
ENV NEXTAUTH_URL=""

# Build the application
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
