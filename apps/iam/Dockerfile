# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application code to the working directory
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build the application
RUN yarn build

# Expose port 80
EXPOSE 80

# Start the application
CMD [ "yarn", "start" ]