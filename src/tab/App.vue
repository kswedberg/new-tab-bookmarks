<template lang="html">
  <el-container :class="['Page', 'Page--' + theme]">
    <el-header height="60px" class="Header">
      <div class="Header-menu" :class="{'is-closed': asideClosed}">
        <el-button @click="toggleAside" :icon="asideClosed ? 'el-icon-setting' : 'el-icon-circle-close'" />
      </div>
      <SearchFilter />
    </el-header>

    <el-container>
      <PageAside
        @update="onAsideUpdate"
        :asideClosed="asideClosed"
        :showDupes="showDupes"
      />

      <el-container class="Main">
        <el-main>
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
          <EditDialog v-if="$store.state.bookmarks.editing" />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
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

export default {
  components: {
    PageAside,
    NtbGrid,
    NtbDupes,
    // TreeFolder,
    SearchFilter,
    EditDialog,
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
        ? 'el-icon-minus'
        : 'el-icon-plus';
    },
    bookmarkSettings() {
      return this.$store.state.bookmarks;
    },
    folderId() {
      return this.searchAll
        ? '0'
        : this.$store.state.bookmarks.currentFolder.id;
    },
    theme() {
      return this.$store.state.settings.theme;
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
<style lang="scss">
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
  padding: 0;
}

.Header-menu {
  width: 240px;
  padding: 10px 20px 9px 10px;
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
  padding: 10px 20px;
}
.Form--inline {
  display: inline-block;
}
</style>
