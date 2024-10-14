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
        <i v-if="i < allLabels.length - 1" class="icon-arrow-right" />
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
      <el-popconfirm
        v-model="isConfirmDeleteVisible"
        @confirm="removeTree"
        @cancel="isConfirmDeleteVisible = false"
        title="Delete folder and all bookmarks within it?"
        confirm-button-text="Delete"
        confirm-button-type="danger"
        cancel-button-text="Cancel"
        icon-color="#F56C6C"
      >
        <!-- This button triggers the popconfirm -->
        <ntb-button
          slot="reference"
          @click.stop.prevent="isConfirmDeleteVisible = !isConfirmDeleteVisible"
          color="danger"
          size="mini"
          icon="delete"
          text="Delete"
        />
      </el-popconfirm>
    </ntb-button-group>
  </div>
</template>

<script>
import {update} from '../ext/bookmarks.js';
import NtbButton from '../components/ntb-button.vue';
import NtbButtonGroup from '../components/ntb-button-group.vue';

export default {
  components: {
    NtbButton,
    NtbButtonGroup,
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
      return this.parentTitle
        ? `${this.parentTitle} <i class="icon-arrow-right"></i>`
        : '';
    },
  },

  methods: {
    noop: (_) => _,
    logMe() {
      console.log('logging!');
    },
    async openDialog(action) {
      console.log({id: this.id, action});
      await this.$store.dispatch('bookmarks/getEditing', {id: this.id, action});
    },

    async changeFolder() {
      this.$store.commit('bookmarks/setState', {
        name: 'searchFilter',
        value: '',
      });

      await this.$store.dispatch('bookmarks/setCurrentFolderFromId', this.id);
      await this.$store.dispatch('bookmarks/getResults');
    },

    async removeTree() {
      this.isConfirmDeleteVisible = false;
      await this.$store.dispatch('bookmarks/removeTree', this.id);
      await this.$store.dispatch('bookmarks/getResults');
    },

    onShowConfirmDelete() {
      this.$refs.confirm.$el.focus();
    },
  },
};
</script>

<style lang="scss">
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
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  background-color: transparent;
}

.Folder-labelParent {
  color: var(--muted-color);
}

</style>
