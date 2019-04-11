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

const filterResults = function filterResults(nodes, filter) {
  const results = nodes.filter((node) => {
    const lowerTitle = node.title.toLowerCase();

    if (lowerTitle.includes(filter)) {
      return true;
    }

    if (node.children && node.children.length) {
      node.children = filterResults(node.children, filter);

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

const chromeStoreItems = ['defaultFolder', 'expandedFolders', 'asideClosed'];
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

      return getSubTree(folderId).then((tree) => {
        const results = filter ? filterResults(tree, filter) : tree;

        commit('setState', {name: 'results', value: results});
      });
    },
    getEditing({commit}, id) {
      getBookmark(id)
      .then(([value]) => {
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
    move({dispatch}, {id, parentId}) {
      return move(id, {parentId})
      .then(() => {
        dispatch('getResults');
      });
    },
    remove({dispatch}, id) {
      return remove(id)
      .then(() => {
        dispatch('getResults');
      });
    },

  },

};

export {bookmarks};
