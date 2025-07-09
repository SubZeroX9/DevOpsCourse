# Use official Node.js LTS image
FROM node:22

# Set working directory inside container
WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port the app runs on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
