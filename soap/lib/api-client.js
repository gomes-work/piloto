const client = require('seneca')()
	.use('nats-transport', {
		nats: {servers: ['nats://queue:4222']}
	})
    .client({type:'nats'});
	/*.use('seneca-amqp-transport', { amqp: {
		socketOptions: { noDelay: true },
		queues: {options: {durable: false }},
	}})
	.client({
		type: 'amqp',
		pin: 'cmd:salute',
		url: process.env.AMQP_URL
	});*/


const act = require('bluebird').promisify(client.act, {context: client});
const logger = require('../lib/logger').logger;

function greetings(name) {
	logger.info(`sending greeting ${name}`);
	const correlationId = require('../lib/logger').getContext().correlationId;

	return act({cmd: 'salute'}, {name, correlationId});
}

module.exports = function () {
	return { greetings };
};
