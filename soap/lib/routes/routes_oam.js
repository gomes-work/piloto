'use strict';

const oam = require('../oam');

function wrapFunction(funcaoOAM) {
	return function(req, res) {
		funcaoOAM({login: req.body.login, password: req.body.password})
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
