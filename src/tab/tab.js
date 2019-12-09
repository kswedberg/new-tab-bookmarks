import {Vue, Vuex} from '../vue-imports.js';
import App from './App.vue';
import {createFilters} from '../filters/index.js';
import {storeConfig} from '../store/index.js';

createFilters(Vue);

const browser = require('webextension-polyfill');

Vue.prototype.$browser = browser;

const store = new Vuex.Store(storeConfig);

new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});
