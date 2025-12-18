# Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

# Run
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/frontend/server/server.mjs"]
