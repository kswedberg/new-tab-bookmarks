<template>
  <el-form
    :inline="true"
    :model="form"
    class="Header-form Form--inline"
  >
    <el-row :gutter="10">
      <el-col :span="12">
        <el-input
          v-model="searchFilter"
          clearable
          prefix-icon="el-icon-search"
          placeholder="Filter…"
        />
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-switch
            v-model="searchAll"
            @change="updateFilter"
            :disabled="!searchFilter"
          />
          Include all
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      timer: 0,
      form: {},
      keyword: '',
    };
  },
  computed: {
    searchAll: {
      get() {
        return this.$store.state.bookmarks.searchAll;
      },
      set(value) {
        this.$store.commit('bookmarks/setState', {name: 'searchAll', value});
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
  methods: {
    updateFilter() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch('bookmarks/getResults');
      }, 100);
    },
  },
};
</script>

<style lang="postcss">
.Header-form {
  &,
  & .el-row,
  & .el-form-item {
    margin-bottom: 0;
  }
}
</style>
