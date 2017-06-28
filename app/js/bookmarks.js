/* global buildOptions */

let store = new Store('settings');
let getAllBookmarks = new $.Deferred();
var $bookmarks = $('#bookmarks');

let controls = function(bookmarkNode) {
  if (!store.get('includeControls')) {
    return '';
  }

  if (bookmarkNode.url) {
    return `<span class="Bookmark-options is-hidden">
      <button data-action="editlink">Edit</button>
      <button data-action="deletelink">Delete</button>
    </span>`;
  } else {
    return `<span class="Bookmark-options is-hidden">
      <button data-action="addlink">Add</button>
    </span>`;
  }
};

let buildList = {
  node: function(bookmarkNode, query) {
    var item = [];

    if (query && !bookmarkNode.children) {
      if ((`${bookmarkNode.title}`).toLowerCase().indexOf(query) === -1) {
        return '';
      }
    }

    if (!bookmarkNode.title) {
      item.push['<div>'];
    } else if (bookmarkNode.url) {
      item.push(`<li data-url="${bookmarkNode.url}" data-title="${bookmarkNode.title}" data-id="${bookmarkNode.id}" data-parent-id="${bookmarkNode.parentId}">`);
      item.push(`<span class="Bookmark">
        <a class="Bookmark-link" href="${bookmarkNode.url}">${bookmarkNode.title}</a>
        ${controls(bookmarkNode)}
      </span>`);
    } else {
      item.push(`<li data-title="${bookmarkNode.title}" data-folder="${bookmarkNode.id}" data-id="${bookmarkNode.id}">`);
      item.push(`<h4 class="Bookmark">
        ${bookmarkNode.title}
        ${controls(bookmarkNode)}
      </h4>`);
    }

    if (bookmarkNode.children && bookmarkNode.children.length) {
      item.push(buildList.tree(bookmarkNode.children, query));
    }

    item.push(bookmarkNode.title ? '</li>' : '</div>');

    return item.join('');
  },
  tree: function(bookmarkNodes, query) {
    var list = ['<ul>'];

    var i;

    for (i = 0; i < bookmarkNodes.length; i++) {
      list.push(buildList.node(bookmarkNodes[i], query));
    }
    list.push('</ul>');

    return list.join('');
  }
};


let displayBookmarks = function(query = '', folderid = '') {
  query = query.toLowerCase();

  let callbacks = {
    tree: function(bookmarkTreeNodes) {
      let $list = $(buildList.tree(bookmarkTreeNodes, query));

      $list.find('li').not(':has(a)').hide();

      // $('#bookmarks-folder').empty().append($folderList);
      $('#bookmarks').empty().append($list);
    },
    subtree: function(bookmarkTreeNodes) {
      let $list = $(buildList.tree(bookmarkTreeNodes, query));

      if (query) {
        $list.find('li').not(':has(a)').hide();
      }

      $('#bookmarks').empty().append($list);
    }
  };

  if (folderid) {
    chrome.bookmarks.getSubTree(folderid, callbacks.subtree);
  } else {
    chrome.bookmarks.getTree(callbacks.tree);
  }
};


let forms = {
  editlink: function(el) {
    let $li = $(el).closest('li');
    let url = $li.data('url');
    let title = $li.data('title');
    let id = $li.data('id');

    return `<div class="FormGroup">
      <label for="updated-folder">Folder</label>
      <select id="updated-folder"></select>
    </div>
    <div class="FormGroup">
      <label for="updated-url">URL</label>
      <input id="updated-url" type="url" value="${url}">
    </div>
    <div class="FormGroup">
      <label for="updated-title">Title</label>
      <input id="updated-title" type="text" value="${title}">
    </div>
    <div class="FormGroup">
      <button id="edit-bookmark" data-id="${id}">Update</button>
      <button id="close-modal">Cancel</button>
    </div>`;
  },

  deletelink: function(el) {
    let $li = $(el).closest('li');
    let id = $li.data('id');


    return `<p>Are you sure you want to delete this bookmark?</p>
      <div class="FormGroup">
        <button id="delete-bookmark" data-id="${id}">Delete</button>
        <button id="close-modal">Cancel</button>
    </div>`;
  },

  addlink: function(el) {
    let $li = $(el).closest('li');
    let id = $li.data('id');

    return `<div class="FormGroup">
      <label for="added-folder">Folder Name</label>
      <input id="added-folder" type="text" value="">
    </div>
    <div class="FormGroup">
      <label for="added-index">Index</label>
      <input id="added-index" type="number" value="">
    </div>
    <div class="FormGroup">
      <button id="add-folder" data-parent-id="${id}">Add</button>
      <button id="close-modal">Cancel</button>
    </div>`;
  }
};

