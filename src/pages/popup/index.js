import {Vue, Vuex} from '../../vue-imports.js';
import root from './popup.vue';
import {storeConfig} from '../../store/index.js';
// Vue.use(ElementUI);

const store = new Vuex.Store(storeConfig);

new Vue({
  el: '#root',
  store,
  render: (h) => h(root),
});
