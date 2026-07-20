FROM node:20-alpine AS builder

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Explicitly generate Prisma client for production to ensure binary/code compatibility
RUN npx prisma generate

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]
