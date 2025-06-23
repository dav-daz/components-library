<script lang="ts" setup></script>

<template>
  <div class="preview-item">
    <h3 class="preview-item-title">
      <slot name="heading"></slot>
    </h3>

    <div class="preview-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-item {
  &-title {
    @include relative(top 2.1rem left 3rem);
    font-size: var(--fs-h2);
    line-height: 1;
    padding: var(--gutter-10);
    color: var(--c-secondary);
    background-color: var(--c-white);
  }

  &-content {
    margin-left: var(--gutter-10);
    padding: var(--gutter-30) var(--gutter-30) var(--gutter-20);
    border: solid var(--c-primary);
    border-width: 2px 0 0 2px;
  }
}
</style>
