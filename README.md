# New Tab Bookmarks

This is a work in progress, mostly for personal use, but feel free to use it if you think it might be helpful to you.

Some day I might decide to upload it to the Chrome web store or to the Firefox Add-ons site, but for now you'll need to install it as a "development version."

## Supported browsers

* Chrome
* Edge
* Opera
* Firefox

## Prerequisite

Make sure you have node.js >=8 installed

```bash
node --version
```

If not, either download it from [nodejs.org](https://nodejs.org/en/) or use a Node.js version manager such as [Volta](https://volta.sh/) or [nvm](https://github.com/creationix/nvm).

## Setup:

1. `git clone https://github.com/kswedberg/new-tab-bookmarks.git`
2. `cd new-tab-bookmarks`
3. `npm install` (or `yarn install`)

## Build the extension

To build the extension so that it can be installed in a browser, run one of the following

* `npm run build-chrome` or `yarn build-chrome` : Works for Edge, too.
* `npm run build-opera` or `yarn build-opera`
* `npm run build-firefox` or `yarn build-firefox`

## Install it in a browser

Each browser has its own set of instructions/requirements for adding development versions of extensions.

In Chrome or Edge (or, presumably, another Chromium-based browser such as Brave):

1. Open the Manage Extensions page ([chrome://extensions](chrome://extensions))
2. Check the checkbox for "Developer Mode"
3. Press the "Load unpacked extension…" button
4. Navigate to this repo's `dist/chrome` directory and select it

In Firefox:

1. Open the Add-ons Manager ([about:addons](about:addons))
2. Click the Gear icon and choose "Install Add-on From File…"
3. Navigate to this repo's `dist/firefox` directory and select the `firefox.xpi` file

## Resources

* https://github.com/abhijithvijayan/web-extension-starter
* https://github.com/mozilla/webextension-polyfill
* https://github.com/Kocal/vue-web-extension
