
import './lib/store.js';
import {buildOptions} from './bookmarks/build-options.js';

let store = new Store('settings');


let dumpFolders = function(id) {
  let folderid = store.get(id);

  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    let list = buildOptions.treeNodes(bookmarkTreeNodes, folderid, -1);

    document.querySelector(`[data-setting="${id}"]`).innerHTML = list;
  });
};

let handle = {
  domReady: function() {
    let settings = [...document.querySelectorAll('[data-setting]')];

    settings.forEach((el) => {
      let key = el.getAttribute('data-setting');
      let val = store.get(key);

      if (el.type === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val;
      }
    });

    dumpFolders('folderid');
  },
  settingChange: function(event) {
    let tgt = event.target;
    let key = tgt.getAttribute('data-setting');

    if (!tgt.getAttribute('data-setting')) {
      return;
    }

    let val = tgt.type === 'checkbox' ? tgt.checked : tgt.value;

    store.set(key, val);
  }
};


document.addEventListener('DOMContentLoaded', handle.domReady);
document.addEventListener('change', handle.settingChange);
