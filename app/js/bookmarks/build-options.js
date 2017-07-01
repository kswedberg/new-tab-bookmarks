let buildOptions = {
  spaceSpace: function(title, level) {
    let spaces = '&nbsp;&nbsp;';
    let text = '';

    level *= 1;

    while (level-- > 0) {
      text += spaces;
    }

    return text + title;
  },
  treeNodes: function(bookmarkNodes, query = '', level) {
    var list = [];

    var i;

    for (i = 0; i < bookmarkNodes.length; i++) {
      list.push(buildOptions.node(bookmarkNodes[i], query, level));
    }

    return list.join('');
  },
  node: function(bookmarkNode, query, level) {
    var item = [];

    if (!bookmarkNode.children) {
      return '';
    }

    item.push(`<option ${bookmarkNode.id === query ? 'selected' : ''}
      value="${bookmarkNode.id}"
      data-level="${level}">
      ${buildOptions.spaceSpace(bookmarkNode.title, level)}
    </option>`);

    if (bookmarkNode.children.length) {
      item.push(buildOptions.treeNodes(bookmarkNode.children, query, level + 1));
    }

    return item.join('\n');
  },
};

export {buildOptions};
