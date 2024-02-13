FROM node
WORKDIR /inc
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 8080
RUN npm test
CMD ["npm","start"]