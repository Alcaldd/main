<template>
  <Spinner v-if="loading" />

  <div
    class="card w-75 mx-auto"
    style="min-height: 700px"
    v-for="lista in lista"
    :key="lista.id"
  >
    <div class="card-body">
      <h4 class="card-title">{{ lista.titulo }}</h4>
      <small class="text-muted mb-3">Autor: {{ lista.subtitulo }}</small>

      <div class="list-group mt-4">
        <a
          :href="'/res/ver/' + coche.resena_id"
          class="row list-group-item list-group-item-action flex-column align-items-start mx-auto"
          v-for="coche in coches"
          :key="coche.id"
        >
          <div class="row">
            <div class="col-md-4 d-grid align-items-center">
              <img :src="coche.imagen" alt="" class="img-fluid" />
            </div>
            <div class="col-md-8 text-center mx-auto align-items-center d-grid mt-2">
              <h5>{{ coche.titulo }}</h5>
              <p>{{ coche.descripcion }}</p>
              <p>Rating: {{ coche.calificaciones }}</p>
            </div>
          </div>
        </a>
      </div>

      <div class="btn-group d-flex gap-3 mt-3">
        <button
          type="button"
          class="btn btn-danger btn-block border rounded-3"
          v-on:click="eliminarLista(lista.id)"
        >
          Eliminar Lista
        </button>
        <RouterLink
          to="/listas/ver"
          class="btn btn-primary border rounded-3"
          >Regresar</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      lista: [],
      coches: [],
      URL: "http://localhost:3000/api/listas/ver/",
      URL_DELETE: "http://localhost:3000/api/listas/eliminar/",
      loading: true,
    };
  },
  created: function () {
    this.getLista();
  },
  methods: {
    getLista() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.lista = response.data[0];
          this.coches = response.data[1];
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },

    eliminarLista(id) {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Quieres eliminar esta lista?",
          text: "Solo podras eliminar esta lista si eres moderador o admin, no podras rehacer cambios",
          confirmButtonText: "Eliminar",
          confirmButtonColor: "#f1bc90",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .post(
                this.URL_DELETE + id,
                {},
                {
                  headers: {
                    "x-access-token": this.$store.getters.getUserToken,
                  },
                }
              )
              .then((response) => {
                this.$swal
                  .fire({
                    icon: "success",
                    title: "Lista eliminada",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed)
                      return this.$router.push({ name: "listarlistas" });
                  });
              })
              .catch((error) => {
                this.$swal
                  .fire({
                    icon: "error",
                    title: "Error al eliminar",
                    text: error.response.data.error,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed) return location.reload();
                  });
              });
          }
        });
    },
  },
};
</script>
