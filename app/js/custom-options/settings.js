/* global FancySettings */
import {buildOptions} from '../bookmarks/build-options.js';
import {manifest} from './manifest.js';
import {FancySettings} from '../classes/fancy-settings.js';

window.addEvent('domready', function() {
  let store = new Store('settings');

  let dumpFolders = function(settings) {
    let folderid = store.get('folderid');

    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
      let list = buildOptions.treeNodes(bookmarkTreeNodes, folderid, -1);

      settings.manifest.folderid.element.innerHTML = list;
    });
  };

  // eslint-disable-next-line new-cap
  new FancySettings.initWithManifest(function(settings) {
    dumpFolders(settings);
    // settings.manifest.myButton.addEvent("action", function () {
    //     alert("You clicked me!");
    // });
  });
});
