FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm cache clean --force && npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
