import browser from 'webextension-polyfill';

export const getTree = () => {
  return browser.bookmarks.getTree();
};

export const getList = async() => {
  const bookmarks = [];
  const getItem = function(bookmarkItem) {

    if (bookmarkItem.url && bookmarkItem.url.startsWith('http')) {
      bookmarks.push(bookmarkItem);
    }

    if (bookmarkItem.children) {
      for (let child of bookmarkItem.children) {
        getItem(child);
      }
    }

  };

  const tree = await browser.bookmarks.getTree();

  try {
    getItem(tree[0], 0);
  } catch (err) {
    console.log(`An error: ${err}`);
  }

  return bookmarks;
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

export const getBookmarkWithPosition = async(id, isParent) => {
  const [value] = await getBookmark(id);
  const [parent] = await getSubTree(isParent ? id : value.parentId);

  value.len = value.url ? parent.children.filter((item) => item.url).length : parent.children.length;
  value.indexOffset = parent.children.length - value.len;

  return value;
};

export const search = (query = '') => {
  return browser.bookmarks.search(query);
};

export const update = (id, props) => {
  return browser.bookmarks.update(id, props);
};

export const move = (id, props) => {
  return browser.bookmarks.move(id, props);
};

export const remove = (id) => {
  console.log('removing bookmark:');
  getBookmark(id).then(([bookmark]) => {
    console.log(bookmark);
  });

  return browser.bookmarks.remove(id);
};

export const removeTree = (id) => {
  return browser.bookmarks.removeTree(id);
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


export const findDupes = async() => {
  const tree = await getTree();
  let parents = [];

  const peelBackParents = (item) => {
    const {parentId} = item;

    while (parents.length && parents[parents.length - 1].id !== parentId) {
      parents.pop();
    }
  };

  const formatParents = (parents) => {
    return parents.map(({title}) => title).join('/');
  };

  const skipUrls = (url) => {
    const skip = [
      'https://developer.apple.com/library/safari',
      'https://formkit.com/playground',
      'https://www.youtube.com/watch',
      'https://files.bamfhealth.com/app/',
      'https://bamfhealth.egnyte.com/app/',
    ];

    return skip.some((prefix) => url.startsWith(prefix));
  };
  const traverser = (map, curr, i, arr) => {
    peelBackParents(curr);

    if (curr.children) {
      if (curr.children.length && curr.parentId > 0) {
        const {title, id} = curr;


        parents.push({title, id});
      }

      return curr.children.reduce(traverser, map);
    }

    if (curr.url) {
      try {
        const url = new URL(curr.url);
        const key = url.host + url.pathname;
        const existing = map.get(key);

        if (skipUrls(url.href) && existing) {
          return map;
        }
        const item = existing || [];


        curr.parentTree = formatParents(parents, existing);
        curr.protocol = url.protocol;
        curr.lower = curr.title?.toLowerCase();
        item.push(curr);
        map.set(key, item);
      } catch (err) {
        // ignore error. probably a bookmarklet or something
      }

    }

    return map;
  };
  const treeset = tree.reduce(traverser, new Map());
  const dupes = new Set();

  for (let [key, value] of treeset) {
    if (value.length > 1) {
      // const items = value.map((item) => {
      //   return Object.assign(item, {
      //     parentTree: (item.parents || []).map(({title}) => title).join(' / '),
      //   });
      // });

      dupes.add({id: key, items: value});
      // console.log(key, value.length);
    }
  }

  return [...dupes];
};
