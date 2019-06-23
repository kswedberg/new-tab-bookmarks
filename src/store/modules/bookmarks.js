import {getTree, getSubTree, getBookmark, move, update, remove} from '../../ext/bookmarks.js';
import {chromeStore} from '../../ext/storage.js';
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

  return results.filter(function strip(node) {
    if (node.url) {
      return true;
    }

    if (node.children && node.children.length) {
      return node.children.filter(strip);
    }

    return false;
  });

  // return results;
};

const chromeStoreItems = ['defaultFolder', 'expandedFolders', 'asideClosed', 'searchAll'];
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
      return (state.searchFilter || '').toLowerCase();
    },
  },
  mutations: {
    setState(state, {name, value}) {
      state[name] = value;
    },
    setStateAndStore(state, {name, value}) {
      // set state and save to chromeStorage
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
    initialize({state, commit, dispatch}) {
      return chromeStore.get(chromeStoreItems)
      .then((storedItems) => {
        Object.keys(state).forEach((name) => {
          const value = typeof storedItems[name] === 'undefined' ? bookmarks.state[name] : storedItems[name];

          commit('setState', {name, value});
        });

        commit('setState', {name: 'currentFolder', value: Object.assign({}, bookmarks.state.defaultFolder)});
      })
      .then(() => {
        dispatch('getFolders');
        dispatch('getResults');
      });
    },

    getFolders({commit}) {
      return getTree()
      .then((nodes) => {
        const value = buildOptions.treeNodes(nodes);

        commit('setState', {name: 'folders', value});
      });
    },

    getResults({commit, getters}) {
      const folderId = getters.searchInFolder;
      const filter = getters.searchFilter;
      const filters = filter ? filter.split(/\s+/) : [];

      return getSubTree(folderId).then((tree) => {
        const results = filter ? filterResults(tree, filters) : tree;

        commit('setState', {name: 'results', value: results});
      });
    },
    getEditing({commit}, id) {
      getBookmark(id)
      .then(async([value]) => {
        const [parent] = await getSubTree(value.parentId);

        value.len = value.url ? parent.children.filter((item) => item.url).length : parent.children.length;
        value.indexOffset = parent.children.length - value.len;
        commit('setState', {name: 'editing', value});
      });
    },
    update({dispatch}, bookmark) {
      const {id, ...props} = bookmark;

      return update(id, props)
      .then(() => {
        dispatch('getResults');
      });
    },
    move({dispatch}, {id, parentId, index}) {
      return move(id, {parentId, index})
      .then((result) => {
        console.log('moved', result);
        dispatch('getResults');
      });
    },
    remove({dispatch}, id) {
      return remove(id)
      .then(() => {
        dispatch('getResults');
      });
    },
    setCurrentFolderFromId({state, commit}, newId) {
      const {id, title, text} = newId === '0' ?
        {id: 'All', title: ''} :
        state.folders.find((folder) => folder && folder.id === newId);

      commit('setStateAndStore', {
        name: 'currentFolder',
        value: {id, title, text},
      });
    },

  },

};

export {bookmarks};
