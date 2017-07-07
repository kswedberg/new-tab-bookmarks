/* global buildOptions */
import './bookmarks/main.js';
import {applyStyles} from './bookmarks/styles.js';
import {Store} from './lib/store.js';
let storedStyles = new Store('styles');

applyStyles(storedStyles);
