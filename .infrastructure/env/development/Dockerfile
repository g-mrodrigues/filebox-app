FROM node:latest

WORKDIR /usr/src/app

RUN apt update && apt install yarn -y && yarn install

EXPOSE 3000

RUN ls /usr/src/app

CMD [ "yarn", "dev" ]