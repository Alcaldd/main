<template>
  <div class="container py-5 px-4">
    <div class="row rounded-lg overflow-hidden shadow">
      <!-- Users box-->
      <!-- Chat Box-->
      <div class="col px-0">
        <div class="px-4 py-5 chat-box bg-white">
          <!-- Sender Message-->

          <div
            class="media w-50 mb-3"
            v-for="mensaje in mensajes"
            :key="mensaje.id"
          >
            <img
              src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
              alt="user"
              width="50"
              class="rounded-circle"
            />
            <small class="text-muted mx-3">{{ mensaje.nombre }}</small>
            <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
              <div
                class="bg-light rounded py-2 px-3 mb-2"
                v-if="mensaje.mensaje != ''"
              >
                <p class="text-small mb-0 text-muted">{{ mensaje.mensaje }}</p>
              </div>
              <button
                @click="replyMessage(mensaje.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> reply </span>
              </button>
              <button
                type="button"
                class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                v-if="mensaje.likes.length > 0"
              >
                {{ mensaje.likes.length }}
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(mensaje.id)"
                >
                  thumb_up
                </span>
              </button>
              <button type="button" class="border-0 bg-transparent" v-else>
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(mensaje.id)"
                >
                  thumb_up
                </span>
              </button>
              <button
                @click="deleteMessage(mensaje.id)"
                v-if="
                  rol == 'moderador' || rol == 'admin' || rol == 'superadmin'
                "
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> delete </span>
              </button>
              <button
                @click="strikeUsuario(mensaje.id_usuario)"
                v-if="
                  rol == 'moderador' || rol == 'admin' || rol == 'superadmin'
                "
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> warning </span>
              </button>
            </div>
            <div v-if="mensaje.imagen != ''">
              <img :src="mensaje.imagen" alt="Chat Message Image" />
            </div>

            <div class="" v-if="mensaje.replicas.length > 0">
              <div
                class=""
                v-for="replica in mensaje.replicas"
                :key="replica.id"
              >
                <div class="replica-box">
                  <img
                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar3.png"
                    alt="user"
                    width="30"
                    class="rounded-circle"
                  />
                  <small class="text-muted mx-3"
                    >{{ replica.nombre }} : Replica a
                    {{ mensaje.nombre }}</small
                  >
                  <div
                    class="media-body ml-3 mt-2 d-flex gap-2 align-items-center"
                  >
                    <div
                      class="bg-light rounded py-2 px-3 mb-2"
                      v-if="replica.mensaje != ''"
                    >
                      <p class="text-small mb-0 text-muted">
                        {{ replica.mensaje }}
                      </p>
                    </div>
                    <button
                      @click="deleteReply(replica.id)"
                      v-if="
                        rol == 'moderador' ||
                        rol == 'admin' ||
                        rol == 'superadmin'
                      "
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span class="material-symbols-outlined"> delete </span>
                    </button>
                    <button
                      type="button"
                      class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                      v-if="replica.likes.length > 0"
                    >
                      {{ replica.likes.length }}
                      <span
                        class="material-symbols-outlined"
                        @click="likeReply(replica.id)"
                      >
                        thumb_up
                      </span>
                    </button>
                    <button
                      type="button"
                      class="border-0 bg-transparent"
                      v-else
                    >
                      <span
                        class="material-symbols-outlined"
                        @click="likeReply(replica.id)"
                      >
                        thumb_up
                      </span>
                    </button>
                    <button
                      @click="strikeUsuario(replica.id_usuario)"
                      v-if="
                        rol == 'moderador' ||
                        rol == 'admin' ||
                        rol == 'superadmin'
                      "
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span class="material-symbols-outlined"> warning </span>
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
        <!-- Typing area -->
        <form action="#" class="bg-light" v-if="reply">
          <button type="button" class="border-0 bg-transparent my-2">
            <span class="material-symbols-outlined" @click="closeReply()">
              close
            </span>
          </button>
          <div
            class="px-2 pt-2 items-center d-grid text-secondary"
            v-if="selectedFile != null"
          >
            Imagen Seleccionada: {{ selectedFile.name }}
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="mensaje"
              placeholder="Replica a este mensaje"
              aria-describedby="button-addon2"
              class="form-control rounded-0 border-0 py-4 bg-light"
            />
            <div class="input-group-append d-grid">
              <button
                id="button-addon2"
                type="button"
                class="btn btn-link"
                v-on:click="crearMensaje"
              >
                <i class="fa fa-paper-plane"></i>
              </button>
              <label for="image" id="button-addon2" class="btn btn-link">
                <i class="fa fa-camera"></i
              ></label>
              <input
                type="file"
                name="image"
                id="image"
                class="d-none"
                @change="changeFile"
              />
            </div>
          </div>
        </form>

        <form action="#" class="bg-light" v-else>
          <div
            class="px-2 pt-2 items-center d-grid text-secondary"
            v-if="selectedFile != null"
          >
            Imagen Seleccionada: {{ selectedFile.name }}
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="mensaje"
              placeholder="Escribe un nuevo mensaje"
              aria-describedby="button-addon2"
              class="form-control rounded-0 border-0 py-4 bg-light"
            />
            <div class="input-group-append d-grid">
              <button
                id="button-addon2"
                type="button"
                class="btn btn-link"
                v-on:click="crearMensaje"
              >
                <i class="fa fa-paper-plane"></i>
              </button>
              <label for="image" id="button-addon2" class="btn btn-link">
                <i class="fa fa-camera"></i
              ></label>
              <input
                type="file"
                name="image"
                id="image"
                class="d-none"
                @change="changeFile"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.replica-box {
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 240px;
}

