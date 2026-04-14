FROM node:24-slim

WORKDIR /app

COPY package*.json .
RUN npm install

CMD ["npx", "vite", "--host", "0.0.0.0"]
