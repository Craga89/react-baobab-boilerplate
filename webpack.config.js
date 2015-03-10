require('babel/register');

var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var config = require('./config');

// Flags
var DEBUG = !argv.release;

var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
	'"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24"' +
	'"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	'__DEV__': DEBUG
};


// Configuration object
module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:3080',
		'webpack/hot/only-dev-server',
		path.join(config.paths.app, 'main.jsx')
	],

	cache: DEBUG,
	debug: DEBUG,
	devtool: DEBUG ? '#inline-source-map' : false,

	output: {
		filename: 'app.js',
		path: config.paths.build,
		publicPath: '/'
	},

	externals: {
		'socket.io': 'io'
	},

	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.HotModuleReplacementPlugin()
	],

	eslint: {
		configFile: path.resolve(__dirname, '.eslintrc')
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: [
					'style',
					'css',
					AUTOPREFIXER_LOADER
				]
			},
			{
				test: /\.less$/,
				loaders: [
					'style',
					'css',
					AUTOPREFIXER_LOADER,
					'less'
				]
			},
			{
				test: /\.gif/,
				loader: 'url?limit=10000&mimetype=image/gif'
			},
			{
				test: /\.jpg/,
				loader: 'url?limit=10000&mimetype=image/jpg'
			},
			{
				test: /\.png/,
				loader: 'url?limit=10000&mimetype=image/png'
			},
			{
				test: /\.svg/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			},
			{
				test: /\.json/,
				loader: 'json'
			},
			{
				test: /\.jsx?$/,
				exclude: [config.paths.nodeModules],
				loaders: ['react-hot', 'babel?experimental&optional=runtime']
			}
		]
	}
};
