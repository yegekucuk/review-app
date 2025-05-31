FROM node:lts-alpine

WORKDIR /app

# Bağımlılıklar
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY . .
EXPOSE 3000
CMD ["node", "backend/server.js"]
