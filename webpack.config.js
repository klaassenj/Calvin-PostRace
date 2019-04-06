var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: [
        __dirname + '/app/scripts/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: '/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/,  loader: 'style!css' , options: { modules: false}}
        ]
    },

    plugins: [
		new HtmlWebpackPlugin({
                template: __dirname + "/app/index.tmpl.html",
                favicon: __dirname + "/app/favicon.ico"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        port: 3001,
        proxy: { '/api/*': 'http://localhost:3000' },
        colors: true,
        historyApiFallback: true,
        inline: true,
        hot: true
    }
};
