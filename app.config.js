var path = require('path');
var webpack = require('webpack');
var babel = require('babel-loader');

module.exports = {
  entry: {
    app: "./app/js/app.js"
  },
  output: {
    filename: '[name].compiled.js',
    path: './dist/'
  },
  module: {
    loaders: [
      {test: /\.(js)/, loader: 'babel?cacheDirectory&stage=0'}
    ]
  },
  plugins: [
  ],
  devtool: "#inline-sourc-map",
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js'],
    loaders: [
    ]
  }
};
