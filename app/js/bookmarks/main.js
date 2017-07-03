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

let addClassInsert = function(className, $list) {
  $bookmarks
  .addClass(className)
  .empty()
  .append($list);
};

let displayBookmarks = function(query = '', folderid = '') {
  let className = store.get('layout');
  let method = className === 'is-grid' ? 'grid' : 'tree';

  query = query.toLowerCase();

  let callbacks = {
    tree: function(bookmarkTreeNodes) {

      let $list = $(buildList[method](bookmarkTreeNodes, query));

      $list.find('li').not(':has(a)').addClass('is-hidden');

      addClassInsert(className, $list);
    },
    subtree: function(bookmarkTreeNodes) {
      let $list = $(buildList[method](bookmarkTreeNodes, query));

      if (query) {
        $list.find('li').not(':has(a)').addClass('is-hidden');
      }

      addClassInsert(className, $list);
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
    let $bkmk = $(el).closest('.Bookmark');
    let data = ['url', 'parentId', 'title', 'id', 'index'].reduce((previous, current) => {
      previous[current] = $bkmk.data(current);

      return previous;
    }, {});

    return tmpl.editForm(data);
  },

  deletelink: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let id = $bkmk.data('id');

    console.log(id);

    return tmpl.deleteForm(id);
  },

  addlink: function(el) {
    let $bkmk = $(el).closest('.Bookmark');
    let id = $bkmk.data('id');

    return tmpl.addForm(id);
  }
};

let formActions = {
  deleteBookmark: function() {
    let id = $(this).data('id');

    $bookmarks.modal('close');

    if (id) {
      id = `${id}`;
      chrome.bookmarks.remove(id, function() {
        $(`[data-id="${id}"]`).remove();
      });
    }
  },
  editBookmark: function() {
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

    // Only for editlinks
    getAllBookmarks.then((tree) => {
      let folderid = `${$(data.openedBy).closest('.Bookmark').data('parentId')}`;
      let options = buildOptions.treeNodes(tree, folderid, -1);

      $('#updated-parentId').html(options);
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
  $(this).find('.Bookmark-options').toggleClass('is-hidden', event.type === 'mouseleave');
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
