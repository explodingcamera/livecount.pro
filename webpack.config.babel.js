import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';

import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production';

const externals = {};

const babelPresets = [['env', {
	targets: {
		chrome: 56,
		firefox: 45,
		edge: 14
	},
	modules: false
}], 'react', 'stage-0'];

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: Infinity
	}),
	new HtmlWebpackPlugin({
		template: 'app/index.ejs',
		alwaysWriteToDisk: true,
		hash: false,
		title: pkg.name,
		filename: `${__dirname}/build/index.html`
	}),
	new HtmlWebpackHarddiskPlugin(),
	new ManifestPlugin()
];

if (prod) {
	plugins.push(...[
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new UglifyPlugin({
			comments: false,
			mangle: true
		}),
		new ExtractTextPlugin({filename: '[name].[hash].css', allChunks: true}),
		new SriPlugin({
			hashFuncNames: ['sha256', 'sha384', 'sha512'],
			enabled: true
		})
	]);
}

export default {
	entry: {
		js: ['./app'],
		vendor: [
			'whatwg-fetch', 'babel-polyfill', 'react', 'react-dom'
		]
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].[chunkhash].js',
		crossOriginLoading: 'anonymous'
	},
	bail: true,
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			include: [
				path.resolve(__dirname, './app'),
				path.resolve(__dirname, './node_modules/react-router')
			],
			enforce: 'pre',
			loader: 'babel-loader',
			options: {
				presets: babelPresets,
				plugins: ['transform-decorators-legacy']
			}
		},
		{
			test: /\.css$/,
			exclude: [/global.css$/],
			loader:	prod ? ExtractTextPlugin.extract({
				fallback: 'style-loader!css-loader?modules&importLoaders=1!postcss-loader',
				use: 'css-loader?modules&importLoaders=1!postcss-loader'
			}) : 'style-loader!css-loader?modules&importLoaders=1&localIdentName="[path][name]__[local]--[hash:base64:5]"!postcss-loader'
		},
		{
			test: /\.css$/,
			include: [/global.css$/],
			loader:	prod ? ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader?importLoaders=1!postcss-loader'
			}) : 'style-loader!css-loader?importLoaders=1&localIdentName="[path][name]__[local]--[hash:base64:5]"!postcss-loader'
		},
		{
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file-loader?name=build/fonts/[name].[ext]'
		}
		]
	},
	devtool: 'eval',
	devServer: {
		watchContentBase: true,
		contentBase: [path.join(__dirname, 'build'), path.join(__dirname, 'public')],
		inline: true,
		compress: true,
		port: 8081,
		historyApiFallback: true,
		clientLogLevel: 'warning'
	},
	plugins,
	externals,
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'app')
		],
		extensions: ['.js', '.json', '.jsx', '.css']
	},
	context: __dirname,
	target: 'web'
};
