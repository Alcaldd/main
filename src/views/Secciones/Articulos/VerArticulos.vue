<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      articulos: [],
      param: "",
      URL_BUSCAR: "http://localhost:3000/api/articulos/buscar/",
      URL: "http://localhost:3000/api/articulos/",
      loading: false,
    };
  },
  created: function () {
    this.getArticulos();
  },
  methods: {
    getArticulos() {
      this.loading = true;
      this.axios
        .get(this.URL, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.articulos = response.data;
          this.loading = response.data.length > 0 ? false : true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    buscarArticulo() {
      if (this.param.trim() == "")
        return this.$swal.fire(
          "Error",
          "Ingrese un parametro de busqueda",
          "error"
        );
      this.axios
        .get(this.URL_BUSCAR + this.param, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.articulos = response.data;
        })
        .catch((error) => {
          this.$swal.fire("Error", error.response.data.error, "error");
        });
    },
  },
};
</script>

<template>
  <div class="input-group my-3 w-75 mx-auto rounded">
    <input
      type="text"
      class="form-control"
      v-model="param"
      placeholder="Busca por titulo..."
    />
    <div class="input-group-append">
      <button
        class="btn btn-secondary"
        type="button"
        v-on:click="buscarArticulo"
      >
        <i class="fa fa-search"></i>
      </button>
    </div>
  </div>

  <Spinner v-if="loading" />

  <div class="articulos w-75 mx-auto gap-3">
    <div class="card" v-for="articulo in articulos" :key="articulo.id">
      <img :src="articulo.portada" class="card-img-top" alt="..." />
      <div class="card-body">
        <h6 class="card-title mb-3">{{ articulo.titulo }}</h6>
        <p class="card-subtitle mb-2 text-muted">{{ articulo.subtitulo }}</p>
        <RouterLink
          :to="{ name: 'articulo', params: { id: articulo.id } }"
          class="btn btn-block btn-danger w-100 mt-3"
          >Revisar noticia</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.articulos {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
