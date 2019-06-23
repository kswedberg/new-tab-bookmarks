// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  globals: {
     chrome: 'readonly',
     browser: 'writable',
  },
  env: {
    browser: true,
    webextensions: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'kswedberg/vue',
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    // 'arrow-body-style': ['off'],

    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
