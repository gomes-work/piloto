/** global console */

const soap = require('soap');
const request = require('request');

const request_with_defaults = request.defaults({
	//'proxy': 'http://localhost:8888',
	'timeout': 10000,
	'connection': 'keep-alive'
});

const soap_client_options = {
	'request': request_with_defaults
};

const soapSecurity = new soap.WSSecurity('VolTav', 'vivovoltav', { hasTimeStamp: false, hasTokenCreated: false });

const WSDL_PESSOA = 'http://localhost:3000/Pessoa?wsdl';
const WSDL_PONTO = 'http://localhost:3000/Ponto?wsdl';
const WSDL_AGENDAMENTO = 'http://localhost:3000/AgendamentoLoja?wsdl';


const header = {
	cabecalhoVivo: {
		loginUsuario: 'MeuVivo',
		canalAtendimento: '1',
		codigoSessao: '1',
		nomeAplicacao: 'MeuVivo',
		enderecoIP: '127.0.1.1',
		codigoFuncionalidade: '6',
		dataTransacao: '2013-10-31T23:37:26.544-02:00'
	}
};



function newSOAPClient(wsdl) {
	return new Promise(function(resolve, reject) {
		soap.createClient(wsdl, soap_client_options, function (err, client) {
			if (err) { reject(err); return; }
			client.setSecurity(soapSecurity);
			client.addSoapHeader(header, '', 'gr');
			resolve(client);
		});
	});
}

function executeSOAPFunction(func, attr) {
	return new Promise(function (resolve, reject) {
		func(attr, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
}

module.exports = {
	init: function() {
		return Promise.all([
			newSOAPClient(WSDL_AGENDAMENTO),
			newSOAPClient(WSDL_PESSOA),
			newSOAPClient(WSDL_PONTO)
		]);
	},

	buscarPessoaPorLinha: function buscarPessoaPorLinha(attr) {
		return newSOAPClient(WSDL_PESSOA)
			.then(client =>
				executeSOAPFunction(client.buscarPessoaPorLinha.bind(client), attr)
			);
	},

	buscarLojasMunicipio: function buscarLojasMunicipio(attr) {
		const args = {
			'age:codigoCidade': attr.codigoCidade,
			'age:agendamentoPremium': attr.agendamentoPremium,
			'age:agendamentoComum': attr.agendamentoComum
		};
		return newSOAPClient(WSDL_AGENDAMENTO)
			.then(client =>
				executeSOAPFunction(client.buscarLojasMunicipio.bind(client), args)
			);
	},

	buscarListaPontos: function buscarListaPontos(attr) {
		return newSOAPClient(WSDL_PONTO)
			.then(client =>
				executeSOAPFunction(client.buscarListaPontos.bind(client), attr)
			);
	},
};
