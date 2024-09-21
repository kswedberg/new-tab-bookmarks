<template>
  <div>
    <div class="row StorageType">
      <h2>Chrome Sync</h2>
      <el-switch
        v-model="storageType"
        active-value="sync"
        inactive-value="local"
        active-color="#13ce66"
        inactive-color="#aaa"
        active-text="Share settings across devices"
      />
    </div>
    <div class="row">
      <h2>Theme</h2>
      <el-radio-group v-model="theme">
        <el-radio-button label="light">Light</el-radio-button>
        <el-radio-button label="dark">Dark</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ntb-settings',
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
    storageType: {
      get() {
        return this.$store.state.settings.storageType;
      },
      set(value) {
        this.$store.dispatch('settings/handleStorageType', value);
      },
    },
  },
  watch: {
    theme(newValue) {
      console.log(newValue);
      this.bodyClass(newValue);
    },
  },
  methods: {
    bodyClass(theme) {
      let className = document.body.className.replace(/\s*Page--\w+\s*/, '');

      className += ` Page--${theme}`;
      document.body.className = className;
    },
  },
};
</script>

<style lang="scss">
.Aside {
  .el-switch__label.is-active {
    color: var(--text-color);
  }
}
</style>
