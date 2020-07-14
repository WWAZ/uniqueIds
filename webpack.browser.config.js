const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'production', // production, development
  entry: './lib/index.browser.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'uniqueIds.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]  //Preset used for env setup
          }
        },
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
