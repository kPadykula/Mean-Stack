# Stage one
FROM node:18 as node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install -g npm@8.10.0

RUN npm install

COPY .  .

RUN npm run build #dist

# Stage two

FROM nginx:1.21.6-alpine

COPY --from=node /usr/src/app/dist/mean-stack/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
