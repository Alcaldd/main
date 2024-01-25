<template>
  <Splide
    :options="{ rewind: true, wheel: true, arrows: true }"
    aria-label="Vue Splide Example"
    class="mb-3"
  >
    <SplideSlide class="slide">
      <img :src="portada" alt="Portada de la Reseña" />
    </SplideSlide>
    <SplideSlide class="slide">
      <iframe
        :src="'https://www.youtube.com/embed/' + video"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </SplideSlide>
    <SplideSlide class="slide" v-for="carreteImage in carrete" :key="carreteImage.id">
      <img :src="carreteImage.imagen" alt="Imagen del Carrete" />
    </SplideSlide>
  </Splide>
</template>

<style scoped>
iframe {
    width: 100%;
    height: 600px;
}

img {
    width: 100%;
    height: 600px;
}

.slide {
    height: 600px;
}
</style>

<script>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import { defineComponent } from "vue";
import "@splidejs/vue-splide/css";

export default defineComponent({
  name: "Slider",
  props: {
    portada: String,
    video: String,
    carrete: Array,
  },
  components: { Splide, SplideSlide },
});
</script>
