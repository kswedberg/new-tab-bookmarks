<template>
  <svg :width="dimensions" :height="dimensions" :class="`icon-${icon}`">
    <use :href="`#${icon}`" />
  </svg>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
  },
  computed: {
    dimensions() {
      return this.size === 'mini' ? '12' : '16';
    },
  },
};
</script>
