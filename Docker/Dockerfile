FROM node:7.7.2-alpine

COPY ../NodeJS .
WORKDIR /usr/app/nodeapp
RUN node mon
RUN npm install -gy nodemon
RUN npm start 
