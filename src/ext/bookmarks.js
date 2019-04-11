
export const getTree = () => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      resolve(bookmarkTreeNodes);
    });
  });
};

export const getSubTree = (id) => {
  if (!id || id === '0') {
    return getTree();
  }

  return new Promise((resolve, reject) => {
    chrome.bookmarks.getSubTree(id, resolve);
  });
};

export const getBookmark = (id) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.get(id, resolve);
  });
};
export const search = (query) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.search(query, resolve);
  });
};

export const update = (id, props) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.update(id, props, resolve);
  });
};

export const move = (id, props) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.move(id, props, resolve);
  });
};

export const remove = (id) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.remove(id, resolve);
  });
};

export const create = (bookmark) => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.create(bookmark, resolve);
  });
};

export const upsert = async(newB, oldB = {}) => {
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
