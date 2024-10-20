<template>
  <el-dialog :visible.sync="isEditing">
    <form @submit.prevent="update" class="Form">
      <div class="form-item">
        <label for="update-folder">Folder</label>
        <el-select
          v-model="parentId"
          @change="changePosition"
          id="update-folder"
          class="Select"
          clearable
          :filterable="true"
          placeholder="folder…"
          no-match-text="no matches found"
          no-data-text="no data"
        >
          <el-option
            v-for="item in foldersWithText"
            :key="item.text + item.id"
            name="change-folder"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="form-item">
        <label for="edit-title">Title</label>
        <input v-model="title" id="edit-title" type="text">
      </div>
      <div class="form-item">
        <label for="edit-url">URL</label>
        <input v-model="url" id="edit-url" type="text">
      </div>

      <div class="form-item">
        <label for="edit-index">Index</label>
        <select v-model="index">
          <option v-for="n in len" :key="n" :value="n + offset">
            {{ n + offset }}
          </option>
        </select>
      </div>
      <ul>
        <li>Date Added: {{ editing.dateAdded | date }}</li>
        <li>ID: {{ editing.id }} / Parent ID: {{ editing.parentId }}</li>
      </ul>
      <div class="action-row">
        <ntb-button @click="isEditing = null">Cancel</ntb-button>
        <ntb-button type="submit" color="primary">{{ action === 'create' ? 'Add' : 'Update' }}</ntb-button>
        <ntb-button
          v-if="action !== 'create'"
          @click="remove"
          class="del"
          color="danger"
        >
          Delete
        </ntb-button>
      </div>
    </form>
  </el-dialog>
</template>

<script>
import {getBookmarkWithPosition} from '../ext/bookmarks.js';
import NtbButton from '../components/ntb-button.vue';

export default {
  components: {
    NtbButton,
  },
  data() {
    return {
      parentId: '0',
      title: '',
      url: '',
      index: 0,
      indexOffset: 0,
      len: 0,
      action: '',
    };
  },
  computed: {
    foldersWithText() {
      return this.$store.getters['bookmarks/foldersWithText'];
    },
    editing() {
      return this.$store.state.bookmarks.editing;
    },
    offset() {
      return this.editing.url ? this.indexOffset : -1;
    },
    isEditing: {
      get() {
        return !!this.editing;
      },
      set(value) {
        this.$store.commit('bookmarks/setState', {name: 'editing', value});
      },
    },
  },
  created() {
    this.parentId = `${this.editing.parentId}`;
    this.title = this.editing.title;
    this.url = this.editing.url;
    this.index = this.editing.index;
    this.indexOffset = this.editing.indexOffset || -1;
    this.len = this.editing.len;
    this.action = this.editing.action;
  },
  methods: {
    async changePosition() {
      if (!this.parentId) {
        return;
      }
      const {len, indexOffset} = await getBookmarkWithPosition(this.parentId, 'parent');

      this.len = len || 0;
      this.indexOffset = indexOffset;

      // console.log('changePosition', this.len, this.indexOffset);
    },
    async update() {
      const {editing = {}, title, url, parentId} = this;
      const {id} = editing;
      // If index is greater than number of items in new folder,
      // we have to change it or it'll throw an error:
      let index = this.index;

      if (parentId !== editing.parentId && this.index > this.len) {
        index = this.len;
      }
      // Create new bookmark
      if (this.action === 'create') {
        // eslint-disable-next-line no-return-await
        return await this.create({title, url, parentId, index});
      }
      // Update bookmark within same folder
      if (title !== editing.title || url !== editing.url) {
        console.log('[edit-dialogue]', 'updating', {id, title, url});
        await this.$store.dispatch('bookmarks/update', {id, title, url});
      }

      // Move bookmark to another folder
      if (parentId !== editing.parentId || this.index !== editing.index) {
        await this.$store.dispatch('bookmarks/move', {id, parentId, index: index || 0});
      }

      this.isEditing = null;
    },

    async create(obj = {}) {
      const {url, ...bookmark} = obj;

      if (url) {
        bookmark.url = url;
      }

      await this.$store.dispatch('bookmarks/create', bookmark);
      this.isEditing = null;
    },

    remove() {
      const {id} = this.editing;

      this.$store.dispatch('bookmarks/remove', id);
      this.isEditing = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.Form
.Select {
  width: 100%;
}
.del {
  margin-left: auto;
}
.action-row {
  display: flex;
  gap: 0.5rem;
}
</style>
