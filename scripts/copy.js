const Promises = require('bluebird');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();

const toCopy = [
  '_locales',
  'icons',
  'bookmarks.html',
  'browser-action.html',
  'custom-options.html',
  'manifest.json',
];

Promises.each(toCopy, (file) => {
  let from = path.join(cwd, 'app', file);
  let to = path.join(cwd, 'public', file);

  return fs.copy(from, to);
});
