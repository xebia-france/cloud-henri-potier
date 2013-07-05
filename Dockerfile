FROM node:12.14.1-stretch

WORKDIR  /app
ADD . /app
RUN npm install --production

CMD node app.js