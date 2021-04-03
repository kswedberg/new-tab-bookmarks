const browser = require('webextension-polyfill');

const getStorageType = () => {
  try {
    return JSON.parse(localStorage.getItem('storageType')) || 'sync';
  } catch (e) {
    return 'local';
  }
};

/**
 * @see {@link https://developer.chrome.com/extensions/storage}
 */

// e.g. browser.storage.sync.get, browser.storage.local.get, etc.
const syncStore = {
  get: (key) => {
    const props = Array.isArray(key) ? key : [key];
    const storeType = getStorageType();

    return browser.storage[storeType].get(props)
    .then((result) => {
      if (typeof key === 'string') {
        return result[key];
      }

      return result;
    });

  },
  set: (settings) => {
    const storeType = getStorageType();

    browser.storage[storeType].set(settings)
    .then(() => {
      return settings;
    });
  },
  getBytesInUse: (keys) => {
    const storeType = getStorageType();

    return browser.storage[storeType].getBytesInUse(keys);
  },
  remove: (keys) => {
    const storeType = getStorageType();

    return browser.storage[storeType].remove(keys);
  },

  clear: () => {
    const storeType = getStorageType();

    return browser.storage[storeType].remove();
  },
};

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage}
 */
const localStore = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      //
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      //
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      //
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      //
    }
  },
};

export {syncStore, localStore, getStorageType};
