<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="createRegla">
        <div class="mb-3">
          <label for="titulo" class="form-label">Nombre</label>
          <input
            type="text"
            class="form-control"
            name="titulo"
            aria-describedby="helpId"
            placeholder="Ej: Reglas Generales de los Foros"
            v-model="nombre"
          />
          <small id="helpId" class="form-text text-muted"
            >Explica cual sera la regla de los foros añadida.</small
          >
        </div>

        <div class="mb-3 d-grid">
          <label for="">Ingresa una descripcion/mensaje</label>
          <textarea
            id="autoColsTextarea"
            class="auto-cols"
            v-model="contenido"
          ></textarea>
        </div>

        <button class="btn btn-primary w-100" type="submit">Crear regla</button>
      </form>
    </div>
    <div class="card-body mt-3">
      <form @submit.prevent="addWords">
        <div class="mb-3">
          <label for="palabras" class="form-label">Palabras</label>
          <input
            type="text"
            class="form-control"
            name="palabras"
            aria-describedby="helpId"
            placeholder="Ej: Tonto, Malo, Noob"
            v-model="palabras"
          />
          <small id="helpId" class="form-text text-muted"
            >Añade palabras a la lista, que estan prohibidas</small
          >
        </div>

        <button class="btn btn-primary w-50 mr-2" type="button" @click="addWordToList">Agregar palabras</button>
        <button class="btn btn-success w-50 ml-2" type="submit">Actualizar lista</button>
      </form>
    </div>

    <div class="mt-5 w-75 mx-auto m-3">


      <div class="card p-2 mt-3 shadow-sm d-flex flex-row" v-for="regla in reglas" :key="regla.id">
        <div class="d-grid gap-2">
          <p class="card-title fw-bold">
            {{ regla.nombre }}
          </p>
          <p class="card-text">{{ regla.contenido }}</p>
        </div>

        <button
          v-if="regla.nombre != 'Palabras'"
          @click="deleteRegla(regla.id)"
          type="button"
          class="border-0 bg-transparent mx-auto"
        >
          <span
            class="material-symbols-outlined"
          >
            delete
          </span>
        </button>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: "",
      contenido: "",
      reglas: [],
      palabras: "",
      list: [],
      URL: "http://localhost:3000/api/foros/regla/crear",
      URL_ELIMINAR: "http://localhost:3000/api/foros/regla/eliminar/",
      URL_VER: "http://localhost:3000/api/foros/regla",
      PALABRAS: "http://localhost:3000/api/foros/palabras",
      loading: false,
    };
  },

  created: function () {
    this.getReglas();
  },

  methods: {
    getReglas() {
      this.axios
        .get(this.URL_VER, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.reglas = response.data;
        })
        .catch((err) => {
          return this.$swal.fire('Error', err.response.data.message, 'error');
        });
    },

    deleteRegla(id){
        this.axios
            .post(this.URL_ELIMINAR + id, {}, {
                headers: {
                    "x-access-token": this.$store.getters.getUserToken,
                },
            })
            .then((response) => {
                this.getReglas();
                return this.$swal.fire('Exito', response.data.message, 'success');
            })
            .catch((err) => {
                return this.$swal.fire('Error', err.response.data.message, 'error');
            });
    },

    createRegla() {
      this.loading = true;
      if (this.nombre.trim() == "" || this.contenido.trim() == "")
        return this.$swal.fire(
          "Error",
          "Debes llenar todos los campos",
          "error"
        );

      const data = {
        nombre: this.nombre,
        contenido: this.contenido,
      };

      this.axios
        .post(this.URL, data, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          if (response.data.message)
            this.getReglas();
            return this.$swal.fire("Exito", response.data.message, "success");
        })
        .catch((err) => {
          if (err.response.data.error)
            return this.$swal.fire("Error", err.response.data.error, "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },


    addWordToList(){
      if(this.palabras.trim() == "") return this.$swal.fire("Error", "Debes llenar el campo", "error");

      this.list.push(this.palabras);
      this.palabras = "";
    },

    addWords(){
      if(this.list.length == 0) return this.$swal.fire("Error", "Debes añadir palabras a la lista", "error");

      this.axios.post(this.PALABRAS, {palabras: this.list}, {
        headers: {
          "x-access-token": this.$store.getters.getUserToken,
        },
      })
      .then(response => {
        if(response.data.message) {
          this.getReglas();
          this.$swal.fire("Exito", response.data.message, "success");
        };
      })
      .catch(err => {
        if(err.response.data.message) return this.$swal.fire("Error", err.response.data.message, "error");
      })
    }
  },
};
</script>

<style scoped>
#autoColsTextarea {
  resize: none;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: 100px;
}

@media screen and (max-width: 768px) {
  #autoColsTextarea {
    width: auto;
    white-space: nowrap;
    overflow-x: scroll;
  }
}
</style>
