import * as config from '../config';
import webpackConfig from '../webpack.config';

import fs from 'fs';
import path from 'path';
import winston from 'winston';
import koaProxy from 'koa-proxy';
import koaStatic from 'koa-static';
import {argv} from 'yargs';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// Determine the DEBUG status
const DEBUG = !argv.release;

// Build callback
async function onBuild(err, result) {
	if(err) { throw err; }
	let stats = result.toJson();

	// Log it
	winston.info('[webpack]', 'Application successfully re-built! Writing stats.json...');

	// Write out the build stats to the build directory as a `stats.json` file
	await fs.writeFile(
		path.resolve(config.paths.build, 'stats.json'),
		JSON.stringify(stats, null, '\t')
	);

	return result;
}

// Installer method
export async function install(app) {
	// In DEBUG mode, add  a proxy middleware that will transparently forward 
	// all requests made to the Koa server onto a WebpackDevServer instance
	// that we'll setup in the `listen` callback below
	if(DEBUG) {
		app.use(koaProxy({
			host: `http://${config.host}:${config.webpackServer.port}`
		}));
	}

	// In production, we'll simply build once and serve it
	else {
		app.use(koaStatic(config.paths.build));

		return new Promise((resolve, reject) => {
			winston.info('[webpack]', 'Building application...');

			webpack(webpackConfig, async function(err, stats) {
				if(err) { reject(err); }
				onBuild(err, stats).then(resolve, reject);
			});
		});
	}
}

// Listener method
export function listen() {
	if(!DEBUG) { return; }

	// Generate new WebpackDevServer instance that will bundle
	// our app for us
	let server = new WebpackDevServer(
		webpack(webpackConfig, onBuild),
		config.webpackServer
	);

	server.listen(config.webpackServer.port, config.host, function () {
		winston.info('[webpack]', `Bundler listening at ${config.host}:${config.webpackServer.port}`);
	});
}