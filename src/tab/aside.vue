<template>
  <aside class="Aside" :class="{'is-closed': asideClosed}">
    <section class="Aside-content">
      <div class="Aside-row">
        <form @submit.prevent class="Form Form--inline">
          <div :class="['form-item', 'is-visuallyHidden' && asideClosed]">
            <h2>Default Folder</h2>
            <select
              v-model="currentFolder.id"
              @change="folderChanged"
            >
              <option
                v-for="item in foldersWithText"
                :key="item.id + item.text"
                name="change-folder"
                :label="item.text"
                :value="item.id"
              />
            </select>
          </div>
        </form>
      </div>
      <div class="Aside-row" :class="{'is-transparent': foldersMatch}">
        <ntb-button
          @click="$emit('update', 'resetDefault')"
          id="view-default"
          :title="defaultFolder.text ? `Reset folder to ${defaultFolder.text.trim()}` : ''"
          :disabled="foldersMatch"
          :class="{'is-textHidden': asideClosed}"
          icon="back"
        >
          Reset to "{{ defaultFolder.text | trim }}"
        </ntb-button>
      </div>
      <div class="Aside-row" :class="{'is-transparent': foldersMatch}">
        <ntb-button
          @click="setDefaultToCurrent"
          id="view-save-default"
          :title="currentFolder && currentFolder.text ? `Set ${currentFolder.text.trim()} as default folder` : ''"
          :disabled="foldersMatch"
          :class="{'is-textHidden': asideClosed}"
          icon="check"
        >
          Set "{{ currentFolder.text | trim }}" as default
        </ntb-button>
      </div>
      <div v-show="!asideClosed" class="Aside-row">
        <Settings />
      </div>
      <div v-show="!asideClosed" class="Aside-row">
        <ntb-button
          @click="$emit('update', 'toggleDupes')"
          id="show-dupes"
          icon="scissors"
        >
          {{ showDupes ? `Hide dupes` : 'Show dupes' }}
        </ntb-button>
      </div>
      <div v-show="!asideClosed" class="Aside-row">
        <a href="../options/options.html">more...</a>
      </div>
    </section>
  </aside>
</template>

<script>
import Settings from '../components/settings.vue';
import NtbButton from '../components/ntb-button.vue';

export default {
  name: 'ntb-aside',
  components: {
    Settings,
    NtbButton,
  },
  props: {
    asideClosed: Boolean,
    showDupes: Boolean,
  },
  computed: {
    folders() {
      return this.$store.state.bookmarks.folders;
    },
    foldersWithText() {
      // eslint-disable-next-line eqeqeq
      return this.folders.filter((item) => item.text != 0);
    },
    foldersMatch() {
      return this.$store.getters['bookmarks/foldersMatch'];
    },
    defaultFolder: {
      get() {
        return this.$store.state.bookmarks.defaultFolder;
      },
      set(value) {
        const {id, title, text} = value;

        this.$store.commit('bookmarks/setStateAndStore', {
          name: 'defaultFolder',
          value: {id, title, text},
        });
      },
    },
    currentFolder() {
      return this.$store.state.bookmarks.currentFolder || {};
    },
    // currentFolder: {
    //   get() {
    //     return this.$store.state.bookmarks.currentFolder;
    //   },
    //   set(value) {
    //     const {id, title, text} = value;

    //     this.$store.commit('bookmarks/setStateAndStore', {
    //       name: 'currentFolder',
    //       value: {id, title, text},
    //     });
    //   },
    // },
  },

  methods: {
    setDefaultToCurrent() {
      this.defaultFolder = Object.assign({}, this.currentFolder);
    },

    folderChanged(event) {
      // console.log(event.target.value);
      this.$store.dispatch('bookmarks/setCurrentFolderFromId', event.target.value)
      .then(() => {
        this.$store.dispatch('bookmarks/getResults');
      });
    },
  },
};
</script>

<style lang="scss">
h2 {
  font-size: 18px;
}
.Aside {
  position: sticky;
  top: 28px;
  width: 240px;
  flex-grow: 0;
  background-color: var(--aside-bg);
  border-right: 1px solid var(--layout-border-color);
  flex-shrink: 0;
  transition: var(--aside-transition);
  transform: translate3d(0, 0, 0);
  overflow-x: hidden;
  padding-top: 20px;
  max-height: calc(100vh - 120px);
  & > * {
    opacity: 1;
    transition: opacity 0.3s;
  }

  &.is-closed {
    /* transform: translate3d(-190px, 0, 0); */
    width: var(--collapsed-width) !important;
  }
}

.Aside-content {
  padding-inline: 20px;
}
.Aside-row {
  margin-bottom: 20px;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s;

  &.is-transparent {
    opacity: 0;
    visibility: hidden;
  }
}

.Aside-footer {
  overflow: hidden;
  padding: 10px 10px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 240px;
  background-color: var(--aside-bg);
  border: 1px solid var(--layout-border-color);
  border-width: 1px 1px 0 0;
  transition: var(--aside-transition);
  &.is-closed {
    /* transform: translate3d(-190px, 0, 0); */
    width: var(--collapsed-width) !important;
  }
}
</style>
