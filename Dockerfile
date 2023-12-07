FROM node:19-alpine as build

WORKDIR /app

COPY . .

RUN npm ci && \
  npm run build



FROM alpine:3.16 as main

ENV NODE_VERSION 19.6.0

WORKDIR /app

RUN apk update && \
    apk add nodejs \
    npm

COPY --from=build /app/dist /app/dist

COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/package*.json /app

EXPOSE 5000

CMD ["node", "dist/main.js"]