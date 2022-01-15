<template>
  <el-dialog :visible.sync="isEditing">
    <el-form @submit.native.prevent="update" class="Form" label-width="80px">
      <el-form-item label="Folder">
        <el-select
          v-model="parentId"
          @change="changePosition"
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
      </el-form-item>
      <el-form-item label="Title" size="large">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="URL" size="large">
        <el-input v-model="url" />
      </el-form-item>

      <el-form-item label="Index">
        <select v-model="index">
          <option v-for="n in len" :key="n" :value="n + offset">
            {{ n + offset }}
          </option>
        </select>
      </el-form-item>
      <ul>
        <li>Date Added: {{ editing.dateAdded | date }}</li>
        <li>ID: {{ editing.id }} / Parent ID: {{ editing.parentId }}</li>
      </ul>
      <div>
        <el-button @click="isEditing = null">Cancel</el-button>
        <el-button native-type="submit" type="primary">{{ action === 'create' ? 'Add' : 'Update' }}</el-button>
        <el-button v-if="action !== 'create'" @click="remove" type="danger">Delete</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import {getBookmarkWithPosition} from '../ext/bookmarks.js';

export default {
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
</style>
