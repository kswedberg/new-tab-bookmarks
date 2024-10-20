<template>
  <div>
    <div class="row StorageType">
      <h2>Chrome Sync</h2>
      <!-- active-value="sync"
      inactive-value="local"
      active-color="#13ce66"
      inactive-color="#aaa" -->
      <input
        v-model="storageType"
        id="settings-storage-sync"
        type="checkbox"
      >
      <label for="settings-storage-sync">Share settings across devices</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ntb-settings',
  computed: {

    storageType: {
      get() {
        return this.$store.state.settings.storageType === 'sync';
      },
      set(value) {
        const type = value ? 'sync' : 'local';

        this.$store.dispatch('settings/handleStorageType', type);
      },
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
