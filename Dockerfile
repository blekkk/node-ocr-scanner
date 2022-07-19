FROM node:lts-alpine
WORKDIR /usr
COPY package.json /usr/
COPY package-lock.json /usr/
COPY tsconfig.json /usr/
COPY src/ /usr/src/
RUN npm ci
RUN npm run build

FROM node:lts-alpine
RUN apk update && apk add tesseract-ocr && apk add tesseract-ocr-data-ind
ENV NODE_ENV production
WORKDIR /usr
COPY package.json ./
COPY package-lock.json ./
RUN mkdir -p images
RUN npm ci --only=production
COPY --from=0 /usr/dist .
RUN npm install pm2 -g
EXPOSE 8000
CMD ["pm2-runtime","index.js"]
