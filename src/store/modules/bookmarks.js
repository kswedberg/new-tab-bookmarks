import {
  getTree,
  getSubTree,
  getBookmarkWithPosition,
  create,
  move,
  update,
  remove,
  removeTree,
  search
} from '../../ext/bookmarks.js';
import {syncStore} from '../../ext/storage.js';
import {buildOptions} from '../../ext/build-options.js';

const title2Text = (bookmark, withSpaces) => {
  if (!bookmark.title) {
    return '';
  }

  const leadingSpaces = /^\s*/.exec(withSpaces.text);

  return leadingSpaces ? leadingSpaces[0] + bookmark.title : bookmark.title;
};

const filterResults = function filterResults(nodes, filters) {
  const results = nodes.filter((node) => {
    const lowerTitle = node.title.toLowerCase();

    if (filters.every((filter) => lowerTitle.includes(filter))) {
      return true;
    }

    if (node.children && node.children.length) {
      node.children = filterResults(node.children, filters);

      return true;
    }

    return false;
  });


  const filteredResults = results.filter(function strip(node) {
    if (node.url) {
      return true;
    }

    if (node.children && node.children.length) {
      return node.children.filter(strip);
    }

    return false;
  });

  return filteredResults;
};

const syncStoreItems = ['defaultFolder', 'expandedFolders', 'asideClosed', 'searchAll'];
const bookmarks = {
  strict: true,
  namespaced: true,

  state: {
    folders: [],
    expandedFolders: [],
    currentFolder: {id: '1'},
    lastFolderId: '1',
    defaultFolder: {},
    asideClosed: true,
    searchFilter: '',
    searchAll: false,
    results: [{}],
    editing: null,
  },

  getters: {
    foldersMatch(state) {
      return state.currentFolder.id === state.defaultFolder.id;
    },
    foldersWithText(state) {
      // eslint-disable-next-line eqeqeq
      return state.folders.filter((item) => item.text != 0);
    },
    searchInFolder(state) {
      return (state.searchAll && state.searchFilter) || state.currentFolder.id === 'All' ? '0' : state.currentFolder.id;
    },
    searchFilter(state) {
      return (state.searchFilter || '').trim().toLowerCase();
    },
  },
  mutations: {
    setState(state, {name, value}) {
      state[name] = value;
    },
    setStateAndStore(state, {name, value}) {
      // set state and save to syncStorage
      state[name] = value;
    },

    updateFolder(state, folder) {
      const folders = state.folders;
      const index = folders.findIndex(({id}) => id === folder.id);

      if (index === -1) {
        // If new: Need to put this in the correct place
        // state.folders.push
      } else {
        folder.text = title2Text(folder, folders[index]);

        const updated = Object.assign({}, folders[index], folder);

        state.folders.splice(index, 1, updated);
      }
    },
  },

  actions: {
    async initialize({state, commit, dispatch}) {
      const storedItems = await syncStore.get(syncStoreItems);

      Object.keys(state).forEach((name) => {
        const value = typeof storedItems[name] === 'undefined' ? bookmarks.state[name] : storedItems[name];

        commit('setState', {name, value});
      });

      commit('setState', {name: 'currentFolder', value: Object.assign({}, state.defaultFolder)});

      await dispatch('checkDefaultFolder');

      await Promise.all([
        dispatch('getFolders'),
        dispatch('getResults'),
      ]);
    },

    async checkDefaultFolder({state, commit}) {
      const {id, title} = state.defaultFolder || {};
      // (1) Search all bookmarks and folders for any with title matching the defaultFolder title
      const results = await search(title);

      // (2) We only need folders, so remove any that have a url property
      const folders = results.filter(({url}) => !url);

      // (3) See if one of the results has a matching id.
      // If so, WE ARE GOOD
      const foundId = folders.find((res) => res.id === id);

      // (4) If not, we need to find the ones that match the title EXACTLY.
      if (!foundId) {
        const filteredByTitle = folders.filter((res) => title === res.title);

        // (5) We HOPE that there is only one,
        //     because then we can simply merge that in and pick up its id.
        if (filteredByTitle.length === 1) {
          const value = Object.assign({}, state.defaultFolder, filteredByTitle[0]);

          commit('setStateAndStore', {name: 'defaultFolder', value});
          commit('setState', {name: 'currentFolder', value});
        } else {
          const value = Object.assign({}, state.defaultFolder, {text: 'NOT FOUND'});

          commit('setState', {name: 'currentFolder', value});
          console.log('Hmmmmmm. Possible sync issue…');
          console.log('ID of default folder does not match any folder here.');
          console.log('Here are folders with title that matches default folder ID:');
          console.log(filteredByTitle);
        }
      }
    },

    async getFolders({commit}) {
      const nodes = await getTree();
      const value = buildOptions.treeNodes(nodes);

      commit('setState', {name: 'folders', value});
    },

    async getResults({commit, getters}) {
      const folderId = getters.searchInFolder;
      const filter = getters.searchFilter;
      const filters = filter ? filter.split(/\s+/) : [];
      const tree = await getSubTree(folderId);
      const results = filter ? filterResults(tree, filters) : tree;

      commit('setState', {name: 'results', value: results});
    },

    async getEditing({commit}, {id, action = 'update'}) {
      const val = await getBookmarkWithPosition(id);
      let value = val;

      if (action === 'create') {
        const {id, dateAdded, dateGroupModified, title, url, ...rest} = val;

        value = rest;
      }
      value.action = action;
      commit('setState', {name: 'editing', value});

      return value;
    },

    async create({commit, dispatch}, bookmark) {
      await create(bookmark);
      await dispatch('getResults');
    },

    async update({dispatch}, bookmark) {
      const {id, ...props} = bookmark;

      await update(id, props);
      await dispatch('getResults');
    },

    async move({dispatch}, {id, parentId, index}) {
      await move(id, {parentId, index: index || 0});
      await dispatch('getResults');
    },

    async remove({dispatch}, id) {
      await remove(id);
      await dispatch('getResults');
    },

    async removeTree({dispatch}, id) {
      await removeTree(id);
      await dispatch('getResults');
    },

    setCurrentFolderFromId({state, commit}, newId) {
      const {id, title, text} = newId === '0' ?
        {id: 'All', title: '', text: undefined} :
        state.folders.find((folder) => folder && folder.id === newId);

      commit('setStateAndStore', {
        name: 'currentFolder',
        value: {id, title, text},
      });
    },

  },

};

export {bookmarks};
