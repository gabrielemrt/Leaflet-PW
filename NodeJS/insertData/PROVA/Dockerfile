FROM node:latest

WORKDIR /app

#COPY package*.json ./
COPY . .
RUN npm install

CMD ["npm", "run", "form.js"]
#EXPOSE 3000
