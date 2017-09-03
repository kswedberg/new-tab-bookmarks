const webpack = require('webpack');
const config = require('../webpack.config.js');

let init = function() {
  return webpack(config);
};

module.exports = init;
