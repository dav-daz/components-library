<script lang="ts" setup>
import ThePreview from './components/preview/ThePreview.vue'
</script>

<template>
  <header class="header" role="banner">
    <div class="layout-wrapper">
      <div class="header-content header-wrapper">
        <div class="header-wrapper">
          <img
            alt="ecedi logo"
            class="logo"
            height="125"
            src="@/assets/images/logo.svg"
            width="125"
          />
          <img
            alt=""
            class="logo icon"
            height="512"
            src="@/assets/images/components.png"
            width="512"
          />

          <h1>Components library</h1>
        </div>

        <nav role="navigation">
          <ul class="header-nav header-wrapper">
            <li><a href="#global">Global</a></li>
            <li><a href="#specific">Specific</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <main class="layout-wrapper" role="main">
    <ThePreview />
  </main>
</template>

<style lang="scss" scoped>
.header {
  padding-block: 2rem;

  &-wrapper {
    display: flex;
    align-items: center;
    gap: var(--gutter-20);
  }

  &-content {
    justify-content: space-between;
  }

  a {
    @include cta-highlighting;
  }
}

.logo {
  width: 80px;
  height: auto;
}

.icon {
  margin-left: -40px;
}

h1 {
  font-size: 28px;
}
</style>
