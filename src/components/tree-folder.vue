<template lang="html">
  <div class="Folder">
    <div v-show="editing">
      <input
        v-model="bookmarkTitle"
        @click.stop="noop"
        class="Folder-input"
        :id="did"
        type="text"
      >
      <el-button-group class="ButtonGroup">
        <el-button
          @click.stop.prevent="rename('bookmarkTitle')"
          type="plain"
          size="mini"
          icon="el-icon-circle-check"
        />
        <el-button
          @click.stop.prevent="cancelEdit"
          type="plain"
          size="mini"
          icon="el-icon-circle-close"
        />
      </el-button-group>
    </div>
    <label
      v-show="!editing"
      class="Folder-label"
      :for="did"
    >
      <span
        v-for="(label, i) in allLabels"
        :key="'label-' + i"
        :class="{'Folder-labelParent': i < allLabels.length - 1}"
      >
        {{ label }}
        <i v-if="i < allLabels.length - 1" class="el-icon-arrow-right"/>
      </span>

    </label>
    <el-button-group class="ButtonGroup">
      <el-button
        @click.stop.prevent="openEditing"
        type="plain"
        size="mini"
        icon="el-icon-edit"
      />
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
      bookmarkTitle: '',
    };
  },
  computed: {
    did() {
      return `d-${this.id}`;
    },
    label() {
      return this.bookmarkTitle || this.title || 'All Bookmarks';
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
  created() {
    this.syncTitle();
  },

  methods: {
    noop: (_) => _,
    syncTitle() {
      this.bookmarkTitle = `${this.title}`;
    },
    setEditing(on) {
      this.editing = on && this.id;
    },
    openEditing() {
      this.$store.dispatch('bookmarks/getEditing', this.id);
    },
    edit() {
      this.setEditing(true);
      // this.bookmarkTitle = this.title;
      console.log('bookmarkTitle', this.bookmarkTitle);
      console.log('title', this.title);
    },
    toggleActive(type, active) {
      this[`${type}Active`] = active;
    },

    cancelEdit() {
      this.syncTitle();
      this.setEditing(false);
    },

    rename(prop) {
      this.setEditing(false);
      update(this.id, {title: this[prop]}).then(() => {
        return this.$store.commit('bookmarks/updateFolder', {
          id: this.id,
          title: this[prop],
        });
      });
    },
  },
};
</script>

<style lang="postcss">
.Folder {
  position: relative;

  &:hover {
    .ButtonGroup {
      opacity: 1;
    }
  }
}

.ButtonGroup {
  opacity: 0;
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
  /* cursor: pointer; */
  height: 26px;
  line-height: 24px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
}
.Folder-labelParent {
  color: var(--muted-color);
}
.ButtonGroup {
  display: inline-block;
}
</style>
