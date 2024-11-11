<template>
  <dialog id="remove-folder-dialog" ref="removedialog" class="dialog">
    <p>
      Are you sure you want to remove the folder, <strong>{{ $store.state.bookmarks.editing?.title }}</strong> and all of its bookmarks?
    </p>

    <div class="action-row">
      <ntb-button @click="cancel">Cancel</ntb-button>
      <ntb-button
        @click="remove"
        class="del"
        color="danger"
      >
        Delete
      </ntb-button>
    </div>
  </dialog>
</template>

<script>
import NtbButton from './ntb-button.vue';

export default {
  components: {
    NtbButton,
  },
  methods: {
    cancel() {
      this.$refs.removedialog.close();
    },
    remove() {
      console.log(this.$store.state.bookmarks.editing);
      if (this.$store.state.bookmarks.editing?.action === 'removeTree') {
        this.$store.dispatch('bookmarks/removeTree', this.$store.state.bookmarks.editing.id);
      }
      this.$refs.removedialog.close();
    },
  },
};
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
