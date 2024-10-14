<template>
  <div class="inline-flex items-center ntb-button-group">
    <slot />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
.ntb-button-group {
  border-radius: 4px;
  overflow:hidden;
  border: 1px solid var(--button-border-color);
  gap: 1px;
}
// .ntb-button-group:has(.ntb-button--mini) {
//   border-radius: 3px;
// }

.ntb-button-group button {
  border-radius: 0;
  border-width: 0;
}
.ntb-button-group > button:first-child,
.ntb-button-group > *:first-child button {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.ntb-button-group > button:last-child,
.ntb-button-group > *:last-child button {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
</style>
