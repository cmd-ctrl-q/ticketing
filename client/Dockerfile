FROM node:alpine

# Create a work directory /app and cd into it
WORKDIR /app
# copy the package.json into the work directory
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]