<script>
export default {
    data() {
        return {
            resultado: false,
            search: [],
            resenas: [],
            data: new FormData(),
            selectedFile: null,
            resenasLista: [],
            listaPreview: false,
            param: "",
            lista: {titulo: "", subtitulo: ""},
            URL_BUSCAR: "http://localhost:3000/api/resenas/buscar/",
            URL_INFO: "http://localhost:3000/api/resenas/info/",
            URL_CREAR: "http://localhost:3000/api/listas/crear/"
        }
    },


    methods: {
        changeHandler (event){
            this.selectedFile = event.target.files[0];
        },
        buscarResena (){
            this.resultado = false
            if(this.param.trim() == '') return this.$swal.fire('Error', 'Ingrese un parametro de busqueda', 'error');
            this.axios.get(this.URL_BUSCAR + this.param, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                this.search = response.data;
                this.resultado = true;
            })
              .catch(error => this.$swal.fire('Error', error.response.data.error, 'error'));
        },
        createLista(){
            if(this.lista.titulo.trim() == '' || this.lista.subtitulo.trim() == ''|| this.selectedFile == null || this.resenas == []) return this.$swal.fire('Error', 'Ingrese todos los campos', 'error');
           
            this.data.append('titulo', this.lista.titulo);
            this.data.append('subtitulo', this.lista.subtitulo);
            this.data.append('image', this.selectedFile);
            let resenas = JSON.stringify(this.resenas);
            this.data.append('resenas', resenas);

            this.axios.post(this.URL_CREAR, this.data, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                          this.$swal.fire('Exito', response.data.message, 'success');
            }).catch(error => {
                this.$swal.fire('Error', error.response.data.error, 'error');
            });
        },
        addToList(id){
            const find = this.resenas.some((resena) => resena == id);
            if(find) return this.$swal.fire('Error', 'Ya añadiste esta reseña', 'error');
            this.resenas.push(id);
            console.log(this.resenas)
            this.resultado = false;
            this.param = "";

            this.cargarResenas();
            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'success',
                title: 'Coche añadido a la lista'
              })
        },

        cargarResenas(){
          Promise.all(
              this.resenas.map((resena) => {
                return this.axios.get(this.URL_INFO + resena, {
                  headers: {
                    'x-access-token': this.$store.getters.getUserToken
                  }
                })
                  .then(response => {
                    return response.data[0];
                  })
                  .catch(error => {
                    this.$swal.fire('Error', error.response.data.error, 'error');
                    // En caso de error, puedes retornar un valor predeterminado o manejarlo según tus necesidades
                    return null;
                  });
              })
            )
              .then(resenasDetalladas => {
                // Una vez que todas las solicitudes se completen, resenasDetalladas contendrá los datos de las reseñas
                this.resenasLista = resenasDetalladas.filter(resena => resena !== null); // Filtramos cualquier valor nulo en caso de error
              });

            this.listaPreview = true;
        },

        removerItemLista(id) {
          this.resenasLista = this.resenasLista.filter((resena) => resena.id != id);
          this.resenas = this.resenas.filter((resena) => resena != id);

          this.$swal.fire('Item Eliminado', 'Eliminado correctamente', 'success');
        }
    }
}
</script>

<template>

<div class="main-container d-grid align-items-center gap-3">
  
  <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header text-center">
                <h3>Crea una lista</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="createLista">
                  <div class="mb-3">
                    <label for="" class="form-label">Titulo</label>
                    <input type="text"
                      class="form-control" v-model="lista.titulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Subtitulo</label>
                    <input type="text"
                      class="form-control" v-model="lista.subtitulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Coches</label>
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="param" placeholder="Busca coches para la lista">
                        <div class="input-group-append">
                        <button class="btn btn-secondary" type="button" v-on:click="buscarResena()">
                            <i class="fa fa-search"></i>
                        </button>
                        </div>
                    </div>

                    <div v-if="resultado">
                        <div class="card mt-2" v-for="resena in search" :key="resena.id">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 d-grid align-items-center">
                                        <img :src="resena.imagen" alt="" class="img-fluid">
                                    </div>
                                    <div class="col-md-8 text-center mx-auto">
                                        <h5>{{ resena.titulo }}</h5>
                                        <p>Rating: {{ resena.calificaciones }}</p>
                                        <button class="btn btn-primary w-100" type="button" v-on:click="addToList(resena.id)">Agregar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="image" class="form-label">Sube una imagen</label>
                    <input type="file" class="form-control" name="image" id="image" v-on:change="changeHandler">
                  </div>


                        <!--Este contenedor guarda la preview de la lista, significa que puedes eliminar y ver como va quedando la lista.-->
                        <div class="container" v-if="resenas.length > 0">
                                <div class="row justify-content-center align-items-center">
                                  <div class="col">
                                    <div class="card">
                                      <div class="card-header text-center">
                                        <h4>Previsualizacion:</h4>
                                        <h5>{{ lista.titulo }}</h5>
                                      </div>
                                      <div class="card-body">

                                        <div class="card mt-2" v-for="info in resenasLista" :key="info.id">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4 d-grid align-items-center">
                                                                <img :src="info.imagen" alt="Imagen Resena" class="img-fluid">
                                                            </div>
                                                            <div class="col-md-8 text-center mx-auto">
                                                                <h5>{{ info.titulo }}</h5>
                                                                <p>{{ info.descripcion }}</p>
                                                                <button class="btn btn-danger w-100" type="button" v-on:click="removerItemLista(info.id)">Eliminar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>


                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2">Crear lista</button>
                  <RouterLink to="/listas" class="btn btn-danger btn-block w-100 mt-2">Regresar</RouterLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      
</div>

</template>