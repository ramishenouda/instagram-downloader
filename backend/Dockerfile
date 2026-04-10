FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY proxy.js .

EXPOSE 8000

ENV COBALT_URL=http://cobalt:5000

CMD ["npm", "start"]
