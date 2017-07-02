import {Store} from '../lib/store.js';

let store = new Store('settings');

let tmpl = {
  controls: (bookmarkNode) => {
    if (!store.get('includeControls')) {
      return '';
    }

    if (bookmarkNode.url) {
      return `<span class="Bookmark-options is-hidden">
        <button class="Btn Btn--inverse" data-action="editlink">Edit</button>
        <button class="Btn Btn--inverse" data-action="deletelink">Delete</button>
      </span>`;
    } else {
      return `<span class="Bookmark-options is-hidden">
        <button class="Btn Btn--inverse" data-action="addlink">Add</button>
      </span>`;
    }
  },

  editForm: (data) => {
    return `<div class="FormField FormField--select">
      <label for="updated-parentId">Folder</label>
      <select id="updated-parentId" data-parent-id="${data.parentId}"></select>
    </div>
    <div class="FormField FormField--text">
      <label for="updated-index">Index</label>
      <input id="updated-index" type="text" data-index="${data.index}" value="${data.index}">
    </div>
    <div class="FormField FormField--text">
      <label for="updated-url">URL</label>
      <input id="updated-url" type="url" data-url="${data.url}" value="${data.url}">
    </div>
    <div class="FormField FormField--text">
      <label for="updated-title">Title</label>
      <input id="updated-title" type="text" data-title="${data.title}" value="${data.title}">
    </div>
    <div class="FormField">
      <button id="edit-bookmark" data-id="${data.id}">Update</button>
      <button id="close-modal" class="Btn Btn--inverse">Cancel</button>
    </div>`;
  },

  deleteForm: (id) => {
    `<p>Are you sure you want to delete this bookmark?</p>
      <div class="FormField">
        <button id="delete-bookmark" data-id="${id}">Delete</button>
        <button id="close-modal" class="Btn Btn--inverse">Cancel</button>
    </div>`;
  },
  addForm: (id) => {
    return `<div class="FormField FormField--text">
      <label for="added-folder">Folder Name</label>
      <input id="added-folder" type="text" value="">
    </div>
    <div class="FormField FormField--text">
      <label for="added-index">Index</label>
      <input id="added-index" type="number" value="">
    </div>
    <div class="FormField">
      <button id="add-folder" data-parent-id="${id}">Add</button>
      <button id="close-modal" class="Btn Btn--inverse">Cancel</button>
    </div>`;
  },
};

export {tmpl};
