FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production=false --frozen-lockfile

COPY . .

RUN yarn build


FROM node:18-alpine as main

WORKDIR /app

COPY --from=build /app/dist /app/dist

COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/package*.json /app

EXPOSE 5000

CMD node dist/main.js