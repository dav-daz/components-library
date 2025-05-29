<script setup lang="ts">
import PreviewItem from './PreviewItem.vue'
import DummyComponent from '@/components/DummyComponent.vue'

//const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="preview">
    <div class="layout-wrapper">
      <p class="introduction">
        How to use our components ?<br>
        See documentation :
        <a href="https://gitlab.ecedi.fr/vue-js/components-library/-/blob/main/README.md?ref_type=heads"
           target="_blank">
          <code>README.md</code>
        </a>
        <!-- Open file directly in editor (Not working) : -->
        <!-- <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a>. -->
      </p>

      <div id="global">
        <h2 class="preview-title">Global</h2>

        <ul class="preview-list">
          <li>
            <PreviewItem>
              <template #heading>Dummy component</template>
              <DummyComponent/>
            </PreviewItem>
          </li>
        </ul>
      </div>

      <div id="specific">
        <h2 class="preview-title">Specific</h2>

        <ul class="preview-list">
          <li>
            <PreviewItem>
              <template #heading>Dummy component</template>
              <DummyComponent/>
            </PreviewItem>
          </li>

          <li>
            <PreviewItem>
              <template #heading>Dummy component</template>
              <DummyComponent/>
            </PreviewItem>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  padding-block: var(--gutter-60);
}

.preview-title {
  margin-block: var(--gutter-40);
  padding-bottom: var(--gutter-10);
  font-size: 44px;
  color: var(--c-primary);
  border-bottom: 2px dotted;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: var(--gutter-40);
}


.introduction{
  margin-bottom: var(--gutter-30);
}
</style>
