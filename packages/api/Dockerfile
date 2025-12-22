# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/api/package*.json ./packages/api/

# Install dependencies
RUN npm install

# Copy source
COPY packages/core ./packages/core
COPY packages/api ./packages/api

# Build
WORKDIR /app/packages/api
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/core/package*.json ./packages/core/
COPY --from=builder /app/packages/api/package*.json ./packages/api/

RUN npm install --omit=dev

# Copy built files
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/api/dist ./packages/api/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose ports
EXPOSE 3001
EXPOSE 4096

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start server
WORKDIR /app/packages/api
CMD ["node", "dist/server.js"]
