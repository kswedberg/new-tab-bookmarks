/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
  name: 'vue-tab-bookmarks',
  description: 'New tab bookmark Chrome extension',
  version: '1.3.0',
  author: 'Karl Swedberg <kswedberg@gmail.com>',
  homepage_url: 'https://karlswedberg.com',
  // default_locale: 'en',
  icons: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  /**
   * @see {@link https://developer.chrome.com/extensions/declare_permissions}
   */
  permissions: [
    'chrome://favicon/',
    'tabs',
    // 'background',
    // 'contextMenus',
    'bookmarks',
    'storage', // https://developer.chrome.com/extensions/storage
    // 'topSites', // https://developer.chrome.com/extensions/topSites
  ],
  chrome_url_overrides: {
    newtab: 'pages/app.html',
  },
  browser_action: {
    default_icon: 'icons/icon19.png',
    default_title: 'New Tab Bookmarks',
    default_popup: 'pages/popup.html',
  },

  options_page: 'pages/options.html',
  // options_ui: {
  //   page: 'pages/options.html',
  //   open_in_tab: false,
  // },
  // background: {
  //   scripts: ['js/background.js'],
  // },
  manifest_version: 2,
  content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'',

};
