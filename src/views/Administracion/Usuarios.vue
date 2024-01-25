<script>
import axios from "axios";
export default {
  data() {
    return {
      usuarios: [],
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
      URL_BAN: "http://localhost:3000/api/usuario/ban/",
      URL_ASCENDER: "http://localhost:3000/api/usuario/ascender/",
      URL_DEGRADAR: "http://localhost:3000/api/usuario/degradar/",
      URL_PERDONAR: "http://localhost:3000/api/usuario/pardon/",
    };
  },
  created: function () {
    this.getUsuarios();
  },
  methods: {
    getUsuarios() {
      axios
        .get("http://localhost:3000/api/usuario", {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.usuarios = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async sancionarUsuario(id) {
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
        axios
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

    async banearUsuario(id) {
      const { value: text } = await this.$swal.fire({
        title: "¿Quieres banear a este usuario?",
        text: "Este podra ser desbaneado",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque sancionas?",
        confirmButtonText: "Banear",
        confirmButtonColor: "#FF380E",
      });

      if (text) {
        axios
          .post(
            this.URL_BAN + id,
            {razon: text},
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

    promoverUsuario(id) {
      this.$swal
        .fire({
          icon: "question",
          title: "Ascender usuario",
          text: "Este podra ser degradado",
          confirmButtonText: "Ascender",
          confirmButtonColor: "#0ECCFF",
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .post(
                this.URL_ASCENDER + id,
                {},
                {
                  headers: {
                    "x-access-token": this.$store.getters.getUserToken,
                  },
                }
              )
              .then((response) => {
                this.$swal.fire("Ascendido", response.data.message, "success");
                location.reload();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    },

    degradarUsuario(id) {
      this.$swal
        .fire({
          icon: "warning",
          title: "Degradar usuario",
          text: "Este podra ser ascendido",
          confirmButtonText: "Ascender",
          confirmButtonColor: "#FF500E",
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .post(
                this.URL_DEGRADAR + id,
                {},
                {
                  headers: {
                    "x-access-token": this.$store.getters.getUserToken,
                  },
                }
              )
              .then((response) => {
                this.$swal.fire("Ascendido", response.data.message, "success");
                location.reload();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    },

    async limpiarUsuario(id) {
      const { value: text } = await this.$swal.fire({
        icon: "success",
        title: "Limpiar sanciones",
        text: "Este usuario sera removido de todo tipo de sancion",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque perdonas?",
        confirmButtonText: "Limpiar",
        confirmButtonColor: "#0EFF3D",
      });

      if (text) {
        axios
          .post(
            this.URL_PERDONAR + id,
            {razon: text},
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire("Perdonado", response.data.message, "success");
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
  <div class="table-responsive">
    <table class="table table-light">
      <thead>
        <tr class="text-center">
          <th scope="col">Nombre</th>
          <th scope="col">Strikes</th>
          <th scope="col">Ban</th>
          <th scope="col">Rol</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id" class="text-center">
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.strikes }}</td>
          <td>{{ usuario.ban }}</td>
          <td>{{ usuario.rol }}</td>
          <td
            class="d-flex flex-row gap-1 align-items-center justify-content-center"
          >
            <span
              class="material-symbols-outlined btn btn-warning p-1"
              v-on:click="sancionarUsuario(usuario.id)"
            >
              warning
            </span>

            <span
              class="material-symbols-outlined btn btn-danger p-1"
              v-on:click="banearUsuario(usuario.id)"
            >
              dangerous
            </span>

            <span
              class="material-symbols-outlined btn btn-primary p-1"
              v-on:click="promoverUsuario(usuario.id)"
            >
              upgrade
            </span>

            <span
              class="material-symbols-outlined btn btn-secondary p-1"
              v-on:click="degradarUsuario(usuario.id)"
            >
              gavel
            </span>

            <span
              class="material-symbols-outlined btn btn-success p-1"
              v-on:click="limpiarUsuario(usuario.id)"
            >
              recycling
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
