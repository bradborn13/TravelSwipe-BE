FROM node:22-alpine

WORKDIR /app

# Install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

EXPOSE 5001

# Run compiled output
CMD ["node", "dist/main.js"]