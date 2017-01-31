const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/*const redis = require('redis');
const apicache = require('apicache');
const cache = apicache
								.options({ redisClient: redis.createClient(6379, 'redis') })
								.middleware;
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('ContainerId', process.env.CONTAINER_ID || 'none');
	res.setHeader('Content-Type','application/json');
	return next();
});

//require('./lib/routes/routes_soap.js')(app, cache);
//require('./lib/routes/routes_api.js')(app);
require('./lib/routes/routes_oam.js')(app);

app.get('/ping', function(req, res) {
	res.send('OK!');
});


app.listen(8080, function () {
	console.log(`Rest Service listening on ${8080}!`);
});