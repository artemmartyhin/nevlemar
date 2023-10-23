# Use an official Node runtime as a parent image
FROM node:19

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

# Build the app
RUN yarn build

# Expose port 3000 for the frontend
EXPOSE 3000

# Command to serve the app using serve package
CMD ["npx", "serve", "-s", "build", "-l", "3000"]