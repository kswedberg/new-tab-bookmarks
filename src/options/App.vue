<template>
  <div :class="['flex flex-col Page']">
    <header class="Header Header--settings flex">
      <h1>New Tab Settings</h1>
    </header>
    <div class="Page-body Page-body--options">
      <main class="Main">
        <div class="row StorageType">
          <h2>Chrome Sync</h2>
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

        <div class="row">
          <h2>Shallow list of all {{ list.length }} bookmarks</h2>
          <el-input type="textarea" rows="10" :value="listString" />
        </div>

        <div class="row">
          <h2>Broken bookmarks <span>({{brokenFiltered.length}})</span></h2>
          <form>
            <input
              @change="loadFile"
              type="file"
              accept="application/json"
              placeholder="Load a JSON file"
            >
          </form>
        </div>
        <div class="row">
          <div v-if="brokenFiltered.length">
            <ntb-button
              @click="remove"
              type="danger"
              size="small"
              icon="delete"
            >
              delete {{ numberToRemove }} bookmarks
            </ntb-button>
          </div>
        </div>
        <div class="row">
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
              <ntb-button
                @click="remove(broke.id)"
                type="danger"
                size="small"
                icon="delete"
              />
              <a :href="broke.url">
                {{ broke.title}}
              </a>
              <ntb-button
                @click="openEditing(broke.id)"
                icon="edit"
                type="primary"
                class="EditBtn"
                size="mini"
                round
              />
              <ntb-button
                @click="keepId(broke.id)"
                icon="check"
                size="mini"
                type="success"
                plain
                round
              />
            </li>
          </ul>
        </div>

        <EditDialog v-if="$store.state.bookmarks.editing" />
      </main>
    </div>
  </div>
</template>

<script>
import {getList} from '../ext/bookmarks.js';
import EditDialog from '../components/edit-dialog.vue';
import NtbButton from '../components/ntb-button.vue';
import NtbSwitch from '../components/ntb-switch.vue';

export default {
  components: {
    EditDialog,
    NtbButton,
    NtbSwitch,
  },
  data: () => {
    return {
      list: [],
      listString: '',
      broken: [],
      keepSet: new Set(),
      status: 'all',
      statuses: [],
      reader: {},
      test: 'local',
    };
  },
  computed: {
    toKeep: {
      get() {
        return this.$store.state.settings.brokenKeepers || [];
      },
      set(value) {
        this.$store.commit('settings/setStateAndStore', {name: 'brokenKeepers', value});
      },
    },
    numberToRemove() {
      return this.brokenFiltered.filter(({id}) => !this.toKeep.includes(id)).length;
    },

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
    this.reader = new FileReader();
    this.reader.onload = (e) => {
      const data = JSON.parse(e.target.result);

      this.broken.push(...data);
      this.getStatuses();
      this.keepSet = new Set(this.toKeep);

      console.log(this.toKeep.length, this.keepSet.size);
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
      if (this.keepSet.has(id)) {
        this.keepSet.delete(id);
      } else {
        this.keepSet.add(id);
      }

      this.toKeep = this.keepSet.size ? Array.from(this.keepSet) : [];
    },

    openEditing(id) {
      this.$store.dispatch('bookmarks/getEditing', {id});
    },
    async remove(id) {

      if (typeof id === 'string' || typeof id === 'number') {
        await this.$store.dispatch('bookmarks/remove', `${id}`);
      } else {
        this.brokenFiltered.forEach(async(b) => {
          if (!this.keepSet.has(b.id)) {
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
.Header--settings {
  padding-left: 32px;
}
.Page-body--options .Main {
  padding: 32px;
}
</style>
