const redis = require('redis');
const apicache = require('apicache');
const cache = apicache
								.options({ redisClient: redis.createClient(6379, 'redis') })
								.middleware;
module.exports=cache;
