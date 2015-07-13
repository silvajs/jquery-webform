var path = require('path');

module.exports = {
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
};