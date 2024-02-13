FROM node:lts-alpine3.15
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4173
CMD [ "npm", "run", "deploy" ]