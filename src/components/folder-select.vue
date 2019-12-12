<template>
  <div>
    <el-select
      v-if="stylized"
      v-model="folderId"
      @change="folderChanged"
      clearable
      :filterable="true"
      placeholder="folder…"
      no-match-text="no matches found"
      no-data-text="no data"
    >
      <el-option
        v-for="item in foldersWithText"
        :key="item.id + item.text"
        name="change-folder"
        :label="item.text"
        :value="item.id"
      />
    </el-select>
    <select
      v-else
      v-model="folderId"
      @change="folderChanged($event.target.value)"
    >
      <option
        v-for="item in foldersWithText"
        :key="'plain-' + item.id + item.text"
      >
        {{ item.text }}
      </option>
    </select>
  </div>
</template>

<script>
import {search} from '../../ext/bookmarks.js';

const lastFolderId = 'lastFolderId';

export default {
  props: {
    mode: {
      type: String,
      default: 'stylized',
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['default', 'edit', 'filter'].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      folderId: '',
    };
  },
  computed: {
    stylized() {
      return this.mode === 'stylized';
    },
    folders() {
      return this.$store.state.bookmarks.folders;
    },
    foldersWithText() {
      return this.$store.getters['bookmarks/foldersWithText'];
    },
  },
  beforeMount() {
    if (this[`${this.type}Initialize`]) {
      this[`${this.type}Initialize`]();
    }
  },
  methods: {
    defaultInitialize() {
      //
    },
    async popupInitialize() {
      this.folderId = localStorage.getItem(lastFolderId) || this.folderId;

      if (this.bookmark.parentId) {
        return;
      }

      const [{url, title}] = await this.$browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      this.title = title;
      this.url = url;
      const [bookmark = {}] = await search({url});

      this.bookmark = bookmark;

      if (bookmark.parentId) {
        this.folderId = bookmark.parentId;
      }
    },
    filterInitialize() {
      //
    },

    folderChanged(value) {
      this.folderId = value;

      if (this[`${this.type}Changed`]) {
        this[`${this.type}Changed`](value);
      }
    },
    defaultChanged(id) {
      this.currentFolder = this.getCurrentFolder(id);
      this.$store.dispatch('bookmarks/getResults');
    },
    popupChanged(value) {
      localStorage.setItem(lastFolderId, value);
    },
    editChanged(value) {
      //
    },
    searchChanged(value) {
      //
    },

    getCurrentFolder(id) {
      const folder = id === '0' ?
        {id: 'All', title: ''} :
        this.folders.find((folder) => folder.id === id);

      return Object.assign({}, folder);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
