import * as config from '../config';

import fs from 'fs';
import url from 'url';
import http from 'http';
import {argv} from 'yargs';
import winston from 'winston';

import koa from 'koa';
import koaRouter from 'koa-router';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';

import * as webpack from './webpack';
import * as io from './io';

import React from 'react';
import store from '../store';
import AppWrapper from '../app/AppWrapper.jsx';

// Setup logging options
winston.addColors(winston.config.syslog.colors);

// Determine the DEBUG status
const DEBUG = !argv.release;

// Generate new Koa instance that will serve our 
// static index.html file
let app = koa();

// Add the router middleware to the Koa instance
app.use(koaRouter(app));

// Production mode, we'll serve the `build` directory which
// houses the pre-built `app`
if(!DEBUG) {
	app.use(koaStatic(config.paths.build))
}

// Base route, which serves up our index.html file
app.get('/', function* () {
	let index = fs.readFileSync(config.paths.index).toString();

	// Return HTML Content-type 
	this.type = 'html';

	// Process and return the index.html file, replacing placeholder values...
	this.body = index

	// ${APP} => Rendered application HTML
	.replace('${APP}',
		React.renderToString(
			React.createFactory(AppWrapper)({
				store: store
			})
		)
	)

	// ${STORE} => JSONified Store
	.replace('${STORE}',
		JSON.stringify(store)
	)

	// ${ENTRY_POINT} => Main entry point script
	.replace('${ENTRY_POINT}', 
		url.resolve(config.baseUrl, 'app.js')
	);
});

// Install other services (with async support)
Promise.all([
	webpack.install(app)
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