import {bookmarks} from './modules/bookmarks.js';
import {settings} from './modules/settings.js';
import {chromeStoragePlugin} from './plugins/chromeStorage.js';

const modules = {
  bookmarks,
  settings,
};

export const storeConfig = {
  modules,
  plugins: [chromeStoragePlugin],
};
