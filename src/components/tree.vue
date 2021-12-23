<template lang="html">
  <!--
  **** This is a recursive component.
  **** Not currently being used.
  **** Using Element UI's <el-tree> instead
   -->
  <ul
    v-if="children && children.length"
    :class="'level-' + depth"
  >
    <li>
      <div class="Hdg">
        <TreeFolder :id="id" :title="title" />
      </div>
      <TreeChildren
        v-for="child in children"
        :id="child.id"
        :key="'node-' + child.id"
        :title="child.title"
        :url="child.url"
        :children="child.children"
        :depth="depth + 1"
      />
    </li>
  </ul>
  <li v-else>
    <a
      v-if="url"
      :href="url"
    >
      {{ title }}
    </a>
  </li>
</template>

<script>
import {update} from '../ext/bookmarks.js';
import TreeFolder from './tree-folder.vue';

export default {
  // The name 'tree' here is being used in the <template> above to call this component recursively
  name: 'TreeChildren',

  components: {
    TreeFolder,
  },
  props: {
    children: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    depth: {
      type: [Number, String],
      default: 0,
    },
    parentTitle: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      headingActive: false,
      linkActive: false,
      editing: false,
      bookmarkTitle: this.title,
    };
  },
  methods: {
    toggleActive(type, active) {
      this[`${type}Active`] = active;
    },

    rename(attr) {
      update(this.id, {title: this[attr]}).then(() => {
        return this.$store.commit('bookmarks/updateFolder', {
          id: this.id,
          title: this[attr],
        });
      });
    },
  },
};
</script>

<style lang="scss">
ul {
  list-style-type: none;
  padding-left: 20px;

  &.level-0 {
    padding-left: 0;
  }
}

li {
  line-height: 1.4;
}

.Hdg {
  padding: 8px 0 4px;
}
</style>
