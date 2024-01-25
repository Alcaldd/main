<template>
  <div class="ibox-content forum-container" id="forumContainer">
    <div class="forum-title d-flex flex-row">
      <h3 class="w-100">Notificaciones</h3>
    </div>

    <div class="forum-item active">
      <div class="row" v-if="notificaciones.length > 0">
        <div class="row mt-4" v-for="notificacion in notificaciones" :key="notificacion.id">
          <div class="col-md-9">
            <div class="forum-icon">
              <i class="fa fa-shield"></i>
            </div>
            <div class="forum-sub-title">{{ notificacion.mensaje }}</div>
            <div class="forum-sub-title">{{ notificacion.fecha }}</div>
          </div>
          <div
            class="col-md-3 forum-info"
            v-on:click="eliminarNotificacion(notificacion.id)"
          >
            <span class="material-symbols-outlined"> delete </span>
            <div>
              <small>Eliminar</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-else>
        <div class="col-md-12">
          <div class="forum-icon">
            <i class="fa fa-shield"></i>
          </div>
          <div class="forum-sub-title">No tienes notificaciones</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notificaciones: [],
      URL: "http://localhost:3000/api/notificaciones",
      URL_DELETE: "http://localhost:3000/api/notificaciones/eliminar/",
    };
  },
  created: function () {
    this.cargarNotificaciones();
  },
  methods: {

    cargarNotificaciones() {
      this.axios
        .get(this.URL, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.notificaciones = response.data;
        });
    },
    eliminarNotificacion(id) {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Quieres eliminar esta notificacion?",
          text: "No podras revertir la accion",
          confirmButtonText: "Eliminar",
          confirmButtonColor: "#f1bc90",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .post(this.URL_DELETE + id, {}, {
                headers: {
                  "x-access-token": this.$store.getters.getUserToken,
                },
              })
              .then((response) => {
                this.$swal
                  .fire({
                    icon: "success",
                    title: "Notificacion Eliminada",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed)
                      return location.reload();
                  });
              })
              .catch((error) => {
                this.$swal
                  .fire({
                    icon: "error",
                    title: "Error al eliminar la notificacion",
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
