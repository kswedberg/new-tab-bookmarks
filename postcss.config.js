// https://github.com/michael-ciniawsky/postcss-load-config

const {extend} = require('fmjs/cjs/object.js');

module.exports = (ctx) => {
  const override = {
    parser: false,
    plugins: {
      'postcss-assets': false,

    },
  };

  if (!ctx.options) {
    ctx.options = {
      scss: true,
    };
  }

  return extend(require('@fusionary/postcss-config')(ctx), override);
};
