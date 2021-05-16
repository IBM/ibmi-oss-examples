FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
CMD [ "node", "toolkit.js" ]
