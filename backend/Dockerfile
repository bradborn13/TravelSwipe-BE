

FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json yarn.lock* ./
RUN yarn install

# Copy the rest of the code
COPY . .

# NestJS default port is 3000, but we change it to 5001 in main.ts
EXPOSE 5001

# Start in development mode with watch enabled
CMD ["yarn", "start:dev"]