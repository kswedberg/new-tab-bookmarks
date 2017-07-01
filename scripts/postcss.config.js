const cssnext = require('postcss-cssnext');
const easyImport = require('postcss-easy-import');

module.exports = {
  plugins: [
    easyImport,
    cssnext({

    })
  ]
};
