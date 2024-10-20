import {syncStore, localStore, getStorageType} from '../../ext/storage.js';

const storedState = {
  layout: 'grid',
  storageType: 'sync',
  brokenKeepers: [],
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
      // set state and save to syncStorage
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
    async initialize({commit}) {
      const storageType = getStorageType();

      commit('setState', {name: 'storageType', value: storageType});

      const stored = await syncStore.get(Object.keys(storedState));

      Object.keys(stored || []).forEach((name) => {
        commit('setState', {name, value: stored[name]});
      });
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

      const syncStored = await syncStore.get(storedKeys);
      const stored = Object.assign({}, stateStored, syncStored || {});

      storedKeys.forEach((name) => {
        commit('setState', {name, value: stored[name]});
      });

      return syncStore.set(stored);
    },
  },
};

export {settings};
