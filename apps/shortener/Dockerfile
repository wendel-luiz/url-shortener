# Use an official Node.js runtime as a parent image
FROM node:20-slim

ENV NODE_ENV=dev
ENV SERVER_PORT=3000
ENV SERVER_NAME=simple-rbac-node
ENV TOKEN_SECRET=secret
ENV DB_PORT=5432
ENV DB_HOST=database
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=iam
ENV AMQP_URL=rabbitmq
ENV SERVER_URL=http://localhost:3001/

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]