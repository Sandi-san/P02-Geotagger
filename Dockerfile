# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8080

# Use docker-compose to handle Prisma setup before running the app
CMD ["npm", "run", "start"]
