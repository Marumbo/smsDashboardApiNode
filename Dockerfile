FROM node:20-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD npm start
