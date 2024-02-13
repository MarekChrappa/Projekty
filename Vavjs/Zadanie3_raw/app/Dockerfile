FROM node:18.12.1
#:lts-alpine3.15
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "start"]