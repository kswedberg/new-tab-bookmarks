import 'jquery';
import '../lib/jquery.modal.js';
import {Store} from '../lib/store.js';
import {buildOptions} from './build-options.js';
import {buildList} from './build-list.js';
import {tmpl} from './templates.js';

let store = new Store('settings');
let getAllBookmarks = new $.Deferred();
var $bookmarks = $('#bookmarks');

let getSettings = function(items) {
  let updated;
  let updates = {};

  items.forEach((item) => {
    let $item = $(`#updated-${item}`);
    let val = $item.val();
    let data = $item.data(item);

    if (item === 'index') {
      val = Number(val);
    } else {
      data = String(data);
    }

    if (val !== data) {
      updated = true;
      updates[item] = val;
    }
  });

  return updated ? updates : false;
};

let toggleClassInsert = function(className, $list) {
  $bookmarks
  .removeClass(className === 'is-grid' ? 'is-tree' : 'is-grid')
  .addClass(className)
  .empty()
  .append($list);
};

let hideItems = function($list, list) {
  $list
  .not(function() {
    return $(this).hasClass('Bookmark--item') || list.parentIds.has(`${$(this).data('id')}`);
  })
  .addClass('is-hidden');

  $list.find('li').not(':has(a)').addClass('is-hidden');

};

let displayBookmarks = function(query = '', folderid = '') {
  let className = store.get('layout');
  let method = className === 'is-grid' ? 'grid' : 'tree';

  query = query.toLowerCase();

  let callbacks = {
    tree: function(bookmarkTreeNodes) {
      let list = buildList.get(method, bookmarkTreeNodes, query);
      let $list = $(list.items);

      if (query) {
        hideItems($list, list);
      }

      toggleClassInsert(className, $list);
    },
    subtree: function(bookmarkTreeNodes) {
      let list = buildList.get(method, bookmarkTreeNodes, query);
      let $list = $(list.items);


      if (query) {
        hideItems($list, list);
      }

      toggleClassInsert(className, $list);
    }
  };

  if (folderid) {
    chrome.bookmarks.getSubTree(folderid, callbacks.subtree);
  } else {
    chrome.bookmarks.getTree(callbacks.tree);
  }
};

let forms = {
  edit: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let data = ['url', 'parentId', 'title', 'id', 'index'].reduce((previous, current) => {
      previous[current] = $bkmk.data(current);

      return previous;
    }, {});

    return tmpl.editForm(data);
  },

  delete: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let id = $bkmk.data('id');

    console.log(id);

    return tmpl.deleteForm(id);
  },

  add: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let id = $bkmk.data('id');

    return tmpl.addForm(id);
  },

  rename: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let id = $bkmk.data('id');
    let title = $bkmk.data('title');

    return tmpl.renameForm({id, title});
  }
};

let formActions = {
  deleteBookmark: function(event) {
    event.preventDefault();
    let id = $(this).data('id');

    $bookmarks.modal('close');

    if (id) {
      id = `${id}`;
      chrome.bookmarks.remove(id, function() {
        $(`[data-id="${id}"]`).remove();
      });
    }
  },

  editBookmark: function(event) {
    event.preventDefault();
    let redump = function() {
      let filter = $('#search').val();
      let folderid = $('#change-folder').val();

      displayBookmarks(filter, folderid);
    };
    let id = $(this).data('id');

    $bookmarks.modal('close');

    if (id) {
      let moves = getSettings(['parentId', 'index']);
      let updates = getSettings(['title', 'url']);

      id = `${id}`;

      if (moves && updates) {
        chrome.bookmarks.move(id, moves, function() {
          chrome.bookmarks.update(id, updates, redump);
        });
      } else if (moves) {
        chrome.bookmarks.move(id, moves, redump);
      } else if (updates) {
        chrome.bookmarks.update(id, updates, redump);
      }
    }
  },

  addFolder: function(event) {
    event.preventDefault();
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
  },
  renameFolder: function(event) {
    event.preventDefault();
    let id = $(this).data('id');
    let title = $('#renamed-title').val().trim();

    if (id) {
      id = `${id}`;

      chrome.bookmarks.update(id, {title}, function() {
        $(`[data-id="${id}"]`)
        .data('title', title)
        .find('h4')
        .text(title);

        $('option').filter(function() {
          return this.value === id;
        })
        .text(title);
      });
    }

    $bookmarks.modal('close');
  },
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

    if (action !== 'edit') {
      return;
    }

    // Only for edits
    getAllBookmarks.then((tree) => {
      let folderid = `${$(data.openedBy).closest('.Bookmark').data('parentId')}`;
      let options = buildOptions.treeNodes(tree, folderid, -1);

      $('#updated-parentId').html(options);
    });
  }
});

// FORM ACTIONS
$('body')
.on('submit', '#delete-bookmark', formActions.deleteBookmark)
.on('submit', '#edit-bookmark', formActions.editBookmark)
.on('submit', '#add-folder', formActions.addFolder)
.on('submit', '#rename-folder', formActions.renameFolder)
.on('click', '#close-modal', function(event) {
  $bookmarks.modal('close');
});

// OTHER
$bookmarks.on('mouseenter mouseleave', '.Bookmark-inner', function(event) {
  $(this).children('.Bookmark-options').toggleClass('is-hidden', event.type === 'mouseleave');
});

$('#search').on('change', function() {
  displayBookmarks($('#search').val(), $('#change-folder').val());
});

$('#newtab-settings').on('click', function(event) {
  chrome.runtime.openOptionsPage();
});
$('#change-folder').on('change', function(event) {
  displayBookmarks($('#search').val(), $(this).val());
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
