var path = require('path');
var webpack = require('webpack');

module.exports = [{
	context: path.resolve(__dirname, 'src'),
	entry: {
		'jquery-webform': './index'
	},
	output: {
		path: __dirname,
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: 'style!css'
		}]
	}
}, {
	context: path.resolve(__dirname, 'src'),
	entry: {
		'jquery-webform.min': './index'
	},
	output: {
		path: __dirname,
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: 'style!css'
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
}];