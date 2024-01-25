<template>
  <div class="input-group my-3 w-75 mx-auto rounded">
    <input
      type="text"
      class="form-control"
      v-model="param"
      placeholder="Busca un foro..."
    />
    <div class="input-group-append">
      <button class="btn btn-secondary" type="button" v-on:click="buscarForo">
        <i class="fa fa-search"></i>
      </button>
    </div>
  </div>

  <div class="ibox-content forum-container" id="forumContainer">
    <div class="forum-title d-flex flex-row">
      <h3 class="w-100">Foros</h3>

      <button
        class="text-center d-flex align-items-center btn"
        v-on:click="showReglas"
        data-bs-toggle="modal"
        data-bs-target="#modalId"
      >
        <span class="material-symbols-outlined mx-auto"> info </span>
      </button>
    </div>

    <div class="forum-item active">
      <div class="row">
        <div class="row mt-4" v-for="foro in foros" :key="foro.foro_id">
          <div class="col-md-9">
            <div class="forum-icon">
              <i class="fa fa-shield"></i>
            </div>
            <RouterLink
              :to="{ name: 'forosver', params: { id: foro.foro_id } }"
              class="forum-item-title forumLink"
              >{{ foro.foro_titulo }}</RouterLink
            >
            <div class="forum-sub-title">Autor: {{ foro.autor_nombre }}</div>
          </div>
          <div
            class="col-md-1 forum-info"
            v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
            v-on:click="silenciarForo(foro.foro_id)"
          >
            <span class="material-symbols-outlined"> mobile_off </span>
            <div>
              <small>Silenciar</small>
            </div>
          </div>
          <div
            class="col-md-1 forum-info"
            v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
            v-on:click="reportarForo(foro.autor_id, foro.foro_id)"
          >
            <span class="material-symbols-outlined"> warning </span>
            <div>
              <small>Reportar</small>
            </div>
          </div>
          <div
            class="col-lg forum-info"
            v-if="rol != 'moderador' && rol != 'admin' && rol != 'superadmin'"
            v-on:click="reportarForo(foro.autor_id, foro.foro_id)"
          >
            <span class="material-symbols-outlined"> warning </span>
            <div>
              <small>Reportar</small>
            </div>
          </div>
          <div
            class="col-md-1 forum-info"
            v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
            v-on:click="eliminarForo(foro.foro_id)"
          >
            <span class="material-symbols-outlined"> delete </span>
            <div>
              <small>Eliminar</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalId"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitleId">Reglas de los Foros</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <p v-if="reglas.length == 0">No hay reglas al momento...</p>

              <div class="accordion" id="accordionExample" v-else>
                <div
                  class="accordion-item"
                  v-for="regla in reglas"
                  :key="regla.id"
                >
                  <h2 class="accordion-header" id="headingOne">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="'#' + regla.id"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      {{ regla.nombre }}
                    </button>
                  </h2>
                  <div
                    :id="regla.id"
                    class="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body">
                      {{ regla.contenido }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="forum-title text-end">
      <a
        class="btn btn-success d-inline-flex align-items-center"
        href="#"
        v-on:click="crearForo"
      >
        <span class="material-symbols-outlined me-2"> add </span>
        Nuevo Foro
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reglas: [],
      foros: [],
      param: "",
      rol: this.$store.getters.getUserRol,
      URL_BUSCAR: "http://localhost:3000/api/foros/buscar/",
      URL_CREAR: "http://localhost:3000/api/foros/crear",
      URL: "http://localhost:3000/api/foros/",
      URL_REGLAS: "http://localhost:3000/api/foros/regla",
      URL_DELETE: "http://localhost:3000/api/foros/eliminar/",
      URL_MUTE: "http://localhost:3000/api/foros/silenciar/",
      URL_REPORT: "http://localhost:3000/api/reportes/crear/",
    };
  },
  created: function () {
    this.cargarForos();
    this.getReglas();
  },
  methods: {
    getReglas() {
      this.axios
        .get(this.URL_REGLAS, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.reglas = response.data;
        });
    },

    showReglas() {},

    cargarForos() {
      this.axios
        .get(this.URL, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.foros = response.data;
        });
    },

    buscarForo() {
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
          this.foros = response.data;
        })
        .catch((error) => {
          this.$swal.fire("Error", error.response.data.error, "error");
        });
    },

    async crearForo() {
      const { value: titulo } = await this.$swal.fire({
        title: "Ingresar un titulo",
        input: "text",
        inputLabel: "El titulo del foro",
        inputPlaceholder: "Ej: foro de motos",
      });

      if (titulo) {
        this.axios
          .post(
            this.URL_CREAR,
            { titulo: titulo },
            {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              title: error.response.data.error,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },
    async reportarForo(id, foro) {
      const { value: text } = await this.$swal.fire({
        title: "¿Quieres reportar este foro?",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque reportas?",
        confirmButtonText: "Reportar",
        confirmButtonColor: "#f1bc90",
      });
      if (text) {
        let data = {
          id_usuario: id,
          id_articulo: 0,
          id_foro: foro,
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
                title: "Foro reportado",
                text: response.data.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#f1bc90",
              })
              .then((result) => {
                if (result.isConfirmed)
                  return this.$router.push({ name: "foros" });
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
    
    eliminarForo(foro) {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Quieres eliminar este foro?",
          text: "Solo podras eliminar este foro si eres moderador o admin, no podras rehacer cambios",
          confirmButtonText: "Eliminar",
          confirmButtonColor: "#f1bc90",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .post(
                this.URL_DELETE + foro,
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
                    title: "Foro eliminado",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed) return location.reload();
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
    silenciarForo(foro) {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Quieres silenciar este foro?",
          text: "Los usuarios no podran escribir en este hasta que lo habilites",
          confirmButtonText: "Silenciar",
          confirmButtonColor: "#f1bc90",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .post(
                this.URL_MUTE + foro,
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
                    title: "Foro Silenciado",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#f1bc90",
                  })
                  .then((result) => {
                    if (result.isConfirmed) return location.reload();
                  });
              })
              .catch((error) => {
                this.$swal
                  .fire({
                    icon: "error",
                    title: "Error al silenciar",
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
