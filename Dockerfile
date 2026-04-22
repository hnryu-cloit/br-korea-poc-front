FROM node:20-slim

WORKDIR /app

ENV VITE_DEFAULT_STORE_ID=POC_010
ENV VITE_DEFAULT_REFERENCE_DATETIME=2026-03-05T00:00

COPY package*.json ./
RUN npm install

COPY . .

# Vite 개발 서버를 6003 포트로 노출
EXPOSE 6003

# 호스트 0.0.0.0 설정 필수
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "6003"]
