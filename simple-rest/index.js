const express = require('express');
const bodyParser = require('body-parser');
const app = express();

console.log('Hello World from simple rest!');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('ContainerId', process.env.CONTAINER_ID || 'none');
	res.setHeader('Content-Type','application/json');

	return next();
});

app.get('/time/:time', function(req, res) {
	console.log("new request")
	setTimeout((function() {res.json({
			id: Math.random(),
			message: 'Hello simple rest',
			now: Date.now()
		})}), req.params.time)
});


app.listen(8080, function () {
	console.log(`Rest Service listening on ${8080}!`);
});
