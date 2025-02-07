<template lang="html">
  <div class="Folder">
    <button @click="changeFolder" class="Folder-label" type="button">
      <span
        v-for="(labelPart, i) in allLabels"
        :key="'label-' + i"
        :class="{'Folder-labelParent': i < allLabels.length - 1}"
      >
        {{ labelPart }}
        <!-- <span class="dim">({{ id }})</span> -->
        <ntb-icon v-if="i < allLabels.length - 1" icon="chevron-right" />
      </span>
    </button>
    <ntb-button-group class="ButtonGroup">
      <ntb-button
        @click="() => openDialog('update')"
        color="plain"
        size="mini"
        icon="edit"
        text="edit"
      />
      <ntb-button
        @click.stop="() => openDialog('create')"
        color="plain"
        size="mini"
        icon="plus"
        text="add"
      />
      <ntb-button
        @click.stop="() => openRemoveDialog()"
        color="danger"
        size="mini"
        text="delete"
        icon="delete"
      />
    </ntb-button-group>
  </div>
</template>

<script>
import NtbButton from '../components/ntb-button.vue';
import NtbButtonGroup from '../components/ntb-button-group.vue';
import NtbIcon from '../components/ntb-icon.vue';

export default {
  components: {
    NtbButton,
    NtbButtonGroup,
    NtbIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      default: '',
      type: String,
    },
    parents: {
      type: Array,
      default() {
        return [];
      },
    },
    parentTitles: {
      type: [String, Array],
      default: '',
    },
  },

  data() {
    return {
      editing: false,
      isConfirmDeleteVisible: false,
    };
  },
  computed: {
    did() {
      return `d-${this.id}`;
    },
    label() {
      return this.title || 'All Bookmarks';
    },
    allLabels() {
      return [...this.parents, this.label];
    },
    labelParent() {
      return this.parentTitle ?
        `${this.parentTitle} <i class="icon-arrow-right"></i>` :
        '';
    },
  },

  methods: {
    noop: (_) => _,
    logMe() {
      console.log('logging!');
    },
    async openDialog(action) {
      await this.$store.dispatch('bookmarks/getEditing', {id: this.id, action});
      const dialog = document.getElementById('edit-dialog');

      await this.$nextTick();
      dialog.showModal();
    },
    async openRemoveDialog() {
      const value = {id: this.id, action: 'removeTree', title: this.title};

      this.$store.commit('bookmarks/setState', {name: 'editing', value});
      const dialog = document.getElementById('remove-folder-dialog');

      await this.$nextTick();
      dialog.showModal();
    },
    async changeFolder() {
      this.$store.commit('bookmarks/setState', {
        name: 'searchFilter',
        value: '',
      });

      await this.$store.dispatch('bookmarks/setCurrentFolderFromId', this.id);
      await this.$store.dispatch('bookmarks/getResults');
    },

    // async removeTree() {
    //   this.isConfirmDeleteVisible = false;
    //   await this.$store.dispatch('bookmarks/removeTree', this.id);
    //   await this.$store.dispatch('bookmarks/getResults');
    // },

    onShowConfirmDelete() {
      this.$refs.confirm.$el.focus();
    },
  },
};
</script>

<style>
.Folder {
  position: relative;
  .ButtonGroup {
    opacity: 0;
  }
  &:hover {
    .ButtonGroup {
      opacity: 1;
    }
  }
  .ButtonGroup:focus-within {
    opacity: 1;
  }
}

.Folder-input {
  font-size: 1em;
  padding: 0 3px;
  height: 26px;
  line-height: 24px;
  min-width: 100px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}

.Folder-label {
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  height: 26px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  background-color: transparent;
}

.Folder-labelParent {
  display: inline-flex;
  align-items: center;
  color: var(--muted-color);
}

</style>
