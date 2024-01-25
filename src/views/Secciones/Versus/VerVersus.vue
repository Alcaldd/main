<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      versus: [],
      votosInfo: [],
      porcentajeCoche1: [],
      porcentajeCoche2: [],
      comentarios: [],
      text: "",
      imagen: null,
      URL: "http://localhost:3000/api/versus/",
      URL_COMENTAR: "http://localhost:3000/api/versus/comentario/",
      URL_ELIMINAR: "http://localhost:3000/api/versus/eliminar/comentario/",
      URL_VOTE: "http://localhost:3000/api/versus/votar/",
      URL_SEE: "http://localhost:3000/api/versus/votos/",
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
    };
  },
  created: function () {
    this.callApiVersus();
  },
  methods: {

    async strikeUsuario(id) {
      const { value: text } = await this.$swal.fire({
        title: "¿Quieres sancionar a este usuario?",
        text: "Este tiene un maximo de 3 sanciones",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque sancionas?",
        confirmButtonText: "Sancionar",
        confirmButtonColor: "#f1bc90",
      });

      if (text) {
        this.axios
          .post(
            this.URL_STRIKES + id,
            { razon: text },
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire("Sancionado", response.data.message, "success");
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    deleteComentario(id) {
      this.axios
        .post(
          this.URL_ELIMINAR + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire({
              title: "Comentario eliminado",
              text: response.data.message,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
            this.callApiVersus();
          }
        })
        .catch((error) => {
          this.$swal.fire({
            title: "Error",
            text: error.response.data.error,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        });
    },

    sendMessage() {
      if (this.text == "" && this.imagen == null) {
        this.$swal.fire({
          title: "Error",
          text: "No puedes enviar un mensaje vacio",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const formData = new FormData();
      formData.append("mensaje", this.text);
      formData.append("imagen", this.imagen);

      this.axios
        .post(this.URL_COMENTAR + this.$route.params.id, formData, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire({
              title: "Comentario realizado",
              text: response.data.message,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
            this.callApiVersus();
          }
        })
        .catch((error) => {
          this.$swal.fire({
            title: "Error",
            text: error.response.data.error,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        });
    },

    handleFile(e) {
      this.imagen = e.target.files[0];
    },

    calculateVotes() {
      const sumaTotalPuntos = this.votosInfo.reduce(
        (total, objeto) => total + Number(objeto.PuntosTotales),
        0
      );

      // Paso 2: Calcula el porcentaje de puntos para cada posición
      this.porcentajeCoche1 = [
        {
          puntos: this.votosInfo[0].PuntosTotales,
          coche: this.votosInfo[0].id_coche,
          porcentaje: parseFloat(
            (this.votosInfo[0].PuntosTotales / sumaTotalPuntos) * 100
          ).toFixed(2),
        },
      ];
      this.porcentajeCoche2 = [
        {
          puntos: this.votosInfo[1].PuntosTotales,
          coche: this.votosInfo[1].id_coche,
          porcentaje: parseFloat(
            (this.votosInfo[1].PuntosTotales / sumaTotalPuntos) * 100
          ).toFixed(2),
        },
      ];
    },

    async callApiVersus() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.versus = [];
          this.comentarios = [];

          this.versus = response.data.versus;
          this.comentarios = response.data.comentarios;
          console.log(this.versus)
        })
        .catch((error) => {
          console.log(error);
        });

      this.axios
        .get(this.URL_SEE + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.votosInfo = response.data;
          this.calculateVotes();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    votar(id_coche) {
      this.axios
        .post(
          this.URL_VOTE + this.$route.params.id,
          { id_coche: id_coche },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            this.$swal.fire({
              title: "Voto realizado",
              text: response.data.message,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
          }
          location.reload();
        })
        .catch((error) => {
          this.$swal.fire({
            title: "Error",
            text: error.response.data.error,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        });
    },
  },
};
</script>

<template>
  <div class="card" v-for="versus in versus" :key="versus.versus_id">
    <div class="card-body d-grid">
      <div class="row justify-content-center">
        <div
          class="col-md-4 align-items-center justify-content-center d-grid gap-2"
        >
          <img
            :src="versus.coche1_imagen"
            alt="Imagen vehiculo"
            style="height: 150px"
          />
          <a
            :href="'/res/ver/' + versus.coche1_id"
            class="card-title fs-2 text-decoration-none"
            >{{ versus.coche1_titulo }}</a
          >
          <p class="card-text">
            Calificaciones: {{ versus.coche1_calificaciones }}
          </p>
          <p
            class="card-text"
            v-for="porcentaje in porcentajeCoche1"
            :key="porcentaje.coche"
          >
            Votos Obtenidos: {{ porcentaje.puntos }}<br />
            <br />
            Porcentaje Obtenido: {{ porcentaje.porcentaje }}%
          </p>
          <button
            class="btn-block btn btn-primary"
            v-on:click="votar(versus.coche1_id)"
          >
            Votar
          </button>
        </div>
        <div
          class="col-4 d-grid align-items-center text-center justify-content-center"
        >
          <h2 class="fs-1 fw-bold col">VS</h2>
        </div>
        <div
          class="col-md-4 align-items-center justify-content-center d-grid gap-2"
        >
          <img
            :src="versus.coche2_imagen"
            alt="Imagen vehiculo"
            style="height: 150px"
          />
          <a
            :href="'/res/ver/' + versus.coche2_id"
            class="card-title fs-2 text-decoration-none"
            >{{ versus.coche2_titulo }}</a
          >
          <p class="card-text">
            Calificaciones: {{ versus.coche2_calificaciones }}
          </p>
          <p
            class="card-text"
            v-for="porcentaje in porcentajeCoche2"
            :key="porcentaje.coche"
          >
            Votos Obtenidos: {{ porcentaje.puntos }}<br />
            <br />
            Porcentaje Obtenido: {{ porcentaje.porcentaje }}%
          </p>
          <button
            class="btn-block btn btn-secondary"
            v-on:click="votar(versus.coche2_id)"
          >
            Votar
          </button>
        </div>
      </div>
      <row>
        <div class="progress col mt-5 mx-auto">
          <div
            class="progress-bar bg-primary"
            v-for="porcentaje in porcentajeCoche1"
            :key="porcentaje.coche"
            role="progressbar"
            :style="{ width: porcentaje.porcentaje + '%' }"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
          <div
            class="progress-bar bg-secondary"
            v-for="porcentaje in porcentajeCoche2"
            :key="porcentaje.coche"
            role="progressbar"
            :style="{ width: porcentaje.porcentaje + '%' }"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </row>

      <hr class="my-5" />

      <div class="mt-3">
        <h2 class="fs-5">Comentarios</h2>

        <div>
          <div
            class="media w-50 mb-3 d-flex"
            v-for="comentario in comentarios"
            :key="comentario.id"
          >
            <div class="">
              <img
                src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                alt="user"
                width="50"
                class="rounded-circle"
              />
              <small class="text-muted text fs-6 mx-3">{{
                comentario.nombre
              }}</small>
              <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
                <div
                  class="bg-light rounded py-2 px-3 mb-2"
                  v-if="comentario.mensaje != ''"
                >
                  <p class="text-small mb-0 text-muted">
                    {{ comentario.mensaje }}
                  </p>
                </div>
                <img
                  :src="comentario.imagen"
                  alt="Imagen comentario"
                  style="height: 150px"
                  v-if="comentario.imagen != ''"
                />
              </div>
            </div>
            <button
              @click="deleteComentario(comentario.id)"
              type="button"
              class="border-0 bg-transparent"
            >
              <span
                class="material-symbols-outlined"
                @click="deleteComentario(comentario.id)"
              >
                delete
              </span>
            </button>
            <button
              @click="strikeUsuario(comentario.id_usuario)"
              type="button"
              class="border-0 bg-transparent"
            >
              <span
                class="material-symbols-outlined"
                @click="strikeUsuario(comentario.id_usuario)"
              >
                warning
              </span>
            </button>
          </div>
        </div>

        <div class="d-flex flex-row gap-2 mx-auto w-75 mt-3">
          <input
            type="text"
            placeholder="Ingresa un comentario"
            class="w-75 mx-auto"
            v-model="text"
          />
          <input type="file" id="imagen" class="d-none" @change="handleFile" />

          <label for="imagen">
            <span class="material-symbols-outlined fs-1 text-center">
              imagesmode
            </span>
          </label>

          <button
            type="button"
            class="btn btn-block btn-primary"
            @click="sendMessage"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
