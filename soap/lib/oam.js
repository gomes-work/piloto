'use strict';

const request = require('request-promise');

const BASIC_LOGIN = 'oamcryptuser';
const BASIC_PASSWORD = 'welcome1';
const BASIC_AUTH = new Buffer(BASIC_LOGIN + ':' + BASIC_PASSWORD).toString('base64');

const OPTIONS_BASE = {
	timeout: 1000
};


const CRYPT_URL = 'https://autenticadev.vivo.com.br/OAMServices/oamcrypt/';
const OPTIONS_CRYPT = Object.assign({}, OPTIONS_BASE, {
	method: 'POST',
	uri: CRYPT_URL,
	form: { },
	headers: { 'Authorization': `Basic ${BASIC_AUTH}` }
});

const AUTH_URL = 'https://autenticadev.vivo.com.br/OAMServices/authnlogin/';
const OPTIONS_AUTH = Object.assign({}, OPTIONS_BASE, {
	uri: AUTH_URL,
	json: true
});

const LOGIN_TYPE_CODES = {
	'email': 		1,
	'cpf': 			2,
	'telefone': 3,
	'facebook': 4
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function buildOptions(loginInfo) {
	let form = {
		param1: loginInfo.login,
		param2: loginInfo.password,
		param3: 'PF',
		param4: getLoginCodeByType(loginInfo.type)
	};

	if (!form.param4) throw new Error(`Tipo de login ${loginInfo.type} inválido`);

	return Object.assign({}, OPTIONS_CRYPT, {form});
}

function getLoginCodeByType(type) {
	return LOGIN_TYPE_CODES[type];
}

function crypt(loginInfo) {
	try {
		let options = buildOptions(loginInfo);
		return request(options);
	} catch(ex) {
		return Promise.reject(ex);
	}
}

function authenticateByToken(token) {
	return request(Object.assign({}, OPTIONS_AUTH, {uri: `${AUTH_URL}${token}`}))
		.then(response => {
			if (response.codigo !== 0) throw new Error(JSON.stringify(response));
			return response;
		});
}

function cryptAndAuthenticate(authObject) {
	return crypt(authObject)
		.then(authenticateByToken);
}

module.exports = {
	crypt,
	authenticateByToken,
	loginByEmail: ({login, password}) => cryptAndAuthenticate({login, password, type: 'email'}),
	loginByCPF: ({login, password}) => cryptAndAuthenticate({login, password, type: 'cpf'}),
	loginByMSISDN: ({login, password}) => cryptAndAuthenticate({login, password, type: 'telefone'}),
	loginByFacebook: ({login, password}) => cryptAndAuthenticate({login, password, type: 'facebook'})
};
