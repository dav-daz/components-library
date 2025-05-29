<script setup lang="ts"></script>

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

<style scoped>
.preview-item-title {
  font-size: 25px;
  line-height: 1;
  padding-left: var(--gutter-10);
  color: var(--c-tertiary);
  border-left: 18px solid;
}

.preview-item-content {
  margin-left: 8px;
  padding: var(--gutter-20) var(--gutter-20);
  border-left: 2px solid var(--c-tertiary);
}
</style>
