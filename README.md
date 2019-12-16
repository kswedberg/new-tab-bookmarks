# New Tab Bookmarks

## Resources

* https://github.com/abhijithvijayan/web-extension-starter
* https://github.com/mozilla/webextension-polyfill
* https://github.com/Kocal/vue-web-extension


## Chrome

To get this development version of the Web Extension to work in Chrome:

### Make sure you have node.js >=8 installed

```bash
node --version
```

If not, either download from [nodejs.org](https://nodejs.org/en/) or install [nvm](https://github.com/creationix/nvm).

### Grab the code and build it:

1. `git clone https://github.com/kswedberg/new-tab-bookmarks.git`
2. `cd new-tab-bookmarks`
3. `npm install`
4. `npm run build-chrome`

### Install it in the Chrome browser:

1. Open the Manage Extensions page ([chrome://extensions](chrome://extensions))
2. Check the checkbox for "Developer Mode"
3. Press the "Load unpacked extension…" button
4. Navigate to this repo's `dist` directory and select it
