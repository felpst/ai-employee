FROM node:18-alpine


WORKDIR /app

RUN chmod 777 /app

COPY package*.json .

COPY . .

RUN apk add --no-cache make gcc g++ python3 

RUN npm install

EXPOSE 3000


