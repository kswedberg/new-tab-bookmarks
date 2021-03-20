# New Tab Bookmarks, a browser extension

This is a work in progress, mostly for personal use, but feel free to use it if you think it might be helpful to you. It uses your browser's bookmarks / favorites as the default page that appears when you open a new tab (hence the catchy name "New Tab Bookmarks"). If you have a lot of bookmarks, you can choose a specific folder whose bookmarks will appear instead of showing all of them.

Other features:

* Filter/search bookmarks, either all of them or just the ones in your selected folder
* Save a new bookmark with an enhanced popup
* Make rudimentary changes to bookmarks (move, rename, reorder, etc.)
* Find duplicate bookmarks and list them, allowing you to delete any one you wish

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

In **Chrome** or **Edge** (or, presumably, another Chromium-based browser such as Brave):

1. Open the Manage Extensions page ([chrome://extensions](chrome://extensions))
2. Check the checkbox for "Developer Mode"
3. Press the "Load unpacked extension…" button
4. Navigate to this repo's `dist/chrome` directory and select it

In **Firefox**, the process can be a bit more complicated, depending on which approach you take.

_Option A_: Follow the instructions for [temporary add-on installation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

_Option B_: If you're using Firefox Developer Edition, Nightly, or ESR, you can install unsigned add-ons by changing `xpinstall.signatures.required` to `false` in `about:config`. Then follow these steps:

1. Open the Add-ons Manager ([about:addons](about:addons))
2. Click the Gear icon and choose "Install Add-on From File…"
3. Navigate to this repo's `dist/firefox` directory and select the `firefox.xpi` file

_Option C_: Create a signed version of the add-on and install that. This is the most complicated approach. Getting an extension signed is beyond the scope of this document, but here are few resources to get you going in the right direction:

* Read the Extension Workshop's overview, [Signing and distributing your add-on](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/) page.
* You can either upload the .xpi file (created by running `yarn build-firefox`) to the Developer Hub or use the API.
* If you want to use the API:
    1. Copy `.env.example` to `.env` and provide values for the 3 environment variables. You'll need to [generate the API Credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/) first, obviously. But that just requires clicking a button.
    2. Run `yarn sign-firefox` or `npm run sign-firefox`
    3. Wait for an email telling you the extension has been approved. Then follow the link to download it and follow the 3 steps from _Option B_.



## Resources

* https://github.com/abhijithvijayan/web-extension-starter
* https://github.com/mozilla/webextension-polyfill
* https://github.com/Kocal/vue-web-extension
