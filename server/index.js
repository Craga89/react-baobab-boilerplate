import * as config from '../config';

import http from 'http';
import winston from 'winston';
import koa from 'koa';
import koaRouter from 'koa-router';

import * as webpack from './webpack';
import * as react from './react';
import * as io from './io';
import * as components from './components/index';

// Generate new Koa instance with middleware applied
let app = koa();
app.use(koaRouter(app));

// Install other services (with async support)
Promise.all([
	react.install(app),
	webpack.install(app),
	components.install(app)
])

// Once installed, listen!
.then(() => {
	// Generate new HTTP server from the Koa app
	let server = http.createServer(app.callback());

	return new Promise(function(resolve, reject) {
		// Start the server listening
		server.listen(config.port, config.host, (err) => {
			if(err) { reject(err); }

			// Log out
			winston.info('[server]', `App listening at ${config.host}:${config.port}`);

			resolve(server);
		})
	})
})

// If we listened  successfully, finalize by calling
// the other services `listen` callbacks
.then((server) => {
	return Promise.all([
		webpack.listen(app, server),
		io.listen(app, server),
	])
})

// Log any errors and exit
.catch((err) => {
	winston.error('[server]', err);
	exit(1);
});