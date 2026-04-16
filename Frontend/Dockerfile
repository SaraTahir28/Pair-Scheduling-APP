FROM node:24-slim AS dev

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

CMD ["npx", "vite", "--host", "0.0.0.0"]

FROM dev AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
