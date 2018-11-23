# Using lightweight Node.js base with Yarn to install our dependencies and build and export the app
FROM mhart/alpine-node:10

# Set the working directory and copy over package manager specific files
WORKDIR /usr/src
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files to the working directory
COPY . .

# Build the app and export the static files to the `public` directory
RUN npm run build && npm run export -o /public