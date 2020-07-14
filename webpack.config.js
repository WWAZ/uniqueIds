const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'uniqueIds.min.js'
  }
};

module.exports = config;
