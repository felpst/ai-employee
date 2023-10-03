FROM node:16.14-alpine

WORKDIR /core
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "serve:core" ]