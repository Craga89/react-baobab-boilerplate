import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import * as config from '../config';
import webpackConfig from '../webpack.config';

// Generate new WebpackDevServer instance that will bundle
// our app for us
let server = new WebpackDevServer(
	webpack(webpackConfig),
	config.webpackServer
);

// Installer method
export function install() {
	server.listen(config.webpackServer.port, config.host, function () {
		console.log(`Bundler listening at ${config.host}: ${config.webpackServer.port}`);
	});
}