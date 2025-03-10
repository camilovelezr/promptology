# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_PROMPTOLOGY_URL
ENV NEXT_PUBLIC_PROMPTOLOGY_URL=${NEXT_PUBLIC_PROMPTOLOGY_URL}

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set hostname for container
ENV HOSTNAME=0.0.0.0

# Start the application
CMD ["npm", "start"] 