<template>
  <div>
    <div class="row StorageType">
      <h2>Chrome Sync</h2>
      <!-- active-value="sync"
      inactive-value="local"
      active-color="#13ce66"
      inactive-color="#aaa" -->
      <ntb-switch
        v-model="storageType"
        id="storage-switch"
        active-value="sync"
        inactive-value="local"
        active-color="#13ce66"
        inactive-color="#aaa"
        active-text="Share settings across devices"
      />
    </div>
  </div>
</template>

<script>
import NtbSwitch from '../components/ntb-switch.vue';

export default {
  name: 'ntb-settings',
  components: {
    NtbSwitch,
  },
  computed: {

    storageType: {
      get() {
        return this.$store.state.settings.storageType;
      },
      set(value) {
        this.$store.dispatch('settings/handleStorageType', value);
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
