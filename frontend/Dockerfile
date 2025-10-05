FROM node:20-slim AS build
WORKDIR /app
ARG APP_ENV=production

COPY package*.json ./
RUN npm install

COPY . .
RUN cp .env.${APP_ENV} .env
RUN npm run build

FROM nginx:1.25-alpine
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]