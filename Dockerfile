# 1. Build Stage
FROM node:20-slim AS build

WORKDIR /app

# Vite 빌드 시 필요한 인자 정의
ARG VITE_API_BASE_URL
ARG VITE_DEFAULT_STORE_ID
ARG VITE_DEFAULT_STORE_NAME
ARG VITE_DEFAULT_REFERENCE_DATETIME

# 빌드 시 환경 변수로 주입
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DEFAULT_STORE_ID=$VITE_DEFAULT_STORE_ID
ENV VITE_DEFAULT_STORE_NAME=$VITE_DEFAULT_STORE_NAME
ENV VITE_DEFAULT_REFERENCE_DATETIME=$VITE_DEFAULT_REFERENCE_DATETIME

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Production Stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
