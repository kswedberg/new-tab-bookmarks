
const getStorageType = () => {
  try {
    return JSON.parse(localStorage.getItem('storageType')) || 'local';
  } catch (e) {
    return 'local';
  }
};

/**
 * @see {@link https://developer.chrome.com/extensions/storage}
 */

// chrome.storage.local.set
const chromeStore = {
  get: (key) => {
    const props = Array.isArray(key) ? key : [key];
    const storeType = getStorageType();

    return new Promise((resolve, reject) => {
      chrome.storage[storeType].get(props, resolve);
    })
    .then((result) => {
      if (typeof key === 'string') {
        return result[key];
      }

      return result;
    });

  },
  set: (settings) => {
    const storeType = getStorageType();

    return new Promise((resolve, reject) => {
      chrome.storage[storeType].set(settings, resolve);
    })
    .then(() => {
      return settings;
    });
  },
  getBytesInUse: (keys) => {
    const storeType = getStorageType();

    return new Promise((resolve, reject) => {
      chrome.storage[storeType].getBytesInUse(keys, resolve);
    });
  },
  remove: (keys) => {
    const storeType = getStorageType();

    return new Promise((resolve, reject) => {
      chrome.storage[storeType].remove(keys, resolve);
    });
  },

  clear: () => {
    const storeType = getStorageType();

    return new Promise((resolve, reject) => {
      chrome.storage[storeType].remove(resolve);
    });
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

export {chromeStore, localStore, getStorageType};
