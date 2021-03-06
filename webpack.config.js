const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ["./app/index.js"]
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "index.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
  ],
};