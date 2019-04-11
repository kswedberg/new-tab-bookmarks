import {Vue, Vuex} from '../../vue-imports.js';
import root from './tab.vue';
import {createFilters} from '../../filters/index.js';
import {storeConfig} from '../../store/index.js';

createFilters(Vue);

const store = new Vuex.Store(storeConfig);

new Vue({
  el: '#root',
  store,
  render: (h) => h(root),
});
