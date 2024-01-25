<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="createAnuncio">
        <div class="mb-3">
          <label for="titulo" class="form-label">Titulo</label>
          <input
            type="text"
            class="form-control"
            name="titulo"
            aria-describedby="helpId"
            placeholder="Ej: Cambios del sistema" v-model="titulo"
          />
          <small id="helpId" class="form-text text-muted"
            >Una pequeña referencia al tema del anuncio</small
          >
        </div>

        <div
          class="mb-3 d-grid"
        >
          <label for="">Ingresa una descripcion/mensaje</label>
          <textarea
            id="autoColsTextarea"
            class="auto-cols" v-model="mensaje"
          ></textarea>
        </div>

        <button class="btn btn-primary w-100" type="submit">
          Enviar anuncio
        </button>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
        titulo: "",
        mensaje: "",
        URL: "http://localhost:3000/api/comunicados/create",
        loading: false,
    };
  },

  methods: {
    createAnuncio(){
        this.loading = true;
        if(this.titulo.trim() == "" || this.mensaje.trim() == "") return this.$swal.fire("Error", "Debes llenar todos los campos", "error");
        
        const data = {
            titulo: this.titulo,
            mensaje: this.mensaje
        }

        this.axios.post(this.URL, data, {
            headers: {
                "x-access-token": this.$store.getters.getUserToken
            }
        }).then(response => {
            if(response.data.message) return this.$swal.fire("Exito", response.data.message, "success");
            location.reload();
        }).catch(err => {
            if(err.response.data.error) return this.$swal.fire("Error", err.response.data.error, "error");
        }).finally(() => {
            this.loading = false;
        })
    }
  }
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
