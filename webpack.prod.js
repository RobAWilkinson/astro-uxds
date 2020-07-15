const dev = require('./webpack.dev.js');
const merge = require('webpack-merge');

module.exports = merge(dev, {
  mode: 'production',
  watch: false,
});