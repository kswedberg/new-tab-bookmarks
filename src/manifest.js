const pkg = require('../package.json');

const manifest = {
  manifest_version: 2,
  name: 'New Tab Bookmarks',
  description: 'A web browser extension that sets the new tab page to one of your bookmark folders',
  version: pkg.version,

  icons: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },

  homepage_url: 'https://karlswedberg.com',
  short_name: 'New Tab Bkmrks',

  // permissions: ['tabs', 'storage', 'http://*/*', 'https://*/*'],
  '__chrome|opera__permissions': [
    'chrome://favicon/',
    'tabs',
    'background',
    // 'contextMenus',
    'bookmarks',
    'storage',
  ],
  __firefox__permissions: [
    // 'http://*/*',
    // 'https://*/*',
    'tabs',
    // 'background',
    // 'contextMenus',
    'bookmarks',
    'storage',
  ],

  '__chrome|firefox__author': 'Karl Swedberg',
  __opera__developer: {
    name: 'Karl Swedberg',
  },

  __firefox__applications: {
    // gecko: {id: '{754FB1AD-CC3B-4856-B6A0-7786F8CA9D17}'},
  },
  __firefox__browser_specific_settings: {
    gecko: {
      id: '{d0b772f2-a2d3-4949-9557-4bb118802fc8}',
      strict_min_version: '42.0',
    },
  },

  __chrome__minimum_chrome_version: '62',
  __opera__minimum_opera_version: '62',
  chrome_url_overrides: {
    newtab: 'tab/tab.html',
  },
  browser_action: {
    default_icon: 'icons/icon19.png',
    default_title: 'New Tab Bookmarks',
    default_popup: 'popup/popup.html',
    '__chrome|opera__chrome_style': false,
    __firefox__browser_style: false,
  },

  '__chrome|opera__options_page': 'options/options.html',
  commands: {
    _execute_browser_action: {
      suggested_key: {
        windows: 'Ctrl+Shift+S',
        mac: 'Command+Shift+S',
        chromeos: 'Ctrl+Shift+S',
        linux: 'Ctrl+Shift+S',
      },
      description: 'Save Bookmark',
    },
  },
  options_ui: {
    page: 'options/options.html',
    open_in_tab: true,
    __chrome__chrome_style: false,
    __firefox__browser_style: false,
  },

  // background: {
  //   scripts: ['js/background.js'],
  //   '__chrome|opera__persistent': false,
  // },

  // content_scripts: [
  //   {
  //     matches: ['http://*/*', 'https://*/*'],
  //     js: ['js/contentScript.bundle.js'],
  //   },
  // ],
};

manifest.content_security_policy = 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'';

if (process.env.NODE_ENV === 'development') {
  manifest.content_security_policy = 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'';
}

module.exports = manifest;
