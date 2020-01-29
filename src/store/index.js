import {bookmarks} from './modules/bookmarks.js';
import {settings} from './modules/settings.js';
import {syncStoragePlugin} from './plugins/syncStorage.js';

const modules = {
  bookmarks,
  settings,
};

export const storeConfig = {
  modules,
  plugins: [syncStoragePlugin],
};
