var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var SERVER_DIR = path.resolve(__dirname, 'src/');

var config = {
	entry: {
		index: APP_DIR + '/index.jsx',
		fullTable: APP_DIR + '/fullTable.jsx'
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
		{
			test : /\.jsx?/,
	        include : APP_DIR,
	        loader : 'babel-loader'
	    }
	   ]
	}
};

module.exports = config;