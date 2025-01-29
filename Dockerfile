FROM node:18-alpine


WORKDIR /app

RUN chmod 777 /app

COPY package*.json .

COPY . .

RUN apk add --no-cache make gcc g++ python3 

RUN npm install --force

EXPOSE 3000
EXPOSE 4200
EXPOSE 8080
