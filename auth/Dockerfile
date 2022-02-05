FROM node:alpine

WORKDIR /app
# copy over package json
COPY package.json .
# run dependencies
RUN npm i
# copy everything else into /app
COPY . .

# start application
CMD ["npm", "start"]