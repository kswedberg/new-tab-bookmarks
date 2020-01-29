import {getProperty} from 'fmjs/getproperty.js';
import {syncStore} from '../../ext/storage.js';

const syncStoragePlugin = (store) => {
  const mutationTypes = [
    'bookmarks/setStateAndStore',
    'settings/setStateAndStore',
  ];

  store.subscribe((mutation, state) => {
    if (!mutationTypes.includes(mutation.type)) {
      return;
    }

    const namespace = mutation.type.split('/')[0];
    const name = mutation.payload.name;
    const value = state[namespace][name] || mutation.payload.value;

    syncStore.set({[name]: value});
  });
};

export {syncStoragePlugin};
