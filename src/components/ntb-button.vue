<template>
  <button @click="handleClick" :type="type" :class="classes">
    <NtbIcon v-if="icon" :icon="icon" :size="size" />
    <span v-if="text" class="sr-only">{{ text }}</span>
    <slot />
  </button>
</template>

<script>
import NtbIcon from './ntb-icon.vue';

export default {
  name: 'ntb-button',
  components: {
    NtbIcon,
  },
  props: {
    type: {
      type: String,
      default: 'button',
    },
    icon: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'md',
    },
    color: {
      type: String,
      default: 'plain',
    },
    round: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: null,
    },
  },
  computed: {
    classes() {
      const cls = ['ntb-button', `ntb-button--${this.color}`, `ntb-button--${this.size}`, this.round && 'ntb-button--round'];

      return cls;
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
<style lang="scss">
.ntb-button {
  appearance: none;
  display: inline-flex;
  gap: 4px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: var(--main-bg-gradient);
  border: 1px solid var(--item-border-color);
  color: var(--text-color);

  text-align: center;
  outline: none;
  margin: 0;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;

  &:hover,
  &:focus-visible {
    color: var(--text-emphasis);
    background-color: var(--hover-bg);
  }
  & svg {
    display: block;
  }
}

.ntb-button--mini {
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
}

.ntb-button.ntb-button--danger {
  color: #fff;
  background-color: var(--danger);
  border-color: var(--danger);

  &:hover,
  &:focus-visible {
    background-color: var(--danger-hover);
  }
}
.ntb-button--primary {
  color: #fff;
  background-color: var(--primary);
  border-color: var(--primary);
  &:hover,
  &:focus-visible {
    background-color: var(--primary-hover);
    color: #fff;
  }
}
.ntb-button--info {
  color: #232d3d;
  background-color: var(--info);
  border-color: #909399var(--info);
}
.ntb-button--round {
  border-radius: 50%;
  padding: 12px;
}
</style>
