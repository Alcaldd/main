<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      listas: [],
      URL: "http://localhost:3000/api/listas/ver",
      URL_BUSCAR: "http://localhost:3000/api/listas/buscar/",
      loading: false,
      param: "",
    };
  },
  created: function () {
    this.getListas();
  },
  methods: {
    getListas() {
      this.loading = true;
      this.axios
        .get(this.URL, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.listas = response.data;
          this.loading = response.data.length > 0 ? false : true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    buscarLista() {
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
          this.listas = response.data;
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
      placeholder="Busca una lista por su titulo..."
    />
    <div class="input-group-append">
      <button class="btn btn-secondary" type="button" v-on:click="buscarLista">
        <i class="fa fa-search"></i>
      </button>
    </div>
  </div>

  <Spinner v-if="loading" />

  <div class="articulos w-75 mx-auto gap-3">
    <div class="card" v-for="lista in listas" :key="lista.id">
      <img :src="lista.imagen" class="card-img-top" alt="..." />
      <div class="card-body">
        <h6 class="card-title mb-3">{{ lista.titulo }}</h6>
        <p class="card-subtitle mb-2 text-muted">{{ lista.subtitulo }}</p>
        <RouterLink
          :to="{ name: 'listaver', params: { id: lista.id } }"
          class="btn btn-block btn-danger w-100 mt-3"
          >Revisar lista</RouterLink
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
