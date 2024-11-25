# Use the official Node.js image as the base image
FROM node:lts-alpine

ARG APP_NAME

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN corepack enable pnpm && pnpm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build -- ${APP_NAME}
RUN mv dist/apps/${APP_NAME} dist/app

# Command to run the application
CMD ["node", "dist/app/main"]