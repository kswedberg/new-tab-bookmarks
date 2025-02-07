<template lang="html">
  <!--
  **** This is a recursive component.
  -->

  <!-- Bookmark -->
  <div v-if="url && (!children || !children.length)" class="Grid-cell">
    <div class="Grid-cellItem">
      <ntb-button
        @click="openEditing"
        icon="edit"
        color="primary"
        class="EditBtn"
        size="mini"
        aria-label="edit"
        round
      />
      <a
        v-if="url"
        :href="url"
      >
        <img
          v-if="imgLoaded"
          class="favicon"
          :src="imgUrl"
          alt="favicon"
        >
        {{ title }}
      </a>
    </div>
  </div>

  <div
    v-else
    :class="'Level Level--' + depth"
  >
    <div
      v-if="id"
      class="Hdg"
      slot="header"
    >
      <TreeFolder
        :id="id"
        :parents="parents"
        :title="title"
      />
      <button @click="toggleExpanded(id)" class="Hdg-toggleExpanded" type="button">
        {{ expanded.includes(id) ? '-' : '+' }}
        <span class="sr-only">{{ expanded.includes(id) ? 'collapse' : 'expand' }}</span>
      </button>
    </div>
    <VDraggable
      v-if="children && children.length"
      v-show="depth < 1 || expanded.includes(id)"
      @end="onDragEnd"
      class="Grid"
      :data-folderid="id"
    >
      <ntb-grid
        v-for="child in sortedChildren"
        :id="child.id"
        :key="'node-' + child.id"
        :parents="parentTitles"
        :title="child.title"
        :url="child.url"
        :children="child.children"
        :depth="depth + 1"
      />
    </VDraggable>
  </div>
</template>

<script>
import {update} from '../ext/bookmarks.js';
import TreeFolder from './tree-folder.vue';
import VDraggable from 'vuedraggable';
import NtbButton from './ntb-button.vue';

export default {
  // The name 'ntb-grid' here is being used in the template above to call this component recursively
  name: 'ntb-grid',
  components: {
    TreeFolder,
    VDraggable,
    NtbButton,
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
    hidden: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: [Number, String],
      required: true,
    },
    parents: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      headingActive: false,
      linkActive: false,
      bookmarkTitle: this.title,
      moving: {},
      img: null,
      imgLoaded: false,
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
    imgUrl() {
      return `chrome://favicon/${this.url.replace(/^(https?:\/\/[^/]+)\/.*/, '$1')}`;
    },
  },

  beforeMount() {
    this.img = new Image();
    this.img.addEventListener('load', this.onImgLoaded, false);
    this.img.src = this.imgUrl;
    // this.sortedChildren = this.sortChildren();
  },
  beforeDestroy() {
    this.img.removeEventListener('load', this.onImgLoaded, false);
    this.img = null;
  },
  methods: {
    onImgLoaded() {
      this.imgLoaded = true;
    },
    sortChildren() {
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
    async openEditing() {
      this.$store.dispatch('bookmarks/getEditing', {id: this.id});
      const dialog = document.getElementById('edit-dialog');

      await this.$nextTick();
      dialog.showModal();
    },

    async onDragEnd(event) {
      const {oldIndex, newIndex} = event;
      const {id, parentId, title} = this.sortedChildren[oldIndex];
      const spliceIndex = this.sortedChildren[newIndex].index;
      const index = newIndex > oldIndex ? spliceIndex + 1 : spliceIndex;

      await this.$store.dispatch('bookmarks/move', {id, parentId, index});
    },
  },
};
</script>

<style>
.Grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  /* margin-left: -10px; */
  gap: 10px;
  font-size: 14px;
}

.Level {
  & .Level {
    width: 100%;
    padding-left: 10px;
  }
}

.favicon {
  float: left;
  margin-right: 6px;
  margin-top: -3px;
  width: 16px;
  height: 16px;
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
  border-radius: 3px;
  border: 1px solid var(--layout-border-color);

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

  min-height: calc(4lh + 11px);

  .Grid-cellItem {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    min-width: 100%;
    padding: 6px;
    border-radius: 4px;
    background-color: var(--item-bg);
    border: 1px solid var(--item-border-color);
    transform: scale(1);
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: none;
    word-break: break-word;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    /** unprefixed line-clamp not supported as of 2020-01-09 by any browsers.
    * but when it is, it might fix buggy behavior of -webkit-line-clamp (or at least obviate the need for display/-webkit-box-orient?)
    */
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
  }

  &:hover {
    background-color: var(--main-bg-gradient);
    z-index: 2;
    /* min-height: 100px; */
    .Grid-cellItem {
      min-height: 100%;
      height: auto;
      background-color: var(--main-bg-gradient);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      transform: scale(1.2);

      -webkit-line-clamp: unset;
      line-clamp: unset;
    }

    .EditBtn {
      opacity: 1;
    }
  }
  .EditBtn:focus-visible {
    opacity: 1;
    border: 1px solid var(--layout-border-color);
  }
}
</style>
