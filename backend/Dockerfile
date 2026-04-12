FROM node:20-alpine

# Install Python + yt-dlp for YouTube downloads
RUN apk add --no-cache python3 py3-pip ffmpeg && \
    pip3 install --break-system-packages yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY proxy.js .

EXPOSE 8000

ENV COBALT_URL=http://cobalt:8000

CMD ["npm", "start"]
