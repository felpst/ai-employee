FROM node:18-alpine


WORKDIR /app

RUN chmod 777 /app

COPY package*.json .

COPY . .

RUN apk add --no-cache make gcc g++ python3 

RUN npm install

EXPOSE 3000

ENV PROD="false"
ENV PORT=3000
ENV OPENAI_API_KEY="***REMOVED***"
ENV MONGO_URL="mongodb://mongodb:27017/mydb"
ENV AUTH_SECRET_KEY="***REMOVED***"
ENV CORS_ORIGIN='["https://localhost:4200"]'
ENV EMAIL_USER=""
ENV EMAIL_PASSWORD=""
ENV SERPAPI_API_KEY="***REMOVED***"