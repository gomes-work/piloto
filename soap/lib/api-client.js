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

function greetings(name) {
	return act({cmd: 'salute'}, {name});
}

module.exports = function () {
	return { greetings };
};
