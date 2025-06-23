<script lang="ts" setup>
import IconA11y from '@/components/IconA11y.vue'

defineProps({
  author: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: false,
  },
  image: {
    type: Object,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <blockquote class="quote layout-wrapper">
    <img
      v-if="image"
      :height="image.height"
      :src="image.url"
      :width="image.width"
      alt=""
      class="quote-image"
    />

    <div class="quote-wrapper">
      <p class="quote-text">
        <IconA11y display="inline-block" icon="quote" margin="var(--gutter-10)" size="3rem" />
        {{ text }}
        <IconA11y
          class="i-quote-end"
          display="inline-block"
          icon="quote"
          margin="var(--gutter-10)"
          position="after"
          size="3rem"
        />
      </p>

      <footer v-if="author" class="quote-footer">
        <p class="quote-author">
          {{ author }}
          <span v-if="detail" class="quote-detail">- {{ detail }}</span>
        </p>
      </footer>
    </div>
  </blockquote>
</template>

<style lang="scss" scoped>
.quote {
  display: flex;
  place-items: center;
  justify-content: center;
  gap: var(--gutter-40);

  @include respond-to('small') {
    flex-direction: column;
    text-align: center;
    gap: var(--gutter-20);
  }

  &-image {
    border-radius: 50%;
  }

  &-wrapper {
    display: flex;
    flex-direction: column;
    place-items: center;
    gap: var(--gutter-10);
  }

  &-text {
    font-size: var(--fs-large);
    font-style: italic;
    font-weight: bold;
  }

  .i-quote {
    color: var(--c-primary);

    &-end {
      transform: scaleX(-1);
    }
  }

  &-footer {
    font-size: var(--fs-small);
    text-align: right;
  }
}
</style>
