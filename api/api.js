'use strict';

const os = require('os');
const ip = (os.networkInterfaces()['eth0'] || [])
	.map(addr => addr.address)
	.filter(addr => addr.match(/^\d+\.\d+/))
	.join(',')

require('seneca')()
	/*.use('seneca-amqp-transport', { amqp: { 
		socketOptions: { noDelay: true },
		queues: {options: { durable: false }}
	}})*/
	.use('nats-transport')
	.add('cmd:salute', (message, done) => {
		done(null, {
			id: Math.random(),
			message: `Hello ${message.name}!`,
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