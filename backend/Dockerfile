# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies) in development
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN echo "NODE_ENV is: $NODE_ENV"
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

# Install curl for health check
RUN apk add --no-cache curl

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application (use dev script in development)
CMD if [ "$NODE_ENV" = "development" ]; then npm run dev; else npm start; fi
