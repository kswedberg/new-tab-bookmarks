//
// ****** This is not being used.
// ****** Only here until we create a Vue component for the grid layout
//

import {tmpl} from './templates.js';

let parentIds = new Set();

let buildList = {
  grid: function(bookmarkNodes, query) {
    let list = [];
    let i;

    for (i = 0; i < bookmarkNodes.length; i++) {
      list.push(buildList.cell(bookmarkNodes[i], query));
    }

    return list.join('');
  },
  cell: function(bookmarkNode, query) {
    let item = [];

    if (query && !bookmarkNode.children) {
      if ((`${bookmarkNode.title}`).toLowerCase().indexOf(query) === -1) {
        return '';
      }
    }

    if (bookmarkNode.url) {
      if (query) {
        parentIds.add(bookmarkNode.parentId);
      }
      item.push(tmpl.cellItem(bookmarkNode));
    } else if (bookmarkNode.title) {
      item.push(tmpl.cellFolder(bookmarkNode));
    }

    if (bookmarkNode.children && bookmarkNode.children.length) {
      item.push(buildList.grid(bookmarkNode.children, query));
      item.push('<div class="Hr"></div>');
    }

    return item.join('');
  },
};

export {buildList};
