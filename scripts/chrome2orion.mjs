/* eslint-disable no-await-in-loop */
import fs from 'node:fs/promises';
import path from 'node:path';

const chromeFiles = {
  js: path.join(process.cwd(), 'dist/chrome/tab/tab.js'),
  css: path.join(process.cwd(), 'dist/chrome/tab/tab.css'),
};
const pages = [
  {
    title: 'New Tab Bookmarks',
    js: path.join(process.cwd(), 'dist/chrome/tab/tab.js'),
    css: path.join(process.cwd(), 'dist/chrome/tab/tab.css'),
    dest: path.join(process.cwd(), 'orion/tab/tab.html'),
  },
  {
    title: 'New Tab Settings',
    js: path.join(process.cwd(), 'dist/chrome/tab/tab.js'),
    css: path.join(process.cwd(), 'dist/chrome/tab/tab.css'),
    dest: path.join(process.cwd(), 'orion/tab/tab.html'),
  },
];
const opts = {encoding: 'utf8'};

const run = async() => {

  for (let page of pages) {
    const css = await fs.readFile(page.css, opts);
    const js = await fs.readFile(page.js, opts);
    let jsCleaned = js.replace(/chrome:\/\//g, 'orion://');

    if (page.css.includes('tab')) {
      jsCleaned = jsCleaned.replace(/À[^}]+/, '');
    }
    const html = [
      '<!DOCTYPE html>',
      '<html lang="en-US">',
      '<head>',
      '  <meta charset="utf-8"/>',
      `  <title>${page.title}</title>`,
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

    await fs.writeFile(page.dest, html);
    console.log(`Updated ${page.title} for Orion`);
  }
};

run();
