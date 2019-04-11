import {tmpl} from './templates.js';

let parentIds = new Set();

let buildList = {
  node: function(bookmarkNode, query) {
    let item = [];

    if (query && !bookmarkNode.children) {
      if ((`${bookmarkNode.title}`).toLowerCase().indexOf(query) === -1) {
        return '';
      }
    }

    if (!bookmarkNode.title) {
      item.push('<div>');
    } else if (bookmarkNode.url) {
      if (query) {
        parentIds.add(bookmarkNode.parentId);
      }

      item.push(`<li
        class="Bookmark Bookmark--item"
        data-url="${bookmarkNode.url}"
        data-title="${bookmarkNode.title}"
        data-id="${bookmarkNode.id}"
        data-parent-id="${bookmarkNode.parentId}"
        data-index="${bookmarkNode.index}"
      >`);
      item.push(`<span class="Bookmark-inner">
        <a class="Bookmark-link" href="${bookmarkNode.url}">${bookmarkNode.title}</a>
        ${tmpl.controls(bookmarkNode)}
      </span>`);
    } else {
      item.push(`<li
        class="Bookmark Bookmark--folder"
        data-title="${bookmarkNode.title}"
        data-folder="${bookmarkNode.id}" data-id="${bookmarkNode.id}">`);
      item.push(`<h4 class="Bookmark-inner">
        ${bookmarkNode.title}
        ${tmpl.controls(bookmarkNode)}
      </h4>`);
    }

    if (bookmarkNode.children && bookmarkNode.children.length) {
      item.push(buildList.tree(bookmarkNode.children, query));
    }

    item.push(bookmarkNode.title ? '</li>' : '</div>');

    return item.join('');
  },

  tree: function(bookmarkNodes, query) {
    let list = ['<ul>'];

    let i;

    for (i = 0; i < bookmarkNodes.length; i++) {
      list.push(buildList.node(bookmarkNodes[i], query));
    }
    list.push('</ul>');

    return list.join('');
  },

  get: function(method, bookmarkNodes, query) {
    parentIds.clear();

    let items = buildList[method](bookmarkNodes, query);

    return {
      items,
      parentIds
    };


  },
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
