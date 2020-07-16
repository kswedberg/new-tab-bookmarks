<template>
  <el-form
    @submit.native.prevent
    :inline="true"
    :model="form"
    class="Header-form Form--inline"
  >
    <el-row :gutter="10">
      <el-col :span="12">
        <el-input
          v-model="searchFilter"
          clearable
          name="keyword"
          prefix-icon="el-icon-search"
          placeholder="Filter…"
        />
      </el-col>
      <el-col :span="12">
        <el-form-item class="FilterScope">
          <span class="SwitchLabel">Scope:</span>
          <el-switch
            v-model="searchAll"
            @change="updateFilter"
            active-text="All Folders"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
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

<style lang="scss">
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
  & .el-row,
  & .el-form-item {
    margin-bottom: 0;
  }
}
</style>
