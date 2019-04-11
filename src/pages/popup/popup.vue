<template lang="html">
  <div class="Popup" style="min-width:400px;">
    <el-form @submit.native.prevent="addBookmark">
      <el-form-item class="Popup-folder" label="Folder">
        <el-select
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
      </el-form-item>


      <el-form-item label="Title">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="url" />
      </el-form-item>
      <div>
        <el-button @click="close">Cancel</el-button>
        <el-button native-type="submit" type="primary">{{ buttonText }}</el-button>
        <el-button
          v-if="bookmark.id"
          @click="maybeDelete"
          :type="warningDelete ? 'danger' : 'info'"
          :icon="warningDelete ? 'el-icon-question' : 'el-icon-delete'"
          circle
        />
      </div>
    </el-form>
  </div>
</template>
<script>
import {search, upsert, remove} from '../../ext/bookmarks.js';

const lastFolderId = 'lastFolderId';

export default {
  data() {
    return {
      folderId: '',
      title: '',
      url: '',
      folders: [],
      bookmark: {},
      warningDelete: false,
    };
  },
  computed: {
    buttonText() {
      return this.bookmark.id ? 'Update Bookmark' : 'Add Bookmark';
    },
    foldersWithText() {
      return this.$store.getters['bookmarks/foldersWithText'];
    },
  },

  created() {
    this.$store
    .dispatch('settings/initialize')
    .then(() => {
      return this.$store.dispatch('bookmarks/initialize');
    })
    .then(() => {
      this.folderId = localStorage.getItem(lastFolderId) || this.folderId;
    })
    .then(() => {
      if (this.bookmark.parentId) {
        return;
      }

      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        ([{url, title}]) => {
          this.title = title;
          this.url = url;
          search({url}).then(([bookmark = {}]) => {
            this.bookmark = bookmark;

            if (bookmark.parentId) {
              this.folderId = bookmark.parentId;
            }
          });
        }
      );
    });
  },
  methods: {
    close() {
      window.close();
    },
    folderChanged(value) {
      this.folderId = value;
      localStorage.setItem(lastFolderId, value);
    },
    addBookmark() {
      const {title, url, folderId: parentId} = this;

      upsert({parentId, title, url: url || null}, this.bookmark).then(
        this.close
      );
    },
    maybeDelete() {
      if (!this.warningDelete) {
        this.warningDelete = true;

        return;
      }

      remove(this.bookmark.id);
      this.close();
    },
  },
};
</script>
<style lang="postcss">
.Popup {
  /* text-align: center; */
  padding: 14px 10px;
  p {
    text-align: left;
  }
}
.Popup-folder label {
  display: block;
  text-align: left;
  float: none;
}
select {
  height: 26px;
  border: 1px solid #ccc;
}
.el-select-dropdown__item span {
  white-space: pre;
}
</style>
