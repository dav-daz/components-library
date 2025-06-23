<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  display: {
    type: String,
    default: 'block',
  },
  margin: {
    type: String,
    default: '0',
  },
  position: {
    type: String,
    default: 'before',
  },
  size: {
    type: String,
    default: 'var(--fs-medium)',
  },
})

const iconDisplay = computed(() => props.display)
const iconMargin = computed(() => props.margin)
const iconSize = computed(() => props.size)
</script>

<template>
  <span :class="[`i-${icon}`, `i-${position}`]" aria-hidden="true"></span>
</template>

<style lang="scss" scoped>
span {
  @extend %icon;
  display: v-bind(iconDisplay);
  font-size: v-bind(iconSize);
  transition: $t-transform;
}

@each $key, $value in $icon-set {
  .#{$key}::before {
    content: var(--#{$key});
  }
}

.i-before {
  margin-right: v-bind(iconMargin);
}

.i-after {
  margin-left: v-bind(iconMargin);
}
</style>
