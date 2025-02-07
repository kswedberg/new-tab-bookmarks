<template>
  <form
    @submit.prevent
    class="Header-form Form--inline"
  >
    <div class="search-form flex items-center">
      <div>
        <input
          v-model="searchFilter"
          type="search"
          name="keyword"
          autocorrect="off"
          autocomplete="off"
          placeholder="Filter..."
        >
      </div>
      <div>
        <div class="FilterScope toggle-checkbox">
          <span class="SwitchLabel">Scope:</span>
          <input
            v-model="searchAll"
            @change="updateFilter"
            id="search-all"
            type="checkbox"
            active-text=""
          >
          <label for="search-all">All Folders</label>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import {unserialize} from 'fmjs/url.js';

export default {
  data() {
    return {
      timer: 0,
      form: {},
    };
  },
  computed: {
    currentFolder() {
      return `"${this.$store.state.bookmarks.currentFolder.title}" Folder`;
    },
    searchAll: {
      get() {
        return this.$store.state.bookmarks.searchAll;
      },
      set(value) {
        this.$store.commit('bookmarks/setStateAndStore', {
          name: 'searchAll',
          value,
        });
      },
    },
    searchFilter: {
      get() {
        return this.$store.state.bookmarks.searchFilter;
      },
      set(value) {
        this.$store.commit('bookmarks/setState', {
          name: 'searchFilter',
          value,
        });
        this.updateFilter();
      },
    },
  },
  mounted() {
    const params = unserialize();

    if (params.keyword) {
      this.searchFilter = params.keyword;
    }
  },
  methods: {
    toggleScope() {
      if (this.searchFilter) {
        this.updateFilter();
      }
    },
    updateFilter() {
      clearTimeout(this.timer);
      if (this.searchFilter.length && this.searchFilter.length < 2) {
        return;
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('bookmarks/getResults');
      }, 100);
    },
  },
};
</script>

<style>
.FilterScope {
  .SwitchLabel {
    padding-right: 8px;
    color: #777;
  }
  .el-switch__label {
    white-space: nowrap;
  }
  .el-switch__label--right {
    margin-left: 4px;
  }
}
.Header-form {
  &,
  & .el-form-item {
    margin-bottom: 0;
  }
}
.search-form {
  gap: 12px;
}
</style>
