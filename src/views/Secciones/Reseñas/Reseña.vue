<script>
import { socket } from "@/socket.js";
import { state } from "@/socket.js";
import Slider from "@/components/Slider.vue";
export default {
  name: "Resena",
  components: {
    Slider,
  },
  data() {
    return {
      resenas: [],
      URL: "http://localhost:3000/api/resenas/",
      URL_COMENTAR: "http://localhost:3000/api/resenas/comentario/",
      URL_SUBFORO: "http://localhost:3000/api/subforo/",
      URL_CALIFICAR: "http://localhost:3000/api/calificaciones",
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
      URL_REGLAS: "http://localhost:3000/api/foros/regla",
      URL_LIKEREPLY: "http://localhost:3000/api/subforo/like/reply/",
      loading: true,
      reglas: [],
      cantidadVotos: 0,
      likesReplies: [],
      detalles: [],
      carreteImages: [],
      comentarios: [],
      likes: [],
      replicas: [],
      rol: this.$store.getters.getUserRol,
      subforoSelected: -1,
      messageFile: null,
      replyMode: false,
      repliedMessage: null,
      message: "",
      comentariosResena: [],
      comentario: "",
      motor: [],
      chasis: [],
      perfomance: [],
      medidas: [],
      seguridad: [],
      entretenimiento: [],
      confort: [],
      calificaciones: {
        gasolina: 0,
        confiabilidad: 0,
        confort: 0,
        diseno: 0,
        manejo: 0,
        total: 0,
      },
    };
  },

  created: async function () {
    await this.joinRoomResena();
    await this.fetchChanges();
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

    async fetchChanges() {
      socket.on("resenaUpdate", (id) => {
        if (id == this.$route.params.id) {
          this.getResena();
          if (this.subforoSelected != -1) {
            this.seeSubforo(this.$route.params.id, this.subforoSelected);
          }
        }
      });
    },

    async notifyUsers() {
      await socket.emit("resenaUpdate", this.$route.params.id);
    },

    async joinRoomResena() {
      await socket.emit("joinResena", this.$route.params.id);
    },

    handleFile(e) {
      this.messageFile = e.target.files[0];
    },

    sendComentario() {
      this.axios
        .post(
          this.URL_COMENTAR + this.$route.params.id,
          {
            comentario: this.comentario,
          },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.comentario = "";
          this.notifyUsers();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    closeReply() {
      this.replyMode = false;
    },

    muteSubforo() {
      this.axios
        .post(
          this.URL_SUBFORO +
            "mute/" +
            this.$route.params.id +
            "/" +
            this.subforoSelected,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    replyMessage(id) {
      this.repliedMessage = id;
      this.replyMode = true;
    },

    getResena() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.resenas = [];
          this.detalles = [];
          this.carreteImages = [];
          this.comentariosResena = [];

          this.resenas.push(response.data.resena[0]);
          this.detalles.push(response.data.resena[1]);
          this.cantidadVotos = response.data.calif.length;
          this.carreteImages = response.data.resena[2];
          this.comentariosResena = response.data.comentarios;

          this.motor = response.data.motor;
          this.chasis = response.data.chasis;
          this.perfomance = response.data.perfomance;
          this.medidas = response.data.capacidades;
          this.seguridad = response.data.seguridad;
          this.entretenimiento = response.data.entretenimiento;
          this.confort = response.data.confort;

          this.calcularCalificaciones(response.data.calif);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    calcularCalificaciones(x) {
      // Realizar el cálculo de 5 estrellas en base a cada calificación dentro del arreglo

      let gasolina = 0;
      let confiabilidad = 0;
      let confort = 0;
      let diseno = 0;
      let manejo = 0;

      x.forEach((calificacion) => {
        gasolina += calificacion.gasolina;
        confiabilidad += calificacion.confiabilidad;
        confort += calificacion.confort;
        diseno += calificacion.diseno;
        manejo += calificacion.manejo;
      });

      // Calcular promedio

      this.calificaciones.gasolina = Math.min(5, gasolina / x.length)
      this.calificaciones.confiabilidad = Math.min(
        5,
        confiabilidad / x.length
      )
      this.calificaciones.confort = Math.min(5, confort / x.length)
      this.calificaciones.diseno = Math.min(5, diseno / x.length)
      this.calificaciones.manejo = Math.min(5, manejo / x.length)


      this.calificaciones.total =
        this.calificaciones.gasolina +
        this.calificaciones.confiabilidad +
        this.calificaciones.confort +
        this.calificaciones.diseno +
        this.calificaciones.manejo;

      this.calificaciones.total = Math.min(5, this.calificaciones.total / 5).toFixed(2);

      // Redondear a 2 decimales
      this.calificaciones.gasolina = this.calificaciones.gasolina.toFixed(2);
      this.calificaciones.confiabilidad = this.calificaciones.confiabilidad.toFixed(
        2
      );
      this.calificaciones.confort = this.calificaciones.confort.toFixed(2);
      this.calificaciones.diseno = this.calificaciones.diseno.toFixed(2);
      this.calificaciones.manejo = this.calificaciones.manejo.toFixed(2);
    },

    deleteMessage(id) {
      this.axios
        .post(
          this.URL_SUBFORO + "delete/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
          this.notifyUsers();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    ordenarComentarios() {
      // Debe verse asi
      // {texto:, imagen:, usuario:, likes: [], reply: []}
      // Las replicas tambien tienen likes

      let comentariosStructure = [];

      this.comentarios.forEach((comentario) => {
        let newComentario = {
          id: comentario.id,
          id_usuario: comentario.id_usuario,
          texto: comentario.texto,
          imagen: comentario.imagen,
          nombre: comentario.nombre,
          subforo: comentario.id_subforo,
          likes: this.likes.filter(
            (like) => like.id_comentario == comentario.id
          ),
          replicas: []
        }

        this.replicas.forEach((replica) => {
          if (replica.id_comentario == comentario.id) {
            newComentario.replicas.push({
              id: replica.id,
              id_usuario: replica.id_usuario,
              texto: replica.texto,
              imagen: replica.imagen,
              nombre: replica.nombre,
              subforo: replica.id_subforo,
              likes: this.likesReplies.filter(
                (like) => like.id_reply == replica.id
              ),
            });
          }
        });

        comentariosStructure.push(newComentario);
      });

      this.comentarios = comentariosStructure;
    },

    sendMessage() {
      if (this.message.trim() == "") {
        this.$swal.fire({
          icon: "error",
          title: "No puedes enviar un mensaje vacio",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      if (this.replyMode == false) {
        let formData = new FormData();
        formData.append("comentario", this.message);
        formData.append("imagen", this.messageFile);

        this.axios
          .post(
            this.URL_SUBFORO +
              this.$route.params.id +
              "/" +
              this.subforoSelected,
            formData,
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.message = "";
            this.messageFile = null;
            this.seeSubforo(this.$route.params.id, this.subforoSelected);
            this.notifyUsers();
          })
          .catch((error) => {
            this.$swal.fire({
              icon: "error",
              title: error.response.data.error,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      } else {
        let formData = new FormData();
        formData.append("texto", this.message);
        formData.append("imagen", this.messageFile);

        this.axios
          .post(
            this.URL_SUBFORO +
              "reply/" +
              this.$route.params.id +
              "/" +
              this.subforoSelected +
              "/" +
              this.repliedMessage,
            formData,
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.message = "";
            this.messageFile = null;
            this.seeSubforo(this.$route.params.id, this.subforoSelected);
            this.notifyUsers();
          })
          .catch((error) => {
            this.$swal.fire({
              icon: "error",
              title: error.response.data.error,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },

    seeSubforo(resena, id) {
      this.axios
        .get(this.URL_SUBFORO + resena + "/" + id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.comentarios = response.data[0];
          this.likes = response.data[1];
          this.replicas = response.data[2];
          this.likesReplies = response.data[3];
          this.subforoSelected = id;
          this.ordenarComentarios();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    likeReply(subforo, replica) {
      this.axios
        .post(
          this.URL_LIKEREPLY + subforo,
          {id_reply: replica},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
          this.notifyUsers();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    likeMessage(id, comentario) {
      this.axios
        .post(
          this.URL_SUBFORO + "like/" + comentario + "/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
          this.notifyUsers();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    calificarResena(puntaje, tipo) {
      let data = {
        id_resena: this.$route.params.id,
        puntaje: puntaje,
        tipo: tipo,
      };
      this.axios
        .post(this.URL_CALIFICAR, data, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.getResena();
          this.notifyUsers();
        })
        .catch((err) => {
          this.$swal.fire({
            icon: "error",
            title: err.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    deleteReply(id) {
      this.axios
        .post(
          this.URL_SUBFORO + "delete/reply/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
          this.notifyUsers();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

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
  },
};
</script>

<template>
  <div class="card mx-auto" v-for="resena in resenas" :key="resena.id">
    <Slider
      :portada="resena.imagen"
      :video="resena.video"
      :carrete="carreteImages"
    />

    <div class="card-body pt-0 px-0">
      <div
        class="d-flex flex-column text-center justify-content-center mt-3 px-3"
      >
        <small class="mt-1 fs-6 fw-bold text-center">{{ resena.titulo }}</small>
        <p>{{ resena.descripcion }}</p>

        <div class="d-flex gap-2 w-3/4 mx-auto items-center text-center mb-2">
          <span class="material-symbols-outlined text-center"> star </span>
          <p class="fw-bold">{{ calificaciones.total }}</p>
        </div>
        <p class="fw-bold">
          {{ cantidadVotos }} Personas calificaron el vehiculo
        </p>

        <div class="calificacionesBox">
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.gasolina }}</p>
            </div>
            <p>Gasolina</p>
            <div class="star-source">
              <svg>
                <linearGradient
                  x1="50%"
                  y1="5.41294643%"
                  x2="87.5527344%"
                  y2="65.4921875%"
                  id="grad"
                >
                  <stop stop-color="#FFDE10" offset="0%"></stop>
                  <stop stop-color="#E1A105" offset="60%"></stop>
                  <stop stop-color="#F6790B" offset="100%"></stop>
                </linearGradient>
                <symbol id="star" viewBox="153 89 106 108">
                  <polygon
                    id="star-shape"
                    stroke="url(#grad)"
                    stroke-width="5"
                    fill="currentColor"
                    points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                  ></polygon>
                </symbol>
              </svg>
            </div>
            <div class="star-container">
              <input
                type="radio"
                name="star"
                id="five"
                v-on:click="calificarResena(5, 1)"
              />
              <label for="five">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="four"
                v-on:click="calificarResena(4, 1)"
              />
              <label for="four">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="three"
                v-on:click="calificarResena(3, 1)"
              />
              <label for="three">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="two"
                v-on:click="calificarResena(2, 1)"
              />
              <label for="two">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="one"
                v-on:click="calificarResena(1, 1)"
              />
              <label for="one">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
            </div>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.confiabilidad }}</p>
            </div>
            <p>Confiabilidad</p>
            <div class="star-source">
              <svg>
                <linearGradient
                  x1="50%"
                  y1="5.41294643%"
                  x2="87.5527344%"
                  y2="65.4921875%"
                  id="grad"
                >
                  <stop stop-color="#FFDE10" offset="0%"></stop>
                  <stop stop-color="#E1A105" offset="60%"></stop>
                  <stop stop-color="#F6790B" offset="100%"></stop>
                </linearGradient>
                <symbol id="star" viewBox="153 89 106 108">
                  <polygon
                    id="star-shape"
                    stroke="url(#grad)"
                    stroke-width="5"
                    fill="currentColor"
                    points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                  ></polygon>
                </symbol>
              </svg>
            </div>
            <div class="star-container">
              <input
                type="radio"
                name="star"
                id="starConfiabilidad5"
                v-on:click="calificarResena(5, 2)"
              />
              <label for="starConfiabilidad5">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfiabilidad4"
                v-on:click="calificarResena(4, 2)"
              />
              <label for="starConfiabilidad4">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfiabilidad3"
                v-on:click="calificarResena(3, 2)"
              />
              <label for="starConfiabilidad3">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfiabilidad2"
                v-on:click="calificarResena(2, 2)"
              />
              <label for="starConfiabilidad2">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfiabilidad1"
                v-on:click="calificarResena(1, 2)"
              />
              <label for="starConfiabilidad1">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
            </div>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.confort }}</p>
            </div>
            <p>Confort</p>
            <div class="star-source">
              <svg>
                <linearGradient
                  x1="50%"
                  y1="5.41294643%"
                  x2="87.5527344%"
                  y2="65.4921875%"
                  id="grad"
                >
                  <stop stop-color="#FFDE10" offset="0%"></stop>
                  <stop stop-color="#E1A105" offset="60%"></stop>
                  <stop stop-color="#F6790B" offset="100%"></stop>
                </linearGradient>
                <symbol id="star" viewBox="153 89 106 108">
                  <polygon
                    id="star-shape"
                    stroke="url(#grad)"
                    stroke-width="5"
                    fill="currentColor"
                    points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                  ></polygon>
                </symbol>
              </svg>
            </div>
            <div class="star-container">
              <input
                type="radio"
                name="star"
                id="starConfort5"
                v-on:click="calificarResena(5, 3)"
              />
              <label for="starConfort5">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfort4"
                v-on:click="calificarResena(4, 3)"
              />
              <label for="starConfort4">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfort3"
                v-on:click="calificarResena(3, 3)"
              />
              <label for="starConfort3">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfort2"
                v-on:click="calificarResena(2, 3)"
              />
              <label for="starConfort2">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starConfort"
                v-on:click="calificarResena(1, 3)"
              />
              <label for="starConfort">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
            </div>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.diseno }}</p>
            </div>
            <p>Diseño</p>

            <div class="star-source">
              <svg>
                <linearGradient
                  x1="50%"
                  y1="5.41294643%"
                  x2="87.5527344%"
                  y2="65.4921875%"
                  id="grad"
                >
                  <stop stop-color="#FFDE10" offset="0%"></stop>
                  <stop stop-color="#E1A105" offset="60%"></stop>
                  <stop stop-color="#F6790B" offset="100%"></stop>
                </linearGradient>
                <symbol id="star" viewBox="153 89 106 108">
                  <polygon
                    id="star-shape"
                    stroke="url(#grad)"
                    stroke-width="5"
                    fill="currentColor"
                    points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                  ></polygon>
                </symbol>
              </svg>
            </div>
            <div class="star-container">
              <input
                type="radio"
                name="star"
                id="starDiseno5"
                v-on:click="calificarResena(5, 4)"
              />
              <label for="starDiseno5">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starDiseno4"
                v-on:click="calificarResena(4, 4)"
              />
              <label for="starDiseno4">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starDiseno3"
                v-on:click="calificarResena(3, 4)"
              />
              <label for="starDiseno3">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starDiseno2"
                v-on:click="calificarResena(2, 4)"
              />
              <label for="starDiseno2">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starDiseno"
                v-on:click="calificarResena(1, 4)"
              />
              <label for="starDiseno">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
            </div>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.manejo }}</p>
            </div>
            <p>Manejo</p>
            <div class="star-source">
              <svg>
                <linearGradient
                  x1="50%"
                  y1="5.41294643%"
                  x2="87.5527344%"
                  y2="65.4921875%"
                  id="grad"
                >
                  <stop stop-color="#FFDE10" offset="0%"></stop>
                  <stop stop-color="#E1A105" offset="60%"></stop>
                  <stop stop-color="#F6790B" offset="100%"></stop>
                </linearGradient>
                <symbol id="star" viewBox="153 89 106 108">
                  <polygon
                    id="star-shape"
                    stroke="url(#grad)"
                    stroke-width="5"
                    fill="currentColor"
                    points="206 162.5 176.610737 185.45085 189.356511 150.407797 158.447174 129.54915 195.713758 130.842203 206 95 216.286242 130.842203 253.552826 129.54915 222.643489 150.407797 235.389263 185.45085"
                  ></polygon>
                </symbol>
              </svg>
            </div>
            <div class="star-container">
              <input
                type="radio"
                name="star"
                id="starManejo5"
                v-on:click="calificarResena(5, 5)"
              />
              <label for="starManejo5">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starManejo4"
                v-on:click="calificarResena(4, 5)"
              />
              <label for="starManejo4">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starManejo3"
                v-on:click="calificarResena(3, 5)"
              />
              <label for="starManejo3">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starManejo2"
                v-on:click="calificarResena(2, 5)"
              />
              <label for="starManejo2">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
              <input
                type="radio"
                name="star"
                id="starManejo"
                v-on:click="calificarResena(1, 5)"
              />
              <label for="starManejo">
                <svg class="star">
                  <use xlink:href="#star" />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr class="mt-2 mx-3" />

      <div class="detallesBox" v-for="detalle in detalles" :key="detalle.id">
        <div
          class="d-flex flex-column justify-content-between w-25 mb-3 mx-auto text-center"
        >
          <span class="text-muted">Rango de Precio</span>
          <span class="text-muted fs-6"
            >${{ detalle.precio_inicial }} - ${{ detalle.precio_final }}</span
          >
        </div>

        <div
          class="d-flex flex-column justify-content-between w-25 mb-3 mx-auto text-center"
        >
          <span class="text-muted">Clasificación</span>
          <span class="text-muted fs-6">{{ detalle.etiquetas }}</span>
        </div>

        <div class="caracteristicas">
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Marca</span
              ><small class="text-muted fs-6">{{ detalle.marca }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Modelo</span
              ><small class="text-muted fs-6">{{ detalle.modelo }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Año</span
              ><small class="text-muted fs-6">{{ detalle.ano }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">HP</span
              ><small class="text-muted fs-6">{{ detalle.hp }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Combustible</span
              ><small class="text-muted fs-6">{{ motor[0].combustible }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Puertas</span
              ><small class="text-muted fs-6">{{ detalle.puertas }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Transmision</span
              ><small class="text-muted fs-6">{{ chasis[0].tranmision }}</small>
            </div>
          </div>
          <div
            class="d-flex flex-row justify-content-between px-3 pb-4 mx-auto"
          >
            <div class="d-flex flex-column">
              <span class="text-muted">Motor</span
              ><small class="text-muted fs-6">{{ motor[0].cilindros }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="detalles">
        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="true"
                aria-controls="flush-collapseOne"
              >
                Motor
              </button>
            </h3>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              v-for="motor in motor"
              :key="motor.id"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Combustible: {{ motor.combustible }}
                  </li>
                  <li class="list-group-item">
                    Potencia: {{ motor.potencia }}
                  </li>
                  <li class="list-group-item">Torque: {{ motor.torque }}</li>
                  <li class="list-group-item">
                    Cilindros: {{ motor.cilindros }}
                  </li>
                  <li class="list-group-item">
                    Valvulas: {{ motor.valvulas }}
                  </li>
                  <li class="list-group-item">
                    Alimentacion: {{ motor.alimentacion }}
                  </li>
                  <li class="list-group-item">
                    Sistema start/stop: {{ motor.sistema }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="true"
                aria-controls="flush-collapseTwo"
              >
                Performance
              </button>
            </h3>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlushExample"
              v-for="perfomance in perfomance"
              :key="perfomance.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Aceleracion 0-100km: {{ perfomance.aceleracion }}
                  </li>
                  <li class="list-group-item">
                    Velocidad Maxima: {{ perfomance.velocidad }}
                  </li>
                  <li class="list-group-item">
                    Rendimiento en ciudad: {{ perfomance.rendimientociudad }}
                  </li>
                  <li class="list-group-item">
                    Rendimiento en ruta: {{ perfomance.rendimientoruta }}
                  </li>
                  <li class="list-group-item">
                    Rendimiento mixto: {{ perfomance.rendimientomixto }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="true"
                aria-controls="flush-collapseThree"
              >
                Transmision y Chasis
              </button>
            </h3>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
              v-for="chasis in chasis"
              :key="chasis.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Motor (posición): {{ chasis.motor }}
                  </li>
                  <li class="list-group-item">
                    Traccion: {{ chasis.traccion }}
                  </li>
                  <li class="list-group-item">
                    Transmisión: {{ chasis.tranmision }}
                  </li>
                  <li class="list-group-item">
                    Frenos (Delanteros y traseros): {{ chasis.frenos }}
                  </li>
                  <li class="list-group-item">
                    Neumáticos: {{ chasis.neumaticos }}
                  </li>
                  <li class="list-group-item">
                    Suspensión delantera: {{ chasis.suspdelantero }}
                  </li>
                  <li class="list-group-item">
                    Suspensión trasera: {{ chasis.susptrasera }}
                  </li>
                  <li class="list-group-item">
                    Dirección asistida: {{ chasis.direccion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="true"
                aria-controls="flush-collapseFour"
              >
                Medidas y capacidades
              </button>
            </h3>
            <div
              id="flush-collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingFour"
              data-bs-parent="#accordionFlushExample"
              v-for="medidas in medidas"
              :key="medidas.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Largo: {{ medidas.largo }}</li>
                  <li class="list-group-item">Alto: {{ medidas.alto }}</li>
                  <li class="list-group-item">Ancho: {{ medidas.ancho }}</li>
                  <li class="list-group-item">
                    Distancia entre ejes: {{ medidas.distanciaejes }}
                  </li>
                  <li class="list-group-item">
                    Cajuela: {{ medidas.cajuela }}
                  </li>
                  <li class="list-group-item">
                    Tanque de combustible: {{ medidas.tanque }}
                  </li>
                  <li class="list-group-item">Peso: {{ medidas.peso }}</li>
                  <li class="list-group-item">
                    Capacidad de carga: {{ medidas.capacidadcarga }}
                  </li>
                  <li class="list-group-item">
                    Altura de piso: {{ medidas.alturapiso }}
                  </li>
                  <li class="list-group-item">
                    Capacidad de vadeo: {{ medidas.capacidadvadeo }}
                  </li>
                  <li class="list-group-item">
                    Ángulo de ataque: {{ medidas.anguloataque }}
                  </li>
                  <li class="list-group-item">
                    Ángulo de partida: {{ medidas.angulopartida }}
                  </li>
                  <li class="list-group-item">
                    Ángulo ventral: {{ medidas.anguloventral }}
                  </li>
                  <li class="list-group-item">
                    Remolque con frenos: {{ medidas.remolque }}
                  </li>
                  <li class="list-group-item">
                    Escalonamiento vertical: {{ medidas.escalonamiento }}
                  </li>
                  <li class="list-group-item">
                    Inclinacion lateral: {{ medidas.inclinacion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFive"
                aria-expanded="true"
                aria-controls="flush-collapseFive"
              >
                Seguridad
              </button>
            </h3>
            <div
              id="flush-collapseFive"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingFive"
              data-bs-parent="#accordionFlushExample"
              v-for="seguridad in seguridad"
              :key="seguridad.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Airbag: {{ seguridad.airbag }}
                  </li>
                  <li class="list-group-item">ABS: {{ seguridad.abs }}</li>
                  <li class="list-group-item">
                    Distribucion Electronica de Frenado:
                    {{ seguridad.distfrenado }}
                  </li>
                  <li class="list-group-item">
                    Asistencia en frenada de emergencia:
                    {{ seguridad.asistfrenado }}
                  </li>
                  <li class="list-group-item">
                    Alarma e inmovilizador de motor: {{ seguridad.alarma }}
                  </li>
                  <li class="list-group-item">
                    Anclaje para asientos infantiles: {{ seguridad.anclaje }}
                  </li>
                  <li class="list-group-item">
                    Cinturones de seguridad: {{ seguridad.cinturones }}
                  </li>
                  <li class="list-group-item">
                    Otros (especificar): {{ seguridad.otros }}
                  </li>
                  <li class="list-group-item">
                    Sensor de lluvia: {{ seguridad.sensor }}
                  </li>
                  <li class="list-group-item">
                    Tercera luz de stop: {{ seguridad.terceraluz }}
                  </li>
                  <li class="list-group-item">
                    Autobloqueo de puertas con velocidad:
                    {{ seguridad.autobloqueo }}
                  </li>
                  <li class="list-group-item">
                    Control de estabilidad: {{ seguridad.controlestabilidad }}
                  </li>
                  <li class="list-group-item">
                    Control de tracción: {{ seguridad.controltraccion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

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
                <h3 class="modal-title" id="modalTitleId">
                  Reglas de los Foros
                </h3>
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
                      <h3 class="accordion-header" :id="'heading' + regla.id">
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
                      </h3>
                      <div
                        :id="regla.id"
                        class="accordion-collapse collapse show"
                        :aria-labelledby="'heading' + regla.id"
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

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSix"
                aria-expanded="true"
                aria-controls="flush-collapseSix"
              >
                Comunicacion y entretenimiento
              </button>
            </h3>
            <div
              id="flush-collapseSix"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingSix"
              data-bs-parent="#accordionFlushExample"
              v-for="entretenimiento in entretenimiento"
              :key="entretenimiento.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Equipo de música: {{ entretenimiento.musica }}
                  </li>
                  <li class="list-group-item">
                    Bocinas: {{ entretenimiento.bocinas }}
                  </li>
                  <li class="list-group-item">
                    Conexión auxiliar: {{ entretenimiento.conex }}
                  </li>
                  <li class="list-group-item">
                    Interfaz bluetooth: {{ entretenimiento.bluetooth }}
                  </li>
                  <li class="list-group-item">
                    Pantalla en tablero: {{ entretenimiento.tablero }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h3 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSeven"
                aria-expanded="true"
                aria-controls="flush-collapseSeven"
              >
                Confort
              </button>
            </h3>
            <div
              id="flush-collapseSeven"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingSeven"
              data-bs-parent="#accordionFlushExample"
              v-for="confort in confort"
              :key="confort.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Aire acondicionado: {{ confort.aire }}
                  </li>
                  <li class="list-group-item">
                    Asientos delanteros: {{ confort.asientosd }}
                  </li>
                  <li class="list-group-item">
                    Asientos traseros: {{ confort.asientost }}
                  </li>
                  <li class="list-group-item">
                    Cierre de puertas: {{ confort.cierre }}
                  </li>
                  <li class="list-group-item">
                    Computadora de a bordo: {{ confort.computadora }}
                  </li>
                  <li class="list-group-item">
                    Espejo interior: {{ confort.espejoi }}
                  </li>
                  <li class="list-group-item">
                    Espejos exteriores: {{ confort.espejoe }}
                  </li>
                  <li class="list-group-item">
                    Faros antiniebla: {{ confort.farosniebla }}
                  </li>
                  <li class="list-group-item">
                    Faros delanteros: {{ confort.farosdelanteros }}
                  </li>
                  <li class="list-group-item">
                    Palanca de cambios: {{ confort.palanca }}
                  </li>
                  <li class="list-group-item">
                    Quemacocos: {{ confort.quemacocos }}
                  </li>
                  <li class="list-group-item">Rines: {{ confort.rines }}</li>
                  <li class="list-group-item">
                    Vestiduras: {{ confort.vestiduras }}
                  </li>
                  <li class="list-group-item">
                    Control de velocidad crucero: {{ confort.crucero }}
                  </li>
                  <li class="list-group-item">
                    Vidrios (delanteros y traseros): {{ confort.vidrios }}
                  </li>
                  <li class="list-group-item">
                    Volante: {{ confort.volante }}
                  </li>
                  <li class="list-group-item">
                    Apertura cajuela y tapa combustible: {{ confort.cajuela }}
                  </li>
                  <li class="list-group-item">
                    Sensor de estacionamiento: {{ confort.sensor }}
                  </li>
                  <li class="list-group-item">
                    Cámara de visión trasera: {{ confort.camara }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="mt-2 mx-3" />

      <div class="mx-auto w-75 d-flex justify-items-center py-3 flex-column">
        <h1 class="fs-5">Comentarios</h1>

        <div>
          <div
            class="media w-50 mb-3"
            v-for="comentario in comentariosResena"
            :key="comentario.id"
          >
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
            </div>
          </div>
        </div>

        <div class="d-flex flex-row gap-2 mt-3">
          <input
            type="text"
            class="form-control"
            placeholder="Escribe un comentario"
            v-model="comentario"
          />
          <button class="btn btn-danger" type="button" @click="sendComentario">
            Enviar
          </button>
        </div>
      </div>

      <hr class="mt-2 mx-3" />

      <div class="subforos">
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            construction
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 0)"
          >
            Fallos y mecanica
          </button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            mystery
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 1)"
          >
            Consejos y dudas
          </button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            imagesmode
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 2)"
          >
            Imagenes
          </button>
        </div>
      </div>

      <div class="comentarios mt-5" v-if="subforoSelected != -1">
        <div class="d-grid justify-content-center mx-auto gap-3 mb-5" v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'">
          <span class="material-symbols-outlined fs-1 text-center">
            volume_mute
          </span>
          <button class="btn btn-danger btn-block" @click="muteSubforo">
            Silenciar este subforo
          </button>
        </div>

        <div class="d-flex flex-row titulosubforo">
          <h3 class="fs-5 mb-3" v-if="subforoSelected == 0">
            Fallos y mecanica
          </h3>
          <h3 class="fs-5 mb-3" v-if="subforoSelected == 1">
            Consejos y dudas
          </h3>
          <h3 class="fs-5 mb-3" v-if="subforoSelected == 2">Imagenes</h3>
          <button
            class="text-center d-flex align-items-center btn"
            v-on:click="showReglas"
            data-bs-toggle="modal"
            data-bs-target="#modalId"
          >
            <span class="material-symbols-outlined mx-auto"> info </span>
          </button>
        </div>

        <div class="" v-if="comentarios.length == 0">
          <p>No hay comentarios en este subforo!</p>
        </div>

        <div class="" v-else>
          <div
            class="media w-50 mb-3"
            v-for="comentario in comentarios"
            :key="comentario.id"
          >
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
                v-if="comentario.texto != ''"
              >
                <p class="text-small mb-0 text-muted">{{ comentario.texto }}</p>
              </div>
              <button
                @click="replyMessage(comentario.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span
                  class="material-symbols-outlined"
                  @click="replyMessage(comentario.id)"
                >
                  reply
                </span>
              </button>
              <button
                type="button"
                class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                v-if="comentario.likes.length > 0"
              >
                {{ comentario.likes.length }}
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(comentario.subforo, comentario.id)"
                >
                  thumb_up
                </span>
              </button>
              <button type="button" class="border-0 bg-transparent" v-else>
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(comentario.subforo, comentario.id)"
                >
                  thumb_up
                </span>
              </button>
              <button
                @click="deleteMessage(comentario.id)"  v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> delete </span>
              </button>
              <button
                @click="strikeUsuario(comentario.id_usuario)"  v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> warning </span>
              </button>
            </div>
            <div v-if="comentario.imagen != ''">
              <img
                :src="comentario.imagen"
                class="comentarioImagen"
                alt="Chat Message Image"
              />
            </div>

            <div class="" v-if="comentario.replicas.length > 0">
              <div
                class=""
                v-for="replica in comentario.replicas"
                :key="replica.id"
              >
                <div class="replica-box">
                  <img
                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar3.png"
                    alt="user"
                    width="30"
                    class="rounded-circle"
                  />
                  <small class="text-muted mx-3 fs-6"
                    >{{ replica.nombre }} : Replica a
                    {{ comentario.nombre }}</small
                  >
                  <div
                    class="media-body ml-3 mt-2 d-flex gap-2 align-items-center"
                  >
                    <div
                      class="bg-light rounded py-2 px-3 mb-2"
                      v-if="replica.texto != ''"
                    >
                      <p class="text-small mb-0 text-muted">
                        {{ replica.texto }}
                      </p>
                    </div>
                    <button
                      @click="deleteReply(replica.id)"
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span
                        class="material-symbols-outlined"  v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
                        @click="deleteReply(replica.id)"
                      >
                        delete
                      </span>
                    </button>
                    <button
                      type="button"
                      class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                      v-if="replica.likes.length > 0"
                    >
                      {{ replica.likes.length }}
                      <span
                        class="material-symbols-outlined"
                        @click="likeReply(comentario.subforo, replica.id)"
                      >
                        thumb_up
                      </span>
                    </button>
                    <button type="button" class="border-0 bg-transparent" v-else>
                      <span
                        class="material-symbols-outlined"
                        @click="likeReply(comentario.subforo, replica.id)"
                      >
                        thumb_up
                      </span>
                    </button>
                    <button
                      @click="strikeUsuario(replica.id_usuario)"  v-if="rol == 'moderador' || rol == 'admin' || rol == 'superadmin'"
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span
                        class="material-symbols-outlined"
                        @click="strikeUsuario(replica.id_usuario)"
                      >
                        warning
                      </span>
                    </button>
                  </div>

                  <div v-if="replica.imagen != ''">
                    <img
                      :src="replica.imagen"
                      alt="Chat Message Image"
                      class="reply-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex justify-content-center mx-auto gap-3 w-full"
          v-if="!replyMode"
        >
          <div class="mb-3">
            <label for="" class="form-label">Comentario</label>
            <input
              type="text"
              class="form-control"
              v-model="message"
              placeholder="Añade un mensaje a la reseña"
            />
          </div>
          <input
            type="file"
            id="file-message"
            class="d-none"
            @change="handleFile"
          />
          <label type="button" for="file-message" class="btn btn-primary">
            <span class="material-symbols-outlined text-center">
              imagesmode
            </span>
          </label>
          <button type="button" @click="sendMessage" class="btn btn-danger">
            Enviar
          </button>
        </div>
        <div class="d-flex justify-content-center mx-auto gap-3 w-full" v-else>
          <button
            @click="closeReply"
            type="button"
            class="border-0 bg-transparent"
          >
            <span class="material-symbols-outlined"> close </span>
          </button>
          <div class="mb-3">
            <label for="" class="form-label">Replica</label>
            <input
              type="text"
              class="form-control"
              v-model="message"
              placeholder="Escribe una replica al comentario"
            />
          </div>
          <input
            type="file"
            id="file-message"
            class="d-none"
            @change="handleFile"
          />
          <label type="button" for="file-message" class="btn btn-primary">
            <span class="material-symbols-outlined text-center">
              imagesmode
            </span>
          </label>
          <button type="button" @click="sendMessage" class="btn btn-danger">
            Enviar
          </button>
        </div>

        <div class="p-2 imagenseleccionada" v-if="messageFile != null">
          <span class="material-symbols-outlined"> imagesmode </span>
          <p>
            Imagen seleccionada:
            {{ messageFile.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imagenseleccionada {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  align-items: center;
}

.comentarios {
  width: 90%;
  margin: 0px auto;
}

.comentarios div {
  width: 100%;
  align-items: center;
}

.comentarios div button {
  height: 48px;
}

iframe {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.imagenes {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  height: 500px;
  overflow-y: scroll;
  justify-content: center;
}

@media only screen and (max-width: 600px) {
  iframe {
    width: 100%;
    height: 300px;
  }
  .imagenes {
    display: grid;
    height: 100%;
  }

  .imagen-principal {
    width: 100%;
    height: 300px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

.card {
  width: 80%;
  border-radius: 10px;
}

.subforos {
  display: flex;
  width: 60%;
  margin: 0px auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
}
.caracteristicas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.calificacionesBox {
  display: flex;
  flex-direction: row;
  gap: 25px;
  justify-content: center;
}

.detallesBox {
  width: 100%;
  display: grid;
}

.caracteristicas {
  display: flex;
  flex-direction: row;
}

@media only screen and (max-width: 1200px) {
  .calificacionesBox {
    display: grid;
  }
  .caracteristicas {
    flex-direction: column;
  }
}

@media only screen and (max-width: 800px) {
  .card {
    width: 98%;
  }
}

.card-img-top {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
span.text-muted {
  font-size: 12px;
}
small.text-muted {
  font-size: 8px;
}
h5.mb-0 {
  font-size: 1rem;
}
small.ghj {
  font-size: 9px;
}
.mid {
  background: #ecedf1;
}
h6.ml-1 {
  font-size: 13px;
}
small.key {
  text-decoration: underline;
  font-size: 9px;
  cursor: pointer;
}
.btn-danger {
  color: #ffcbd2;
}
.btn-danger:focus {
  box-shadow: none;
}
small.justify-content-center {
  font-size: 9px;
  cursor: pointer;
  text-decoration: underline;
}

@media screen and (max-width: 600px) {
  .col-sm-4 {
    margin-bottom: 50px;
  }
}

.carousel-control-next,
.carousel-control-prev {
  width: 12%;
  opacity: 1;
}

.replica-box {
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 240px;
}

.reply-image {
  height: 200px;
  max-width: 600px;
  overflow-x: scroll;
}

.comentarioImagen {
  max-width: 600px;
  overflow-x: scroll;
}

@media only screen and (max-width: 600px) {
  .reply-image {
    height: 200px;
    max-width: 300px;
    overflow-x: scroll;
  }
  .comentarioImagen {
    max-width: 300px;
    overflow-x: scroll;
  }
}
.car-image {
  height: 100%;
  width: 100%;
}

h1 {
  font-family: "Fjalla One", sans-serif;
  margin-bottom: 0.15rem;
}

h2 {
  font-family: "Cutive Mono", "Courier New";
  font-size: 1rem;
  letter-spacing: 1px;
  margin-bottom: 4rem;
}

label {
  cursor: pointer;
}

svg {
  width: 2rem;
  height: 2rem;
  padding: 0.15rem;
}

/* hide radio buttons */

input[name="star"] {
  display: inline-block;
  width: 0;
  opacity: 0;
  margin-left: -2px;
}

/* hide source svg */

.star-source {
  width: 0;
  height: 0;
  visibility: hidden;
}

/* set initial color to transparent so fill is empty*/

.star {
  color: transparent;
  transition: color 0.2s ease-in-out;
}

/* set direction to row-reverse so 5th star is at the end and ~ can be used to fill all sibling stars that precede last starred element*/

.star-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}

label:hover ~ label .star,
svg.star:hover,
input[name="star"]:focus ~ label .star,
input[name="star"]:checked ~ label .star {
  color: #ebd61b;
}

.titulosubforo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
input[name="star"]:checked + label .star {
  animation: starred 0.5s;
}

input[name="star"]:checked + label {
  animation: scaleup 1s;
}

@keyframes scaleup {
  from {
    transform: scale(1.2);
  }
  to {
    transform: scale(1);
  }
}

@keyframes starred {
  from {
    color: #604600;
  }
  to {
    color: #d6ca2a;
  }
}
</style>
