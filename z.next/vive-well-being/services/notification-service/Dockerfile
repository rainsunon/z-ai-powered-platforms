FROM node:22-alpine AS base

WORKDIR /app

# Copy root workspace config
COPY package.json ./
COPY turbo.json ./

# Copy shared package
COPY packages/notificationDB/package.json ./packages/notificationDB/
COPY packages/notificationDB/dist ./packages/notificationDB/dist

# Copy notification service
COPY services/notification-service/package.json ./services/notification-service/
COPY services/notification-service/dist ./services/notification-service/dist

# Install production deps from root (workspace resolution)
RUN npm install --production --workspace=services/notification-service

WORKDIR /app/services/notification-service

ENV NODE_ENV=production

EXPOSE 3001 3002

# Default to producer; override with CMD ["node", "dist/worker/index.js"]
CMD ["node", "dist/producer/index.js"]
