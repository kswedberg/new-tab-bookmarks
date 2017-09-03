const path = require('path');
const fs = require('fs-extra');
const postcss = require('postcss');
const config = require('./postcss.config.js');

const cwd = process.cwd();
const paths = {
  src: 'app/css/bookmarks.css',
  dest: 'public/css/bookmarks.css'
};

const src = path.join(cwd, paths.src);
const dest = path.join(cwd, paths.dest);

let run = function() {
  return fs.readFile(src)
  .then((css) => {
    return postcss(config.plugins)
    .process(css, {
      from: paths.src,
      to: paths.dest
    });
  })
  .then((result) => {
    let appWrite = fs.outputFile(dest, result.css);
    let mapWrite;

    if (result.map) {
      mapWrite = fs.outputFile(`${dest}.map`, result.map);
    }

    return Promise.all([appWrite, mapWrite]);
  })
  .catch(console.error);
};

if (process.argv.includes('cli')) {
  run();
}

module.exports = run;
