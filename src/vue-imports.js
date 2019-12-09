import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-theme-chalk/src/index.scss';
import './css/theme.css';

// import 'element-ui/lib/theme-chalk/index.css';
// import { Icon, Layout, Container, Button, Select, Input, Form } from 'element-ui';

// Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(ElementUI);

export {Vue, Vuex};
