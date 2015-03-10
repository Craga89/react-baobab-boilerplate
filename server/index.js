import * as config from '../config';

import fs from 'fs';
import http from 'http';

import koa from 'koa';
import koaRouter from 'koa-router';
import koaProxy from 'koa-proxy';

import * as webpack from './webpack';
import * as io from './io';

import React from 'react';
import store from '../store';
import AppWrapper from '../app/AppWrapper.jsx';


// Generate new Koa instance that will serve our 
// static index.html file
let app = koa();

// Add the router middleware to the Koa instance
app.use(koaRouter(app))

// Base route, which serves up our index.html file
app.get('/', function* () {
	let index = fs.readFileSync(config.paths.index).toString();

	// Return HTML Content-type 
	this.type = 'html';

	// Replace {{APP}} and {{STORE}} placeholders
	this.body = index
		.replace('${APP}',
			React.renderToString(
				React.createFactory(AppWrapper)({
					store: store
				})
			)
		)
		.replace('${STORE}',
			JSON.stringify(store)
		);
});

// Add proxy middleware that will transparently forward all other
// requests made to the Koa server onto the WebpackDevServer
app.use(koaProxy({
	host: `http://${config.host}:${config.webpackServer.port}`
}));

// Start the server listening
let server = http.createServer(app.callback());
server.listen(config.port, function () {
	console.log(`App listening at ${config.host}: ${config.port}`);
		
	// Install other services
	webpack.install(app, server);
	io.install(app, server);
});