let formActions = {
  deleteBookmark: function() {
    let id = (this).data('id');

    $bookmarks.modal('close');

    if (id) {
      id = `${id}`;
      chrome.bookmarks.remove(id, function() {
        $(`li[data-id="${id}"]`).remove();
      });
    }
  },
  editBookmark: function() {

    let id = $(this).data('id');

    $bookmarks.modal('close');

    if (id) {
      let updates = {
        title: $('#updated-title').val(),
        url: $('#updated-url').val(),
      };

      id = `${id}`;
      chrome.bookmarks.update(id, updates, function() {
        $(`li[data-id="${id}"]`)
          .find('a')
          .attr({href: updates.url})
          .text(updates.title);
      });
    }
  },
  addFolder: function() {
    let parentId = $(this).data('parentId');
    let addedFolder = $('#added-folder').val().trim();
    let addedIndex = $('#added-index').val().trim();

    if (!addedFolder) {
      return;
    }
    $bookmarks.modal('close');

    if (parentId) {
      let settings = {
        parentId: `${parentId}`,
        title: addedFolder,
      };

      if (addedIndex) {
        settings.index = addedIndex * 1;
      }

      chrome.bookmarks.create(settings, function() {
        let filter = $('#search').val();
        let folderid = $('#change-folder').val();

        displayBookmarks(filter, folderid);
      });
    }
    // chrome.bookmarks.()
  }
};

// Event handlers:

// MODALS
$bookmarks.on('click', '.Bookmark-options button', function(event) {
  $bookmarks.modal('open', {
    openedBy: this
  });
});

$bookmarks.modal({
  beforeOpen: function(data) {
    let action = $(data.openedBy).data('action');
    let form = forms[action];
    let html = form ? form(data.openedBy) : 'no content';

    data.content.empty().append(html);

    if (action !== 'editlink') {
      return;
    }

    // Only for editlinkss
    getAllBookmarks.then((tree) => {
      let folderid = `${$(data.openedBy).closest('li').data('parentId')}`;
      let options = buildOptions.treeNodes(tree, folderid, -1);

      $('#updated-folder').html(options);
    });

  }
});

// FORM ACTIONS
$('body')
  .on('click', '#delete-bookmark', formActions.deleteBookmark)
  .on('click', '#edit-bookmark', formActions.editBookmark)
  .on('click', '#add-folder', formActions.addFolder)
  .on('click', '#close-modal', function(event) {
    $bookmarks.modal('close');
  });

// OTHER
$bookmarks.on('mouseenter mouseleave', '.Bookmark', function(event) {
  $(this).children('.Bookmark-options').toggleClass('is-hidden', event.type === 'mouseleave');
});

$('#search').on('change', function() {
  displayBookmarks($('#search').val(), $('#change-folder').val());
});
$('#newtab-settings').on('click', function(event) {
  chrome.runtime.openOptionsPage();
});
$('#change-folder').on('change', function(event) {
  displayBookmarks('', $(this).val());
});
$('#view-all').on('click', function(event) {
  $('#search').val('');
  $('#change-folder').val('0');
  displayBookmarks();
});

document.addEventListener('DOMContentLoaded', function() {
  let folderid = store.get('folderid');

  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    getAllBookmarks.resolve(bookmarkTreeNodes);
    let list = buildOptions.treeNodes(bookmarkTreeNodes, folderid, -1);
    let changeFolder = document.getElementById('change-folder');

    if (changeFolder) {
      changeFolder.innerHTML = list;
    }

  });

  displayBookmarks('', store.get('folderid'));
});
