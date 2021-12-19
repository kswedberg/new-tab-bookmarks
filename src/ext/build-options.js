let buildOptions = {
  spaceSpace: function(title, folderLevel) {
    let spaces = '  ';
    let text = '';

    let level = folderLevel * 1;

    while (level-- > 0) {
      text += spaces;
    }

    return text + title;
  },
  treeNodes: function(bookmarkNodes, query = '', level = 0, parents = []) {
    let list = [];

    let i;

    for (i = 0; i < bookmarkNodes.length; i++) {
      list.push(...buildOptions.node(bookmarkNodes[i], query, level, parents));
    }

    return list;
  },

  node: function(bookmarkNode = {}, query, level, accumulatedParents = []) {
    let items = [];
    let parents = [];

    if (!bookmarkNode.children) {
      return items;
    }
    if (bookmarkNode.id === query) {
      bookmarkNode.selected = true;
    }

    bookmarkNode.level = level;
    // bookmarkNode.text = buildOptions.spaceSpace(bookmarkNode.title, level);
    if (level > 1) {
      parents.push(...accumulatedParents, bookmarkNode.title);
    } else {
      parents = [];
    }
    bookmarkNode.text = parents.join(' / ');
    items.push(bookmarkNode);

    if (bookmarkNode.children && bookmarkNode.children.length) {
      items.push(...buildOptions.treeNodes(bookmarkNode.children, query, level + 1, parents));
    }

    return items;
  },
};

export {buildOptions};
