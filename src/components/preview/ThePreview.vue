<script lang="ts" setup>
import PreviewItem from './PreviewItem.vue'
import DummyComponent from '@/components/DummyComponent.vue'
import VQuote from '@/components/VQuote.vue'

//const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="preview">
    <div class="layout-content">
      <p class="preview-intro">
        How to use our components ?<br />
        See documentation :
        <a
          href="https://gitlab.ecedi.fr/vue-js/components-library/-/blob/main/README.md?ref_type=heads"
          target="_blank"
        >
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
              <DummyComponent />
            </PreviewItem>
          </li>
        </ul>
      </div>

      <div id="specific">
        <h2 class="preview-title">Specific</h2>

        <ul class="preview-list">
          <li>
            <PreviewItem>
              <template #heading>VQuote</template>
              <VQuote
                :image="{
                  url: 'https://picsum.photos/160/160',
                  width: 160,
                  height: 160,
                }"
                author="Corneille"
                detail="Le Cid"
                text="À vaincre sans péril, on triomphe sans gloire"
              />
            </PreviewItem>
          </li>

          <li>
            <PreviewItem>
              <template #heading>Dummy component</template>
              <DummyComponent />
            </PreviewItem>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview {
  padding-block: var(--gutter-60);

  &-intro {
    margin-bottom: var(--gutter-30);
    line-height: 1.3;

    a {
      @include cta-highlighting;
    }
  }

  &-title {
    margin-block: var(--gutter-50) 0;
    padding-bottom: var(--gutter-10);
    font-size: 44px;
    color: var(--c-primary);
    border-bottom: 2px dotted;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: var(--gutter-40);
  }
}
</style>
