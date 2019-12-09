const browser = require('webextension-polyfill');

export const getTree = () => {
  return browser.bookmarks.getTree();
};

export const getSubTree = (id) => {
  if (!id || id === '0') {
    return getTree();
  }

  return browser.bookmarks.getSubTree(id);
};

export const getBookmark = (id) => {
  return browser.bookmarks.get(id);
};

export const search = (query) => {
  return browser.bookmarks.search(query);
};

export const update = (id, props) => {
  return browser.bookmarks.update(id, props);
};

export const move = (id, props) => {
  return browser.bookmarks.move(id, props);
};

export const remove = (id) => {
  return browser.bookmarks.remove(id);
};

export const create = (bookmark) => {
  return browser.bookmarks.create(bookmark);
};

export const upsert = (newB, oldB = {}) => {
  const {id} =  oldB;
  const {parentId, url, title} = newB;

  if (!id) {
    return create(newB);
  }
  const promises = [];

  if (parentId && parentId !== oldB.parentId) {
    promises.push(move(id, {parentId}));
  }

  if (url !== oldB.url || title !== oldB.title) {
    promises.push(update(id, {url, title}));
  }

  return Promise.all(promises);
};

export const removeMany = (ids) => {
  return Promise.all(ids.map(remove));
};
