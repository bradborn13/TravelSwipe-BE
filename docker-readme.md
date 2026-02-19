// backup
docker exec mongodb mongodump \
 --username admin \
 --password secretpassword \
 --authenticationDatabase admin \
 --db travelswipe \
 --out /data/backup

// Restore
docker exec mongodb mongorestore \
 --username admin \
 --password secretpassword \
 --authenticationDatabase admin \
 /data/backup/travelswipe

docker-compose build frontend

For Local Development (The "Development" stage)
You don't even need to change your docker-compose.yml. But if you want to build just the dev part manually:

docker build --target development -t travelswipe-fe:dev ./frontend

For Azure (The "Production" stage)
When you build for the cloud, Docker will automatically see the production stage as the final one:

# Build for production (AMD64 for Azure compatibility)

docker build --platform linux/amd64 --no-cache -t lucianxconst/travelswipe-frontend:latest ./frontend
docker build --platform linux/amd64 --no-cache -t lucianxconst/travelswipe-backend:latest ./backend

# Push to Hub

docker push lucianxconst/travelswipe-frontend:latest
docker push lucianxconst/travelswipe-backend:latest

docker build --build-arg NEXT_PUBLIC_API_URL={backend-azure-url} --no-cache -t lucianxconst/travelswipe-frontend:latest ./frontend

Modern JavaScript, CSS and Web APIs
Component-based, declarative UIs (we use React)
CSS-in-JS (we use styled-components)
Linting and testing frameworks (we use Jest + RTL and Vitest)
Static types (we use TypeScript)
Data fetching and mutations (we use tRPC, SWR)
