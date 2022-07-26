# Build process (mainly turns *.ts into *.js)
FROM node:lts-alpine AS build
WORKDIR /usr
COPY package.json /usr/
COPY package-lock.json /usr/
COPY tsconfig.json /usr/
COPY src/ /usr/src/
RUN npm ci
RUN npm run build

# Run process
FROM node:lts-alpine
RUN apk update && apk add tesseract-ocr && apk add tesseract-ocr-data-ind
ENV NODE_ENV production
WORKDIR /usr
COPY --from=build /usr/package.json ./
COPY --from=build /usr/package-lock.json ./
COPY --from=build /usr/dist .
RUN mkdir -p images
RUN npm ci --only=production
RUN npm install pm2 -g
EXPOSE 8000
CMD ["pm2-runtime","index.js"]
