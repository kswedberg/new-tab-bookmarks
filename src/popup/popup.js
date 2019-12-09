import {Vue, Vuex} from '../vue-imports.js';
import App from './App.vue';
import {storeConfig} from '../store/index.js';

const browser = require('webextension-polyfill');

Vue.prototype.$browser = browser;

// Vue.use(ElementUI);

const store = new Vuex.Store(storeConfig);

new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});
