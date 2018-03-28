const fs = require('fs-extra');
const path = require('path');
const Promises = require('bluebird');
const postcss = require('postcss');
const cssnext = require('postcss-cssnext');

const cwd = process.cwd();
let plugins = [
  cssnext({

  })
];

let files = ['css/bookmarks.css'].map((file) => {
  let src = path.join(cwd, 'app', file);
  let dest = path.join(cwd, 'public', file);

  return fs.readFile(src)
  .then((css) => {
    console.log(css);

    return postcss(plugins)
    .process((css), {from: src, to: dest})
    .then((result) => {
      console.log(result);

      if (result.map) {
        fs.writeFile(`${dest}.map`, result.map);
      }

      return fs.writeFile(dest, result.css);
    })
    .catch((err) => {
      console.log(err);
    });
  });
});

Promises.all(files)
.then(() => {
  console.log('All done!');
});
