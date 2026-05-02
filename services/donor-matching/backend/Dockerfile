FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm cache clean --force && npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]