import path from 'path';

// Host port, and base URL
export let host = 'localhost';
export let port = 3000;
export let baseUrl = '/';


// Paths
let basePath = path.resolve(__dirname);
export let paths = {
	base: basePath,
	nodeModules: path.join(basePath, 'node_modules'),
	index: path.join(basePath, 'index.html'),
	store: path.join(basePath, 'store.js'),
	app: path.join(basePath, 'app'),
	build: path.join(basePath, 'build')
};


// Webpack Server
export let webpackServer = {
	port: port + 80,
	contentBase: path.join(basePath, 'build'),
	hot: true,
	quiet: true,
	noInfo: false,
	publicPath: baseUrl,
	stats: {
		colors: true
	},
	historyApiFallback: true
};


// Socket.IO Server
export let ioServer = {

};


// Logging configuration
export let logging = {

};