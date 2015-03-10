require('babel/register');

var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var config = require('./config');

// Internal flags - Don't edit these!!!!1
var DEBUG = !argv.release;
var DEV_SERVER_URL = ['http', '//' + config.host, config.webpackServer.port].join(':');


// Custom Flags - Edit these!!!!!!111
var IMAGE_INLINE_LIMIT = 10000; // Maximum imagefilesize (in bytes) to inline


// Global variables that will be available to all scripts without needing
// to be `require`d
var GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	'__DEV__': DEBUG
};


// Entry points - In production we'll have only the `main.jsx` entry.
// However in DEBUG, we'll enable Webpacks "Hot Module Replacement"
// functionality for fast development!
exports.entry = [
	path.join(config.paths.app, 'main.jsx')
];

if(DEBUG) {
	exports.entry = [
		'webpack-dev-server/client?' + DEV_SERVER_URL,
		'webpack/hot/only-dev-server'
	]
	.concat(exports.entry);
}


// Output definition - We'll build into a single app.js file by default
exports.output = {
	filename: 'app.js',
	publicPath: config.baseUrl,
	path: config.paths.build
};


// Plugins
exports.plugins = [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.DefinePlugin(GLOBALS)
];

if(DEBUG) {
	// Hot Module Replacement ftw
	exports.plugins = exports.plugins.concat([
		new webpack.HotModuleReplacementPlugin()
	]);
}

else if(!DEBUG) {
	// Minification and merging in production for small(ish) builds!
	exports.plugins = exports.plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin()
	]);
}


// Module setup - Loaders and such
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?' + JSON.stringify({
	browsers: [
		'Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24',
		'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'
	]
});

exports.module = {
	loaders: [
		// CSS and LESS support here :)
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

		// Images will be inline if they're less than a certain filesize (see IMAGE_INLINE_LIMIT)
		{
			test: /\.gif/,
			loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/gif'
		},
		{
			test: /\.jpg/,
			loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/jpg'
		},
		{
			test: /\.png/,
			loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/png'
		},
		{
			test: /\.svg/,
			loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/svg+xml'
		},

		// These enable JSX and ES6 support
		{
			test: /\.jsx?$/,
			exclude: [config.paths.nodeModules],
			loaders: (function() {
				var loaders = ['babel?experimental&optional=runtime'];

				// Add in the `react-hot-loader` in DEBUG mode
				if(DEBUG) { loaders.unshift('react-hot'); }

				return loaders;
			}())
		},

		// JSON support, too
		{
			test: /\.json/,
			loader: 'json'
		}
	]
};

// External dependencies - These are provided by the index.html file
// as direct <script> includse, such as the `socket.io` client
exports.externals = {
	'socket.io': 'io'
};


// We'll turn caching on in DEBUG for improved performance when doing
// incremenetal builds
exports.cache = DEBUG;


// DEBUG mode enabled for our loaders... in DEBUG mode only, ofcourse!
exports.debug = DEBUG;


// We'll inline the source maps when in DEBUG
exports.devtool = DEBUG ? '#inline-source-map' : false;


// ESLint specific stuff
exports.eslint = {
	configFile: path.resolve(__dirname, '.eslintrc')
};
