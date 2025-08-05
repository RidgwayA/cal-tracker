# Multi-stage build for frontend and backend

# Stage 1: Build the frontend
FROM node:20-slim as frontend-build
WORKDIR /app/frontEnd
COPY frontEnd/package*.json ./
RUN npm ci && npm cache clean --force
COPY frontEnd/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:20-slim as backend-build
WORKDIR /app/backEnd
COPY backEnd/package*.json ./
COPY backEnd/tsconfig.json ./
RUN npm ci && npm cache clean --force
COPY backEnd/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-slim

# Security updates and install dumb-init
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install backend dependencies
COPY backEnd/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
COPY --from=backEnd-build /app/backEnd ./

# Copy built frontend files
COPY --from=frontEnd-build /app/frontEnd/dist ./public

# Create a non-root user for security
RUN groupadd --gid 1001 --system nodejs && \
    useradd --uid 1001 --system --gid nodejs --shell /bin/bash --create-home nodejs

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port your backend runs on
EXPOSE 4000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the backend server
CMD ["npm", "run", "start"]

