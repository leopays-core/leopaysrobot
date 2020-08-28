FROM node:lts

ENV NODE_ENV production
ENV DATA_DIR /data

ARG release=latest

WORKDIR /leopaysrobot

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --silent && mv node_modules ../

COPY . .
RUN rm -R docker && mkdir /data

EXPOSE 80 443
VOLUME ["/data"]

CMD yarn run start:prod
