#docker run -d -p 4369:4369 -p 5671:5671 -p 5672:5672 -p 15672:15672 --hostname rabbitmq --name rabbit -e RABBITMQ_HIPE_COMPILE=1 rabbitmq:3-management
docker run --name redis -p 6379:6379 -d redis:3.2.6
#pm2-dev start ./soap/schema.js
