<template>
  <div class="dupes-container">
    <h2>Dupes</h2>
    <div v-for="dupe in dupes" class="dupe-group" :key="dupe.id">
      <h3>{{ dupe.items[0].title }}</h3>
      <div class="flex dupe-items">
        <div
          v-for="(item, i) in dupe.items"
          :key="item.id"
          :style="{
            flexBasis: `${Math.max(100 / dupe.items.length, 25)}%`,
          }"
          :data-span="Math.max(24 / dupe.items.length, 6)"
        >
          <div class="parent-tree">{{ item.parentTree }}</div>
          <div
            :class="[i && item.title !== dupe.items[i-1].title && 'alert']"
          >
            <ntb-button
              @click="() => remove(item.id)"
              color="danger"
              size="mini"
              icon="delete"
              aria-label="delete"
            />
            {{ item.title }}
          </div>
          <div>
            <a :class="[i && item.url !== dupe.items[i-1].url && 'alert']" :href="item.url">{{ item.url }}</a>
          </div>
          <div>{{ new Date(item.dateAdded).toLocaleDateString()}}</div>
        </div>
      </div>
      <div>
        <div />
      </div>
    </div>
  </div>
</template>

<script>
import {remove} from '../ext/bookmarks';

export default {
  name: 'ntb-dupes',
  props: {
    dupes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    async remove(id) {
      await remove(id);
      this.$emit('refresh');
    },
  },
};
</script>

<style scoped>
.dupes-container {
  margin-left: -12px;
}
.dupe-group {
  padding: 10px;
  margin-inline: -10px;
  &:nth-child(even) {
    background-color: var(--aside-bg);
  }
}
.dupe-items {
  gap: 20px;

  & > div {
    flex-grow: 0;
  }

  a {
    line-break: anywhere;
  }
}
.alert {
  color: #c33;
}
</style>
