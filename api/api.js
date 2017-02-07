'use strict';

const os = require('os');
const ip = (os.networkInterfaces()['eth0'] || [])
	.map(addr => addr.address)
	.filter(addr => addr.match(/^\d+\.\d+/))
	.join(',')

// const logger = require('./lib/logger').logger;

function getConfig(seneca, callback) {
	if (process.env.QUEUE_URL.startsWith('ampq://')) configure_rabbitmq(seneca, callback);
	else configure_nats(seneca, callback);
}

function configure_nats(seneca, callback) {
	seneca.use('nats-transport', {
		nats: {servers: ['nats://queue:4222']}
	})	
	callback(seneca)
	seneca.listen({type:'nats'});
}

function configure_rabbitmq(seneca, callback) {
	seneca.use('seneca-amqp-transport', { amqp: { 
		socketOptions: { noDelay: true },
		queues: {options: { durable: false }}
	}})
	callback(seneca)
	.listen({
		type: 'amqp',
		pin: 'cmd:salute',
		url: process.env.QUEUE_URL
	});
}

getConfig(require('seneca')(), function(seneca) {
	seneca.add('cmd:salute', (message, done) => {
		// require('../soap/lib/logger').updateContext(
		// 	{
		// 		correlationId: message.correlationId,
		// 		endpoint: 'api'
		// 	}
		// )
		// logger.info("received message from rest")
		
		done(null, {
			id: Math.random(),
			message: `Hello ${message.name}!`,
			correlationId: message.correlationId,
			api: ip,
			now: Date.now()
		});
	})
	return seneca;
});


