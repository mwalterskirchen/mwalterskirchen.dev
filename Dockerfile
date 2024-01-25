# ---- Base Node ----
FROM node:20-alpine AS base
# Set working directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
# Install pnpm
RUN npm install -g pnpm
# Copy project file(s)
COPY package.json pnpm-lock.yaml ./
# Install node modules
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---- Build ----
FROM dependencies AS build
COPY . .
# Build the project
RUN pnpm build

# ---- Release ----
FROM node:20-alpine AS release
# Copy production node_modules
COPY --from=build /app/node_modules ./node_modules
# Copy built assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# Expose port
EXPOSE 3000
# Start the app
CMD ["node", "server.js"]
