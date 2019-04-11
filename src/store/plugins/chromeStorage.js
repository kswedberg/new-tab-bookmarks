import {getProperty} from 'fmjs/getproperty.js';
import {chromeStore} from '../../ext/storage.js';

const chromeStoragePlugin = (store) => {
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

    chromeStore.set({[name]: value});
  });
};

export {chromeStoragePlugin};
