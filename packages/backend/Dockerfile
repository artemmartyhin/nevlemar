# Use an official Node runtime as a parent image
FROM node:19

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

# Expose port 3001 for the backend
EXPOSE 3001

# Command to run the app
CMD ["yarn", "start"]