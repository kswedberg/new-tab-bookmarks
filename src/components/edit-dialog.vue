<template>
  <el-dialog :visible.sync="isEditing">
    <el-form @submit.native.prevent="update" class="Form Form--inline"  label-width="80px">
      <el-form-item label="Folder">
        <el-select
          v-model="parentId"
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
      <div>
        <el-button @click="isEditing = null">Cancel</el-button>
        <el-button native-type="submit" type="primary">Update</el-button>
        <el-button @click="remove" type="danger">Delete</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      parentId: '0',
      title: '',
      url: '',
    };
  },
  computed: {
    foldersWithText() {
      return this.$store.getters['bookmarks/foldersWithText'];
    },
    editing() {
      return this.$store.state.bookmarks.editing;
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
  },
  methods: {
    update() {
      const {id} = this.editing;
      const {title, url, parentId} = this;

      if (title !== this.editing.title || url !== this.editing.url) {
        this.$store.dispatch('bookmarks/update', {id, title, url});
      }
      if (parentId !== this.editing.parentId) {
        this.$store.dispatch('bookmarks/move', {id, parentId});
      }

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

<style lang="postcss" scoped>
.Form {
  width: 100%;
}
</style>
