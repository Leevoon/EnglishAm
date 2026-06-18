# Frontend image: build the SPA with Node, serve the static bundle from nginx.
# In production, nginx also reverse-proxies /api → backend service.
#
# Vite resolves VITE_* at build time, so the API/media hosts are baked into the
# bundle. To change them, you must rebuild this image with new build args.

FROM node:20-alpine AS builder
WORKDIR /app

# Build-time configuration. Override per environment:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com ./frontend
# Empty string means "same origin" (works behind nginx's /api proxy block).
ARG VITE_API_BASE_URL=""
ARG VITE_MEDIA_BASE_URL="https://english.am/vendor/img"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_MEDIA_BASE_URL=$VITE_MEDIA_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
