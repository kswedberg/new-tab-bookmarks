/*
  * Disabling rules in a file:
  * multiple lines: /* eslint-disable no-alert, no-console *\/ (unescaped)
  * re-enable lines: /* eslint-enable *\/ (unescaped)
  * same line: // eslint-disable-line camelcase
  * next line: // eslint-disable-next-line
 */
module.exports = {
  'extends': 'kswedberg',
  globals: {
    google: false,
    Store: false,
    chrome: false,
  },
  rules: {
    'no-underscore-dangle': [
      'off'
    ]
  }
};
