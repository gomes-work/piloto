function getConfig(seneca) {
	if (process.env.QUEUE_URL.startsWith('ampq://')) return configure_rabbitmq(seneca);
	else return configure_nats(seneca);
}

function configure_nats(seneca) {
	seneca.use('nats-transport', {
		nats: {servers: [process.env.QUEUE_URL]}
	})	
	.client({type:'nats'});

	return seneca;
}

function configure_rabbitmq(seneca) {
	seneca.use('seneca-amqp-transport', { amqp: { 
		socketOptions: { noDelay: true },
		queues: {options: { durable: false }}
	}})
	.client({
		type: 'amqp',
		pin: 'cmd:salute',
		url: process.env.QUEUE_URL
	});

	return seneca;
}

const client = getConfig(require('seneca')());


const act = require('bluebird').promisify(client.act, {context: client});
// const logger = require('../lib/logger').logger;

function greetings(name) {
	// logger.info(`sending greeting ${name}`);
	// const correlationId = require('../lib/logger').getContext().correlationId;

	return act({cmd: 'salute'}, {name});
}

module.exports = function () {
	return { greetings };
};
