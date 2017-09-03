import {Store} from '../lib/store.js';

let store = new Store('settings');

let tmpl = {
  controls: (bookmarkNode) => {
    if (!store.get('includeControls')) {
      return '';
    }

    if (bookmarkNode.url) {
      return `<span class="Bookmark-options is-hidden">
        <button class="Btn Btn--inverse Btn--bookmark" data-action="edit">Edit</button>
        <button class="Btn Btn--inverse Btn--bookmark" data-action="delete">Delete</button>
      </span>`;
    } else {
      return `<span class="Bookmark-options is-hidden">
        <button class="Btn Btn--inverse Btn--bookmark" data-action="add">Add</button>
        <button class="Btn Btn--inverse Btn--bookmark" data-action="rename">Rename</button>
      </span>`;
    }
  },
  cellItem: (bookmarkNode) => {
    return `<div
      class="Bookmark Bookmark--item"
      data-url="${bookmarkNode.url}"
      data-title="${bookmarkNode.title}"
      data-id="${bookmarkNode.id}"
      data-parent-id="${bookmarkNode.parentId}"
      data-index="${bookmarkNode.index}"
    >
      <span class="Bookmark-inner">
        <a class="Bookmark-link" href="${bookmarkNode.url}">${bookmarkNode.title}</a>
        ${tmpl.controls(bookmarkNode)}
      </span>
    </div>`;
  },
  cellFolder: (bookmarkNode) => {
    return `<div
      class="Bookmark Bookmark--folder"
      data-title="${bookmarkNode.title}"
      data-folder="${bookmarkNode.id}" data-id="${bookmarkNode.id}">
      <span class="Bookmark-inner">
        <h4>${bookmarkNode.title}</h4>
        ${tmpl.controls(bookmarkNode)}
      </span>
    </div>`;
  },

  editForm: (data) => {
    return `<form id="edit-bookmark" data-id="${data.id}">
      <div class="FormField FormField--select">
        <label for="updated-parentId">Folder</label>
        <div class="FormField-selectWrap">
          <select id="updated-parentId" data-parent-id="${data.parentId}"></select>
        </div>
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
        <button type="submit">Update</button>
        <button id="close-modal" class="Btn Btn--inverse">Cancel</button>
      </div>
    </form>`;
  },
  deleteForm: (id) => {
    return `<form id="delete-bookmark" data-id="${id}">
      <p>Are you sure you want to delete this bookmark?</p>
      <div class="FormField">
        <button type="submit">Delete</button>
        <button type="button" id="close-modal" class="Btn Btn--inverse">Cancel</button>
      </div>
    </form>`;
  },
  addForm: (id) => {
    return `<form id="add-folder" data-parent-id="${id}">
      <div class="FormField FormField--text">
        <label for="added-folder">Folder Name</label>
        <input id="added-folder" type="text" value="">
      </div>
      <div class="FormField FormField--text">
        <label for="added-index">Index</label>
        <input id="added-index" type="number" value="">
      </div>
      <div class="FormField">
        <button type="submit">Add</button>
        <button type="button" id="close-modal" class="Btn Btn--inverse">Cancel</button>
      </div>
    </form>`;
  },
  renameForm: (data) => {
    return `<form id="rename-folder" data-id="${data.id}">
      <div class="FormField FormField--text">
        <label for="renamed-title">Title</label>
        <input id="renamed-title" type="text" value="${data.title}">
      </div>
      <div class="FormField">
        <button type="submit">Rename</button>
        <button type="button" id="close-modal" class="Btn Btn--inverse">Cancel</button>
      </div>
    </form>`;
  },
};

export {tmpl};
