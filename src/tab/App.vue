<template>
  <div :class="['flex', 'flex-col', 'Page']">
    <svg-sprite />
    <header class="Header flex">
      <div class="Header-menu" :class="{'is-closed': asideClosed}">
        <ntb-button
          @click="toggleAside"
          :icon="asideClosed ? 'settings' : 'close-circle'"
          :text="asideClosed ? 'Settings' : 'Close settings'"
        />
      </div>
      <SearchFilter />
    </header>

    <div class="Page-body flex">
      <PageAside
        @update="onAsideUpdate"
        :asideClosed="asideClosed"
        :showDupes="showDupes"
      />

      <main class="Main el-main">
        <NtbDupes v-if="showDupes" @refresh="refreshDupes" :dupes="dupes" />

        <div v-else-if="results.length" id="bookmarks" class="Hdg Bookmarks">
          <h3>{{ mainTitle }} </h3>
          <button @click="expandAll" class="Hdg-toggleExpanded" type="button">
            {{ expanded.length ? '-' : '+' }}
            <span class="sr-only">{{ expanded.length ? 'collapse' : 'expand' }}</span>
          </button>
          <div v-if="layout === 'tree'" class="Tree">
            <!--
                Add bosket here:
                https://elbywan.github.io/bosket/vue/index.html
              -->
          </div>
          <div v-else>
            <ntb-grid
              :filter="filter"
              :depth="0"
              :children="results[0].children"
            />
          </div>
        </div>
        <EditDialog />
        <RemoveFolderDialog />
      </main>
    </div>
  </div>
</template>
<script>
import {findDupes, removeMany} from '../ext/bookmarks.js';
import {syncStore} from '../ext/storage.js';
import PageAside from './aside.vue';
// import TreeFolder from '../components/tree-folder.vue';
import NtbGrid from '../components/ntb-grid.vue';
import NtbDupes from '../components/dupes.vue';
import SearchFilter from '../components/search-filter.vue';
import EditDialog from '../components/edit-dialog.vue';
import RemoveFolderDialog from '../components/remove-folder-dialog.vue';
import SvgSprite from '../components/svg-sprite.vue';
import NtbButton from '../components/ntb-button.vue';

export default {
  components: {
    NtbButton,
    PageAside,
    NtbGrid,
    NtbDupes,
    // TreeFolder,
    SearchFilter,
    EditDialog,
    RemoveFolderDialog,
    SvgSprite,
  },
  data: () => {
    return {
      folders: [],
      filters: {
        id: '',
        keyword: '',
      },
      dialogMsg: '',
      allExpanded: false,
      dialogVisible: false,
      checkedNodes: [{}],
      dupes: [],
      showDupes: false,
    };
  },
  computed: {
    results() {
      return this.$store.state.bookmarks.results || [];
    },
    searchFilter() {
      return this.$store.state.bookmarks.searchFilter;
    },

    mainTitle() {
      return this.searchFilter ? `Filter: ${this.searchFilter}` : this.results[0] && this.results[0].title;
    },
    expandCollapseIcon() {
      return this.bookmarkSettings.folders.length === this.expanded.length
        ? 'icon-minus'
        : 'icon-plus';
    },
    bookmarkSettings() {
      return this.$store.state.bookmarks;
    },
    folderId() {
      return this.searchAll
        ? '0'
        : this.$store.state.bookmarks.currentFolder.id;
    },
    layout() {
      return this.$store.state.settings.layout;
    },
    filter() {
      return this.filters.keyword.toLowerCase();
    },
    asideClosed: {
      get() {
        return this.$store.state.bookmarks.asideClosed;
      },
      set(value) {
        this.$store.commit('bookmarks/setStateAndStore', {
          name: 'asideClosed',
          value,
        });
      },
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

  async created() {
    await this.$store.dispatch('settings/initialize');
    await this.$store.dispatch('bookmarks/initialize');
  },

  methods: {
    logMe() {
      console.log('AAAAAAA');
    },
    toggleDupes() {
      this.showDupes = !this.showDupes;

      if (this.showDupes) {
        this.refreshDupes();
      }
    },
    async refreshDupes() {
      this.dupes = await findDupes();
    },
    closeDialog(a) {
      if (a.type && this.checkedNodes.length) {
        removeMany(this.checkedNodes).then(() => {
          return this.$store.dispatch('bookmarks/getResults');
        });
      }
      this.dialogVisible = false;
    },
    openDelete() {
      this.checkedNodes = this.$refs.tree.getCheckedNodes().map((item) => {
        return item.id;
      });

      this.dialogMsg = 'Are you sure you want to delete the checked item';
      this.dialogMsg += this.checkedNodes.length === 1 ? '?' : 's?';
      this.dialogVisible = true;
    },
    expandAll() {
      const {folders} = this.$store.state.bookmarks;

      this.expanded =
        folders.length === this.expanded.length
          ? []
          : folders.map((item) => item.id);
    },
    // onExpandFolder({id}) {
    //   this.expanded.push(id);
    //   this.$store.commit('bookmarks/setStateAndStore', {
    //     name: 'expandedFolders',
    //     value: this.expanded,
    //   });
    // },
    // onCollapseFolder({id}) {
    //   this.expanded = this.expanded.filter((item) => `${item}` !== `${id}`);
    //   this.$store.commit('bookmarks/setStateAndStore', {
    //     name: 'expandedFolders',
    //     value: this.expanded,
    //   });
    // },

    onAsideUpdate(meth, arg) {
      this[meth](arg);
    },
    toggleAside() {
      this.asideClosed = !this.asideClosed;
    },
    openOptions() {
      this.$browser.runtime.openOptionsPage();
    },
    setDefault() {
      this.defaultFolder = Object.assign({}, this.currentFolder);

      syncStore.set({defaultFolder: this.defaultFolder});
    },
    resetDefault() {
      const value = Object.assign(
        {},
        this.$store.state.bookmarks.defaultFolder
      );

      this.$store.commit('bookmarks/setStateAndStore', {
        name: 'currentFolder',
        value,
      });

      this.$store.dispatch('bookmarks/getResults');
    },
  },
};
</script>
<style>
/* General CSS */

.Bookmarks {
  h3 {
    margin-top: 4px;
  }
  max-width: 1000px;
}
.el-select-dropdown__item span {
  white-space: pre;
}

.FolderButtons {
  height: 10px;
}

.is-textHidden span,
.is-visuallyHidden {
  position: absolute;
  margin: 0 !important;
  padding: 0 !important;
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 1px;
  clip: rect(0, 0, 0, 0);
}

.Header {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  align-items: center;
  height: 60px;
  background-color: var(--aside-bg);
}

.Header-menu {
  width: 240px;
  padding: 9px 20px 10px 10px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  transition: var(--aside-transition);
  transform: translate3d(0, 0, 0);
  background-color: var(--header-menu-bg);
  border-right: 1px solid var(--layout-border-color);

  &.is-closed {
    /* transform: translate3d(-190px, 0, 0); */
    width: var(--collapsed-width) !important;
  }
}

.Header-form {
  padding-inline: 10px;
}

.Page-body {
  padding-top: 60px;
}
.Form--inline {
  display: inline-block;
}
</style>
