<template lang="html">
  <!--
  **** This is a recursive component.
   -->
  <div v-if="url && (!children || !children.length)" class="Grid-cell">
    <el-button
      @click="openEditing"
      icon="el-icon-edit"
      type="primary"
      class="EditBtn"
      size="mini"
      round
    />
    <a
      v-if="url"
      :href="url"
    >
      {{ title }}
    </a>
  </div>
  <div
    v-else-if="children && children.length"
    :class="'Level Level--' + depth"
  >
    <div
      v-if="id"
      v-show="hasChildLink"
      class="Hdg"
    >
      <TreeFolder :id="id" :parents="parents" :title="title"/>
      <button @click="toggleExpanded(id)" class="Hdg-toggleExpanded" type="button">
        {{ expanded.includes(id) ? '-' : '+' }}
      </button>
    </div>
    <div v-show="depth < 1 || expanded.includes(id)" class="Grid" :data-folderid="id">
      <grid
        v-for="child in sortedChildren"
        :id="child.id"
        :key="'node-' + child.id"
        :parents="parentTitles"
        :title="child.title"
        :url="child.url"
        :children="child.children"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script>
import {update} from '../ext/bookmarks.js';
import TreeFolder from './tree-folder.vue';

export default {
  // The name 'grid' here is being used in the template above to call this component recursively
  name: 'grid',
  props: {
    children: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
    },
    id: {
      type: String,
    },
    url: {
      type: String,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: [Number, String],
    },
    parents: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    TreeFolder,
  },
  data() {
    return {
      headingActive: false,
      linkActive: false,
      bookmarkTitle: this.title,
    };
  },

  computed: {
    sortedChildren() {
      const kids = [...this.children];

      return kids.sort((a, b) => {
        if (a.url && !b.url && (!a.children || !a.children.length)) {
          return -1;
        }
        if (b.url && !a.url && (!b.children || !b.children.length)) {
          return 1;
        }

        return a.index > b.index ? 1 : -1;
      });
    },
    hasChildLink() {
      return !!this.children.find(({url}) => url);
    },
    parentTitles() {
      return this.title ? [...this.parents, this.title] : this.parents;
    },
    titleLower() {
      return (this.title || '').toLowerCase();
    },
    searchFilter() {
      return this.$store.state.bookmarks.searchFilter;
    },
    expanded: {
      get() {
        return this.$store.state.bookmarks.expandedFolders;
      },
      set(value) {
        this.$store.commit('bookmarks/setStateAndStore', {
          name: 'expandedFolders',
          value,
        });
      },
    },
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
    toggleExpanded(id) {
      const index = this.expanded.indexOf(id);

      if (index !== -1) {
        this.expanded.splice(index, 1);
      } else {
        this.expanded.push(id);
      }

      this.$store.commit('bookmarks/setStateAndStore', {
        name: 'expandedFolders',
        value: this.expanded,
      });
    },
    openEditing() {
      this.$store.dispatch('bookmarks/getEditing', this.id);
    },
  },
};
</script>

<style lang="scss">
.Grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  /* margin-left: -10px; */
  margin-right: -10px;
}

.Level {
  & .Level {
    width: 100%;
    padding-left: 10px;
  }
}
.EditBtn {
  position: absolute;
  right: 2px;
  bottom: 2px;
  opacity: 0;
  padding: 4px !important;
  transition: opacity 0.4s;
}

.Hdg {
  position: relative;
  padding: 8px 0 4px;
  & input[type="text"] {
    height: 28px;
  }
}

.Hdg-toggleExpanded {
  position: absolute;
  top: 12px;
  left: -24px;
  padding: 0;
  width: 18px;
  height: 18px;
  line-height: 1;
  border-radius: 6px;
  font-size: 12px;
}

.Grid-cell {
  position: relative;
  flex-basis: 10em;
  flex-grow: 0;
  flex-shrink: 1;

  display: flex;
  justify-content: center;
  align-items: stretch;
  text-align: center;

  min-height: 100px;
  margin: 10px 5px;
  padding: 6px;
  border: 1px solid var(--layout-border-color);
  transform: scale(1);
  transition: transform 0.25s, box-shadow 0.25s;
  box-shadow: 0 0 0;

  &:hover {
    background-color: var(--main-bg-gradient);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    transform: scale(1.2);
    z-index: 2;
    .EditBtn {
      opacity: 1;
    }
  }
}
</style>
