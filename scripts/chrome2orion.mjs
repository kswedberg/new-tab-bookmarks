import fs from 'node:fs/promises';
import path from 'node:path';

const chromeFiles = {
  js: path.join(process.cwd(), 'dist/chrome/tab/tab.js'),
  css: path.join(process.cwd(), 'dist/chrome/tab/tab.css'),
};

const run = async() => {
  const opts = {encoding: 'utf8'};

  const tabFile = path.join(process.cwd(), 'orion/tab/tab.html');
  const css = await fs.readFile(chromeFiles.css, opts);
  const js = await fs.readFile(chromeFiles.js, opts);
  const jsCleaned = js.replace(/chrome:\/\//g, 'orion://');
  const html = [
    '<!DOCTYPE html>',
    '<html lang="en-US">',
    '<head>',
    '  <meta charset="utf-8"/>',
    '  <title>New Tab Bookmarks</title>',
    '  <style>',
    `  ${css}`,
    '  </style>',
    '</head>',
    '<body class="orion">',
    '  <div id="app"></div>',
    '  <script id="t-script">',
    `  ${jsCleaned}`,
    '  </script>',
    '</body>',
    '</html>',
  ].join('\n');

  await fs.writeFile(tabFile, html);
  console.log('Updated Orion build');
};

run();
