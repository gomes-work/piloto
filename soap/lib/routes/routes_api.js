'use strict';

const apiClient = require('../api-client')();

module.exports = function(app) {
	app.get('/api/:name', function(req, res) {
		apiClient.greetings(req.params.name)
			.then(greet => res.json(greet))
			.catch(err => {
				res.status(500);
				res.send(err);
			});
	});
};
