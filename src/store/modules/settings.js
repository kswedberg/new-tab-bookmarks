import {chromeStore, localStore, getStorageType} from '../../ext/storage.js';

const storedState = {
  theme: 'light',
  layout: 'grid',
  storageType: '',
};

const settings = {
  strict: true,
  namespaced: true,

  state: Object.assign({}, storedState, {
    storageTypes: ['sync', 'local'],
  }),

  mutations: {
    setState(state, {name, value}) {
      state[name] = value;
    },
    setStateAndStore(state, {name, value}) {
      // set state and save to chromeStorage
      state[name] = value;
    },

    setStorageType(state, value) {
      if (!state.storageTypes.includes(value)) {
        throw new Error(`storageType value must be either ${state.storageTypes.join(' or ')}`);
      }

      state.storageType = value;
      localStore.set('storageType', value);
    },
  },

  actions: {
    async initialize({state, commit, dispatch}) {
      const storageType = getStorageType();

      commit('setState', {name: 'storageType', value: storageType});

      const stored = await chromeStore.get(Object.keys(storedState));

      Object.keys(stored || []).forEach((name) => {
        commit('setState', {name, value: stored[name]});
      });

      await dispatch('setBodyClass');
    },
    setBodyClass({state}, className = `Page--${state.theme}`) {
      if (typeof document !== 'undefined') {
        document.body.className = className;
      }
    },

    async handleStorageType({state, commit}, type) {
      commit('setStorageType', type);

      if (type !== 'sync') {
        return;
      }

      // Get synced values
      const storedKeys = Object.keys(storedState);
      const stateStored = {};

      storedKeys.forEach((key) => {
        stateStored[key] = state[key];
      });

      const chromeStored = await chromeStore.get(storedKeys);
      const stored = Object.assign({}, stateStored, chromeStored || {});

      storedKeys.forEach((name) => {
        commit('setState', {name, value: stored[name]});
      });

      return chromeStore.set(stored);
    },
  },
};

export {settings};
