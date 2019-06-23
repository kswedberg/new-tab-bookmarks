<template lang="html">
  <el-aside width="240px" class="Aside" :class="{'is-closed': asideClosed}">
    <el-container>
      <div class="Aside-content">
        <div class="Aside-row">
          <el-form class="Form Form--inline">
            <el-form-item :class="{'is-visuallyHidden': asideClosed}">
              <h2>Default Folder</h2>
              <el-select
                v-model="currentFolder.id"
                @change="folderChanged"
                clearable
                :filterable="true"
                placeholder="folder…"
                no-match-text="no matches found"
                no-data-text="no data"
              >
                <el-option
                  v-for="item in foldersWithText"
                  :key="item.id + item.text"
                  name="change-folder"
                  :label="item.text"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="Aside-row" :class="{'is-transparent': foldersMatch}">
          <el-button
            @click="$emit('update', 'resetDefault')"
            id="view-default"
            :title="defaultFolder.text ? `Reset folder to ${defaultFolder.text.trim()}` : ''"
            :disabled="foldersMatch"
            :class="{'is-textHidden': asideClosed}"
            icon="el-icon-back"
          >
            Reset to "{{ defaultFolder.text | trim }}"
          </el-button>
        </div>
        <div class="Aside-row" :class="{'is-transparent': foldersMatch}">
          <el-button
            @click="setDefaultToCurrent"
            id="view-save-default"
            :title="currentFolder && currentFolder.text ? `Set ${currentFolder.text.trim()} as default folder` : ''"
            :disabled="foldersMatch"
            :class="{'is-textHidden': asideClosed}"
            icon="el-icon-check"
          >
            Set "{{ currentFolder.text | trim }}" as default
          </el-button>
        </div>
        <div v-show="!asideClosed" class="Aside-row">
          <Settings />
        </div>
      </div>
    </el-container>
  </el-aside>
</template>

<script>
import Settings from '../../components/settings.vue';
export default {
  components: {
    Settings,
  },
  props: {
    asideClosed: Boolean,
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
      return this.$store.state.bookmarks.currentFolder;
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

    folderChanged(id) {
      this.$store.dispatch('bookmarks/setCurrentFolderFromId', id)
      .then(() => {
        this.$store.dispatch('bookmarks/getResults');
      });
    },
  },
};
</script>

<style lang="postcss">
h2 {
  font-size: 18px;
}
.Aside {
  background-color: var(--aside-bg);
  border-right: 1px solid var(--layout-border-color);
  display: flex;
  transition: var(--aside-transition);
  transform: translate3d(0, 0, 0);
  overflow-x: hidden;
  padding-left: 10px;
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
