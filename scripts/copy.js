const Promises = require('bluebird');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();

const files = [
  '_locales',
  'icons',
  'img',
  'bookmarks.html',
  'browser-action.html',
  'custom-options.html',
  'manifest.json',
];

const buildAll = () => {
  return Promises.each(files, (file) => {
    let from = path.join(cwd, 'app', file);
    let to = path.join(cwd, 'public', file);

    return fs.copy(from, to);
  });
};

if (process.argv.includes('cli')) {
  buildAll();
}

module.exports = {
  files,
  copyFile: function(file) {
    const from = path.join(cwd, 'app', file);
    const to = path.join(cwd, 'public', file);

    return fs.copy(from, to);
  }
};
