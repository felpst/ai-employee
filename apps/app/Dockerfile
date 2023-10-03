FROM node:16.14-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3035

CMD [ "npm", "run", "serve:app" ]