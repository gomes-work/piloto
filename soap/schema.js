const promisify = require('promisify-node');
const fs = promisify('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

function replaceSchema(content) {
	const regex = /schemaLocation=".+%2F(.+)"/g;
	return content.replace(regex, 'schemaLocation="http://localhost:3000/xsd/$1.xsd"');
}

function replaceSchemaXSD(content) {
	const regex = /schemaLocation="(.+)"/g;
	return content.replace(regex, 'schemaLocation="http://localhost:3000/xsd/$1"');
}

function containsMethod(method) {
	return ['Pessoa', 'AgendamentoLoja', 'Ponto'].includes(method);
}

app.get('/xsd/:file', function(req, res){
	console.log(`reading ${req.params.file}...`);
	fs.readFile(`${__dirname}/xsd/${req.params.file}`, 'utf-8')
		.then(replaceSchemaXSD)
		.then(content => {
			res.set('Content-Type', 'text/xml');
			res.send(content);
		})
		.catch(err => {
			res.status(500);
			res.send(err.message);
		});
});

app.get('/:method', function (req, res, next) {

	const method = req.params.method;

	if (!containsMethod(method)) { next(); return; }

	console.log(`reading ${method}.wsdl...`);

	fs.readFile(`${__dirname}/wsdl/${method}.wsdl`, 'utf-8')
		.then(replaceSchema)
		.then(content => {
			res.set('Content-Type', 'text/xml');
			res.send(content);
		})
		.catch(err => {
			res.status(500);
			res.send(err.message);
		});
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
