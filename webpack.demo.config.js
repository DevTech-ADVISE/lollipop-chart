//config for webpack build
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/lollipopChart.js",
    output: {
        library: 'LollipopChart',
        libraryTarget: 'umd',
        path: path.join(__dirname, "demo/"),
        filename: "lollipopChart.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.scss$/, loader: "style!css!sass"}
        ]
    },

};