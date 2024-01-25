<template>
  <Spinner v-if="loading" />

  <div
    class="card w-75 mx-auto"
    style="min-height: 700px"
    v-for="articulo in articulo"
    :key="articulo.id"
  >
    <div class="card-body">
      <small class="text-muted">Autor: {{ articulo.id_usuario }}</small>
      <h4 class="card-title">{{ articulo.titulo }}</h4>
      <p class="card-text">
        {{ articulo.subtitulo }}
      </p>

      <p class="card-text" v-html="articulo.contenido"></p>

      <small class="text-muted">{{ articulo.fecha }}</small>

      <div class="btn-group d-flex gap-3 mt-3">
        <button
          type="button"
          class="btn btn-success btn-block border rounded-3"
          v-on:click="reportarArticulo(articulo.id_usuario, articulo.id)"
        >
          Reportar Articulo
        </button>
        <button
          type="button"
          class="btn btn-danger btn-block border rounded-3"
          v-on:click="eliminarArticulo(articulo.id)"
        >
          Eliminar Articulo
        </button>
        <RouterLink
          to="/articulo/listar"
          class="btn btn-primary border rounded-3"
          >Regresar</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  overflow: auto;
  max-width: 600px; /* Establece el ancho máximo de la tarjeta según tus necesidades */
}

 img {
  max-width: 200px; /* Las imágenes se ajustarán al 100% del ancho disponible */
  height: auto; /* Mantiene la relación de aspecto original de la imagen */
}
</style>

<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      articulo: [],
      URL: "http://localhost:3000/api/articulos/",
      URL_DELETE: "http://localhost:3000/api/articulos/eliminar/",
      URL_REPORT: "http://localhost:3000/api/reportes/crear/",
      loading: true,
    };
  },
  created: function () {
    this.getArticulo();
  },
  methods: {
    getArticulo() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.articulo = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },

    async reportarArticulo(id, articulo) {
      const { value: text } = await this.$swal.fire({
        title: "¿Quieres reportar este articulo?",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque reportas?",
        confirmButtonText: "Reportar",
        confirmButtonColor: "#f1bc90",
      });
      if (text) {
        let data = {
          id_usuario: id,
          id_articulo: articulo,
          id_foro: 0,
          id_resena: 0,
          motivo: text,
        };
        this.axios
          .post(this.URL_REPORT, data, {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          })
          .then((response) => {
            this.$swal
              .fire({
                icon: "success",
                title: "Articulo reportado",
                text: response.data.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#f1bc90",
              })
              .then((result) => {
                if (result.isConfirmed)
                  return this.$router.push({ name: "listararticulos" });
              });
          })
          .catch((error) => {
            this.$swal
              .fire({
                icon: "error",
                title: "Error al reportar",
                text: error.response.data.error,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#f1bc90",
              })
              .then((result) => {
                if (result.isConfirmed) return location.reload();
              });
          });
      }
    },

    eliminarArticulo(id) {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Quieres eliminar este articulo?",
          text: "Solo podras eliminar este articulo si eres moderador o admin, no podras rehacer cambios",
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
                    title: "Articulo eliminado",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed)
                      return this.$router.push({ name: "listararticulos" });
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
