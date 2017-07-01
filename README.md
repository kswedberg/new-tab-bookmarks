# New Tab Bookmarks, a Chrome Extension

To get this development version of the Chrome Extension to work in your browser:

## Make sure you have node.js >=4 installed

```bash
node --version
```

If not, either download from [nodejs.org](https://nodejs.org/en/) or install [nvm](https://github.com/creationix/nvm).

## Grab the code and build it:

1. `git clone https://github.com/kswedberg/new-tab-bookmarks.git`
2. `cd new-tab-bookmarks`
3. `npm run release`

## Install it in the Chrome browser:

1. Open the Manage Extensions page ([chrome://extensions](chrome://extensions))
2. Check the checkbox for "Developer Mode"
3. Press the "Load unpacked extension…" button
4. Navigate to this repo's `public` directory and select it
