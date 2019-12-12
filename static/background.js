const browser = require('webextension-polyfill');

browser.commands.onCommand.addListener((command) => {
  // console.log('Command:', command);
});
