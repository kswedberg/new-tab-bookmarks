<template lang="html">
  <div class="Folder">
    <button @click="changeFolder" class="Folder-label" type="button">
      <span
        v-for="(labelPart, i) in allLabels"
        :key="'label-' + i"
        :class="{'Folder-labelParent': i < allLabels.length - 1}"
      >
        {{ labelPart }}
        <!-- <span class="dim">({{ id }})</span> -->
        <i v-if="i < allLabels.length - 1" class="el-icon-arrow-right" />
      </span>
    </button>
    <el-button-group class="ButtonGroup">
      <el-button
        @click.stop.prevent="openDialog('update')"
        type="plain"
        size="mini"
        icon="el-icon-edit"
      >
        <span class="sr-only">edit</span>
      </el-button>
      <el-button
        @click.stop.prevent="openDialog('create')"
        type="plain"
        size="mini"
        icon="el-icon-plus"
      >
        <span class="sr-only">add</span>
      </el-button>
      <el-popconfirm
        v-model="isConfirmDeleteVisible"
        @confirm="removeTree"
        @cancel="isConfirmDeleteVisible = false"
        title="Delete folder and all bookmarks within it?"
        confirm-button-text="Delete"
        confirm-button-type="danger"
        cancel-button-text="Cancel"
        icon-color="#F56C6C"
      >
        <!-- This button triggers the popconfirm -->
        <el-button
          slot="reference"
          @click.stop.prevent="isConfirmDeleteVisible = !isConfirmDeleteVisible"
          type="danger"
          size="mini"
          icon="el-icon-delete"
        />
      </el-popconfirm>
    </el-button-group>
  </div>
</template>

<script>
import {update} from '../ext/bookmarks.js';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      default: '',
      type: String,
    },
    parents: {
      type: Array,
      default() {
        return [];
      },
    },
    parentTitles: {
      type: [String, Array],
      default: '',
    },
  },

  data() {
    return {
      editing: false,
      isConfirmDeleteVisible: false,
    };
  },
  computed: {
    did() {
      return `d-${this.id}`;
    },
    label() {
      return this.title || 'All Bookmarks';
    },
    allLabels() {
      return [...this.parents, this.label];
    },
    labelParent() {
      return this.parentTitle
        ? `${this.parentTitle} <i class="el-icon-arrow-right"></i>`
        : '';
    },
  },

  methods: {
    noop: (_) => _,
    async openDialog(action) {
      await this.$store.dispatch('bookmarks/getEditing', {id: this.id, action});
    },

    async changeFolder() {
      this.$store.commit('bookmarks/setState', {
        name: 'searchFilter',
        value: '',
      });

      await this.$store.dispatch('bookmarks/setCurrentFolderFromId', this.id);
      await this.$store.dispatch('bookmarks/getResults');
    },

    async removeTree() {
      this.isConfirmDeleteVisible = false;
      await this.$store.dispatch('bookmarks/removeTree', this.id);
      await this.$store.dispatch('bookmarks/getResults');
    },

    onShowConfirmDelete() {
      this.$refs.confirm.$el.focus();
    },
  },
};
</script>

<style lang="scss">
.Folder {
  position: relative;
  .ButtonGroup {
    opacity: 0;
  }
  &:hover {
    .ButtonGroup {
      opacity: 1;
    }
  }
  .ButtonGroup:focus-within {
    opacity: 1;
  }
}


.Folder-input {
  font-size: 1em;
  padding: 0 3px;
  height: 26px;
  line-height: 24px;
  min-width: 100px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}

.Folder-label {
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  height: 26px;
  line-height: 24px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  background-color: transparent;
}

.Folder-labelParent {
  color: var(--muted-color);
}
.ButtonGroup {
  display: inline-block;
}
</style>
