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
