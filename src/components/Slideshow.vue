<template>
  <div class="slideshow">
    <swiper :slides-per-view="3" :space-between="50">
      <swiper-slide v-for="n in slides" :key="n">Slide {{ n }}</swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const slides = [1, 2, 3, 4, 5];
</script>

<style scoped>
.slideshow {
  width: 100%;
}
</style>