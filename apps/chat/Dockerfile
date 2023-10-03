FROM node:16.14-alpine

WORKDIR /chat
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3030

CMD [ "npm", "run", "serve:chat" ]