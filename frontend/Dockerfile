FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
# Since you've been using Yarn elsewhere, I recommend sticking to it here:
RUN npm install

COPY . .

EXPOSE 3000

# Bind to 0.0.0.0 so Docker can "see" the app
ENV HOSTNAME="0.0.0.0"

# Standard Next.js dev command
CMD ["npm", "run", "dev"]