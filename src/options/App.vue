<template>
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

        <el-row>
          <h2>Shallow list of all {{ list.length }} bookmarks</h2>
          <el-input type="textarea" rows="10" :value="listString" />
        </el-row>

        <el-row>
          <h2>Broken bookmarks <span>({{brokenFiltered.length}})</span></h2>
          <form>
            <input
              @change="loadFile"
              type="file"
              accept="application/json"
              placeholder="Load a JSON file"
            >
          </form>
          <div v-if="brokenFiltered.length">
            <el-button
              @click="remove"
              type="danger"
              size="small"
              icon="el-icon-delete"
            >
              delete {{ brokenFiltered.length }} bookmarks
            </el-button>
          </div>
        </el-row>
        <el-row>
          <el-radio-group v-model="status">
            <el-radio-button label="all" />
            <el-radio-button v-for="stat in statuses" :key="stat" :label="stat">{{ stat }}</el-radio-button>
          </el-radio-group>
          <ul v-if="brokenFiltered.length">
            <li
              v-for="broke in brokenFiltered"
              :key="broke.id"
              :class="[toKeep.includes(broke.id) && 'keep']"
            >
              <el-button
                @click="remove(broke.id)"
                type="danger"
                size="small"
                icon="el-icon-delete"
              />
              <a :href="broke.url">
                {{ broke.title}}
              </a>
              <el-button
                @click="openEditing(broke.id)"
                icon="el-icon-edit"
                type="primary"
                class="EditBtn"
                size="mini"
                round
              />
              <el-button
                @click="keepId(broke.id)"
                icon="el-icon-check"
                size="mini"
                type="success"
                plain
                round
              />
            </li>
          </ul>
        </el-row>

        <EditDialog v-if="$store.state.bookmarks.editing" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getList} from '../ext/bookmarks.js';
import EditDialog from '../components/edit-dialog.vue';

export default {
  components: {
    EditDialog,
  },
  data: () => {
    return {
      list: [],
      listString: '',
      broken: [],
      toKeep: [],
      keep: new Set(),
      status: 'all',
      statuses: [],
      reader: {},
    };
  },
  computed: {
    listIds() {
      return new Set(this.list.map((b) => b.id));
    },
    borked() {
      // return this.broken;
      return this.broken.filter((b) => this.listIds.has(b.id));
    },
    brokenFiltered() {
      return !this.status || this.status === 'all' ? this.borked : this.borked.filter((b) => b.status === this.status);
    },
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

  async created() {
    await this.$store.dispatch('settings/initialize');
    await this.$store.dispatch('bookmarks/initialize');

    this.list = await getList();

    await this.$store.dispatch('settings/initialize');
    this.listString = JSON.stringify(this.list, null, 2);

    this.getStatuses();
  },

  mounted() {
    // on mounted, do something
    this.reader = new FileReader();
    this.reader.onload = (e) => {
      const data = JSON.parse(e.target.result);

      this.broken.push(...data);
      this.getStatuses();
    };
  },

  methods: {
    loadFile(event) {
      this.broken = [];

      [...event.target.files].forEach((item) => {
        this.reader.readAsText(item);
      });
    },

    keepId(id) {
      if (this.keep.has(id)) {
        this.keep.delete(id);
      } else {
        this.keep.add(id);
      }

      this.toKeep = this.keep.size ? Array.from(this.keep) : [];
    },

    openEditing(id) {
      this.$store.dispatch('bookmarks/getEditing', {id});
    },
    async remove(id) {

      if (typeof id === 'string' || typeof id === 'number') {
        await this.$store.dispatch('bookmarks/remove', `${id}`);
      } else {
        this.brokenFiltered.forEach(async(b) => {
          if (!this.keep.has(b.id)) {
            await this.$store.dispatch('bookmarks/remove', b.id);
          } else {
            console.log('keeping', b.id);
          }

        });
      }
      if (!this.brokenFiltered.length) {
        this.status = 'all';
      }

      this.list = await getList();
      this.getStatuses();
    },
    getStatuses() {
      const statuses = new Set();

      for (let item of this.borked) {
        statuses.add(item.status);
      }

      this.statuses = Array.from(statuses).sort();
    },
  },
};
</script>
<style>
.el-switch__label.is-active {
  color: #303133;
}
.keep {
  color: #55dd66;
  background-color: #efe;
  font-weight: bold;
}
</style>
