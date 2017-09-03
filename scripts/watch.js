const chalk = require('chalk');
const bs = require('browser-sync').create();
const css = require('./css');
const js = require('./js');
const copy = require('./copy');

const cwd = process.cwd();
// Listen to change events on HTML and reload
const files = copy.files.map((item) => {
  return `app/${item}`;
});

files.push('app/img/**/*');

bs.watch(files, {cwd}, function(event, file) {
  if (event !== 'change') {
    return;
  }
  file = file.replace(/^app\//, '');
  copy
  .copyFile(file)
  .then(() => {
    console.log(chalk.green('Copied'), file);
    bs.reload();
  })
  .catch(console.error);
});

// Provide a callback to capture ALL events to CSS
// files - then filter for 'change' and reload all
// css files on the page.
bs.watch('app/css/**/*.css', {cwd}, function(event, file) {
  if (event !== 'change') {
    return;
  }

  css().then((data) => {

    console.log(chalk.green('Updated CSS:'));
    console.log(chalk.yellow('File changed:'), file);

    bs.reload('*.css');
  });
});

bs.watch('app/js/**/*.js', {cwd}, function(event, file) {
  if (event !== 'change') {
    return;
  }

  js().run((err, stats) => {
    if (err) {
      return console.error(err);
    }

    console.log(chalk.green('Updated JS:'));
    console.log(chalk.yellow(stats.toString()));
    bs.reload('*.js');
  });
});


let open = process.argv.includes('-o');

bs.init({
  server: './public',
  open,
  // logLevel: 'debug',
});
