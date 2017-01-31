const soap = require('../soap');

module.exports = function(app, cache) {

	app.get('/pessoa/porLinha/:numeroLinha', cache('5 minutes'), function(req, res) {
		soap.buscarPessoaPorLinha({numeroLinha: req.params.numeroLinha}) //{numeroLinha: '11975459236'}
			.then(dados => res.send(dados))
			.catch(err => {
				res.status(500);
				res.send(err.message);
			});
	});

	app.get('/pontos/porDocumento/:nrDocumento', cache('5 minutes'), function(req, res) {
		soap.buscarListaPontos({nrDocumento: req.params.nrDocumento}) //{nrDocumento: 28527616882}
			.then(dados => res.send(dados))
			.catch(err => {
				res.status(500);
				res.send(err.message);
			});
	});

	app.get('/loja/porMunicipio/:codigoCidade', cache('5 minutes'), function(req, res) {

		const agendamentoPremium = 1;
		const agendamentoComum = 0;
		const args = Object.assign({codigoCidade: req.params.codigoCidade}, {agendamentoPremium, agendamentoComum});

		soap.buscarLojasMunicipio(args)
			.then(dados => res.send(dados))
			.catch(err => {
				res.status(500);
				res.send(err.message);
			});
	});

};
