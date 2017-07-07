import {Store} from './lib/store.js';
import {buildOptions} from './bookmarks/build-options.js';
import {populateStyleInputs, applyStyles, setStyles, updateSwatch} from './bookmarks/styles.js';

let storedSettings = new Store('settings');
let storedStyles = new Store('styles');

let dumpFolders = function(id) {
  let folderid = storedSettings.get(id);

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
      let val = storedSettings.get(key);

      if (el.type === 'checkbox') {
        el.checked = !!val;
      } else if (el.type === 'radio') {
        el.checked = el.value === val;
      } else {
        el.value = val;
      }
    });

    dumpFolders('folderid');
    populateStyleInputs(storedStyles);
    applyStyles(storedStyles);
  },
  settingChange: function(event) {
    let tgt = event.target;
    let key = tgt.getAttribute('data-setting');

    if (!tgt.getAttribute('data-setting')) {
      return;
    }

    let val = tgt.type === 'checkbox' ? tgt.checked : tgt.value;

    storedSettings.set(key, val);
  },
  stylesUpdate: function(event) {
    event.preventDefault();
    setStyles(storedStyles);
    applyStyles(storedStyles);
  }
};

let updateStyleForm = document.getElementById('update-styles');

if (updateStyleForm) {
  updateStyleForm.addEventListener('submit', handle.stylesUpdate);
}

document.addEventListener('DOMContentLoaded', handle.domReady);
document.addEventListener('change', handle.settingChange);
document.addEventListener('change', updateSwatch);
