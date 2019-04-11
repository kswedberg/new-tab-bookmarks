<template lang="html">
  <el-container :class="['Page', 'Page--' + theme]">
    <el-header height="60px" class="Header">
      <h1>New Tab Settings</h1>
    </el-header>
    <el-container>
      <el-main>
        <el-row class="StorageType">
          <h2>Chrome Sync</h2>
          <el-switch
            v-model="storageType"
            active-value="sync"
            inactive-value="local"
            active-color="#13ce66"
            inactive-color="#aaa"
            active-text="Share settings across devices"
          />
        </el-row>
        <el-row>
          <h2>Theme</h2>
          <el-radio-group v-model="theme">
            <el-radio-button label="light">Light</el-radio-button>
            <el-radio-button label="dark">Dark</el-radio-button>
          </el-radio-group>
        </el-row>

        <!-- <el-row>
          <h2>Layout</h2>
          <el-radio-group v-model="layout">
            <el-radio-button label="grid">Grid</el-radio-button>
            <el-radio-button label="tree">Tree</el-radio-button>
          </el-radio-group>
        </el-row> -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data: () => {
    return {};
  },
  computed: {
    theme: {
      get() {
        return this.$store.state.settings.theme;
      },
      set(value) {
        this.$store.commit('settings/setStateAndStore', {
          name: 'theme',
          value,
        });
      },
    },
    layout: {
      get() {
        return this.$store.state.settings.layout;
      },
      set(value) {
        this.$store.commit('settings/setStateAndStore', {
          name: 'layout',
          value,
        });
      },
    },
    storageType: {
      get() {
        return this.$store.state.settings.storageType;
      },
      set(value) {
        this.$store.dispatch('settings/handleStorageType', value);
      },
    },
  },
  created() {
    this.$store.dispatch('settings/initialize');
  },
  mounted() {
    // on mounted, do something
  },
  methods: {},
};
</script>
<style>
.el-switch__label.is-active {
  color: #303133;
}
</style>
