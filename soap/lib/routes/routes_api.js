'use strict';

const apiClient = require('../api-client')();
// const logger = require('../logger').logger;

module.exports = function(app) {
	app.get('/api/:name', function(req, res) {
		// logger.info(`gretting ${req.params.name}`);
		apiClient.greetings(req.params.name)
			.then(greet => res.json(greet))
			.catch(err => {
				res.status(500);
				res.send(err);
			});
	});
};
