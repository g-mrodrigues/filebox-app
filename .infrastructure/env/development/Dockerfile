FROM node:latest

WORKDIR /usr/src/app

RUN apt update && apt install yarn -y
EXPOSE 3000

RUN ls /usr/src/app

CMD [ "yarn", "initial" ]