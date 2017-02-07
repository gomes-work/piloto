var winston = require('winston');

module.exports = function (metaParent = {}, {level = 'info', subdomain = 'vivo', options}) {

	let logger = new winston.Logger({
		level,
		subdomain,
		transports: [
			new (winston.transports.Console)(options)
		],
		rewriters: [function (level, msg, meta) {
			return Object.assign({}, metaParent, meta);
		}]
	});

	return logger;
};
/*require('winston-loggly-bulk');

var _context = null;

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Loggly)({
			token: '0d5874f3-6b57-4c10-834a-87e2f6a78426',
			'auth': {
				'username': 'workco',
				'password': 'Workandc0'
			},
			subdomain: 'workco',
			tags: ['Winston-NodeJS'],
			json: true
		}),
		new (winston.transports.Console)()
	],
	rewriters: [function (level, msg, meta) {
		let context = _context || {};
		return Object.assign({}, meta, {
			correlationId: context.correlationId,
			timestamp: Date.now(),
			endpoint: context.endpoint
		});
	}]
});

var updateContext = function (context) {
	_context = Object.assign({}, _context, context);
};

var getContext = function () {
	return _context;
};

module.exports = {
	logger,
	updateContext,
	getContext
};*/
