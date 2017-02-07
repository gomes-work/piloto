'use strict';

const os = require('os');
const ip = (os.networkInterfaces()['eth0'] || [])
	.map(addr => addr.address)
	.filter(addr => addr.match(/^\d+\.\d+/))
	.join(',')

// const logger = require('./lib/logger').logger;

require('seneca')()
	/*.use('seneca-amqp-transport', { amqp: { 
		socketOptions: { noDelay: true },
		queues: {options: { durable: false }}
	}})*/
	.use('nats-transport', {
		nats: {servers: ['nats://queue:4222']}
	})
	.add('cmd:salute', (message, done) => {
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
	.listen({type:'nats'});
	/*.listen({
		type: 'amqp',
		pin: 'cmd:salute',
		url: process.env.AMQP_URL
	});*/