.reply-image {
  height: 200px;
}
</style>

<script>
import { socket } from "@/socket.js";
import { state } from "@/socket.js";
export default {
  data() {
    return {
      mensajes: state.messages.foro,
      mensaje: "",
      reply: false,
      replyId: null,
      replicas: [],
      data: new FormData(),
      rol: this.$store.getters.getUserRol,
      selectedFile: null,
      likes: [],
      likesReply: [],
      savedFile: { filename: "", path: "" },
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
      URL_SUBIR: "http://localhost:3000/api/chat/upload",
      URL_CREAR: "http://localhost:3000/api/foros/crear/mensaje/",
      URL_REPLY: "http://localhost:3000/api/foros/crear/reply/",
      URL_LIKE: "http://localhost:3000/api/foros/crear/like/",
      URL_LIKEREPLY: "http://localhost:3000/api/foros/crear/like/reply/",
      URL_ELIMINAR: "http://localhost:3000/api/foros/delete/mensaje/",
      URL_ELIMINAR_REPLY: "http://localhost:3000/api/foros/delete/reply/",
    };
  },
  created: async function () {
    await this.cargarMensajes();
    await this.fetchMessages();
    await this.saveImageLink();
    await this.catchErrors();
  },
  methods: {
    async catchErrors() {
      socket.on("error", (error) => {
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });

        console.log(error);
      });
    },
    changeFile(event) {
      this.selectedFile = event.target.files[0];

      if (this.savedFile.path != "") {
        socket.emit("imageDelete", {
          path: this.savedFile.path,
        });
      }

      this.data.delete("file");
      this.data.append("file", this.selectedFile);

      this.axios
        .post(this.URL_SUBIR, this.data, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          return;
        })
        .catch((error) => {
          console.log(error);
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al subir la imagen",
          });
        });
    },

    async saveImageLink() {
      socket.on("image", (data) => {
        this.savedFile.filename = data.filename;
        this.savedFile.path = data.path;
      });
    },

    async fetchMessages() {
      socket.on("joinForo", (messages) => {
        this.mensajes = messages.foro[0];
        this.replicas = messages.foro[1];
        this.likes = messages.foro[2];
        this.likesReply = messages.foro[3];
        this.ordenarMensajes();
      });
    },

    async cargarMensajes() {
      socket.emit("joinForo", {
        room: this.$route.params.id,
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

    deleteMessage(id) {
      socket.emit("deleteMessage", {
        token: this.$store.getters.getUserToken,
        id_mensaje: id,
        room: this.$route.params.id,
      });
    },

    likeMessage(mensaje) {
      this.axios
        .post(
          this.URL_LIKE + this.$route.params.id,
          { id_mensaje: mensaje },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.cargarMensajes();
        });
    },

    deleteReply(id) {
      socket.emit("deleteReply", {
        token: this.$store.getters.getUserToken,
        id_reply: id,
        room: this.$route.params.id,
      });
    },

    replyMessage(id) {
      this.reply = true;
      this.replyId = id;
    },

    closeReply() {
      this.reply = false;
      this.replyId = null;
    },

    likeReply(id) {
      this.axios
        .post(
          this.URL_LIKEREPLY + this.$route.params.id,
          { id_reply: id },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.cargarMensajes();
        });
    },

    ordenarMensajes() {
      // La funcionalidad seria crear un objeto por cada mensaje y sus replicas
      // {mensaje: mensaje, replicas: [replicas]} En el arreglo this.mensajes;

      // Necesito agregarle los likes a cada replica

      let mapNewMensajes = [];

      this.mensajes.forEach((mensaje) => {
        let newMensaje = {
          id: mensaje.id,
          id_usuario: mensaje.id_usuario,
          nombre: mensaje.nombre,
          mensaje: mensaje.mensaje,
          imagen: mensaje.imagen,
          replicas: [],
          likes: [],
        };

        this.replicas.forEach((replica) => {
          if (replica.id_mensaje == mensaje.id) {
            let newReplica = {
              id: replica.id,
              id_usuario: replica.id_usuario,
              nombre: replica.nombre,
              mensaje: replica.mensaje,
              imagen: replica.imagen,
              likes: [],
            };

            this.likesReply.forEach((like) => {
              if (like.id_reply == replica.id) {
                newReplica.likes.push(like);
              }
            });

            newMensaje.replicas.push(newReplica);
          }
        });

        this.likes.forEach((like) => {
          if (like.id_mensaje == mensaje.id) {
            newMensaje.likes.push(like);
          }
        });

        mapNewMensajes.push(newMensaje);
      });

      this.mensajes = mapNewMensajes;
    },

    crearMensaje() {
      if (this.reply) {
        socket.emit("createReply", {
          room: this.$route.params.id,
          text: this.mensaje,
          file: this.savedFile,
          token: this.$store.getters.getUserToken,
          id_reply: this.replyId,
        });
      } else {
        socket.emit("createMessage", {
          room: this.$route.params.id,
          text: this.mensaje,
          file: this.savedFile,
          token: this.$store.getters.getUserToken,
        });
      }

      this.mensaje = "";
      this.savedFile = { filename: "", path: "" };
      this.selectedFile = null;
    },
  },
};
</script>
