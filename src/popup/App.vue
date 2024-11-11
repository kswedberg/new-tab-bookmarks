<template>
  <div class="Popup">
    <form @submit.prevent="addBookmark">
      <div class="Popup-folder">
        <label for="edit-folder-id">Folder</label>
        <select
          v-model="folderId"
          @change="folderChanged"
          class="Select"
          id="edit-folder-id"
        >
          <option value="">Folder…</option>
          <option
            v-for="item in foldersWithText"
            :key="item.id + item.text"
            name="change-folder"
            :label="item.text"
            :value="item.id"
          />
        </select>
      </div>


      <div class="form-item">
        <label for="popup-title">Title</label>
        <input v-model="title" type="text" id="popup-title">
      </div>
      <div class="form-item">
        <label for="popup-url">URL</label>
        <input v-model="url" id="popup-url">
      </div>
      <div>
        <ntb-button @click="close">Cancel</ntb-button>
        <ntb-button type="submit" color="primary">{{ buttonText }}</ntb-button>
        <ntb-button
          v-if="bookmark.id"
          @click="maybeDelete"
          :color="warningDelete ? 'danger' : 'info'"
          :icon="warningDelete ? 'question' : 'delete'"
          round
        />
      </div>
    </form>
  </div>
</template>
<script>
import {search, upsert, remove} from '../ext/bookmarks.js';
import NtbButton from '../components/ntb-button.vue';

const lastFolderId = 'lastFolderId';

export default {
  components: {
    NtbButton,
  },
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

  async created() {
    await this.$store.dispatch('settings/initialize');
    await this.$store.dispatch('bookmarks/initialize');

    console.log(lastFolderId, this.folderId);
    this.folderId = localStorage.getItem(lastFolderId) || this.folderId;
    console.log(this.folderId);

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
    this.title = this.bookmark.title || title;

    if (bookmark.parentId) {
      this.folderId = bookmark.parentId;
    }

  },
  methods: {
    close() {
      window.close();
    },
    async folderChanged() {
      await this.$nextTick();
      localStorage.setItem(lastFolderId, this.folderId);
    },
    async addBookmark() {
      const {title, url, folderId: parentId} = this;

      await upsert({parentId, title, url: url || null}, this.bookmark);
      this.close();
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
<style scoped>
.Popup {
  min-width: 500px;
  /* text-align: center; */
  padding: 14px 10px;
  p {
    text-align: left;
  }
}
.Popup-folder {
  margin-block-end: 1rem;
}

.Select {
  width: 100%;
}
select {
  height: 26px;
  border: 1px solid #ccc;
}
.el-select-dropdown__item span {
  white-space: pre;
}
</style>
