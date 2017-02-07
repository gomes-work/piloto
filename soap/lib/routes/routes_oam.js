'use strict';

const oam = require('../oam');

function wrapFunction(logger, funcaoOAM) {
	return function(req, res) {
		const correlationId = req.params.correlationId;

		funcaoOAM({login: req.body.login, password: req.body.password}, logger)
			.then((token) => res.json(token))
			.catch((err) => {
				res.status(500);
				res.send(err.message);
			});
	};
}

module.exports = function(app) {

	app.post('/login/porCPF', wrapFunction(oam.loginByCPF));
	app.post('/login/porEmail', wrapFunction(oam.loginByEmail));
	app.post('/login/porFacebook', wrapFunction(oam.loginByFacebook));
	app.post('/login/porMSISDN', wrapFunction(oam.loginByMSISDN));

};
