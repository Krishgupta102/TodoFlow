# ─── Stage 1: Base ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# ─── Stage 2: Install dependencies ─────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Stage 3: Production ───────────────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose API port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
