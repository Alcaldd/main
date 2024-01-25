<script>
export default {
    data() {
        return {
            search: [],
            selectedFile: null,
            param1: "",
            param2: "",
            resultado: false,
            preview: false,
            data: new FormData(),
            versus: [],
            versusLista: [],
            URL_CREAR: "http://localhost:3000/api/versus/crear",
            URL_BUSCAR: "http://localhost:3000/api/resenas/buscar/",
            URL_INFO: "http://localhost:3000/api/resenas/info/"
        }
    },

    methods: {
        changeHandler (event) { 
            this.selectedFile = event.target.files[0];
        },

        buscarResena (search) {
            this.resultado = false
            if(search == 1){
                if(this.param1.trim() == "") return this.$swal.fire('Error', 'Ingrese un parametro de busqueda', 'error');
                this.callApi(this.param1);
            } else {
                if(this.param2.trim() == "") return this.$swal.fire('Error', 'Ingrese un parametro de busqueda', 'error');
                this.callApi(this.param2); 
            }
            
        },

        callApi (searchParam) {
             this.axios.get(this.URL_BUSCAR + searchParam, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                this.search = response.data;
                this.resultado = true;
            })
              .catch(error => this.$swal.fire('Error', error.response.data.error, 'error'));
        },

        addToVersus(id){
            if(this.versus.length == 2) return this.$swal.fire('Error', 'Ya tienes dos coches en el versus', 'error');
            if(this.versus.some(item => item === id)) return this.$swal.fire('Error', 'Ya tienes este coche en el versus', 'error');
            this.versus.push(id);
            this.cargarCochesVersus();
        },

        deleteFromVersus(id){
            this.versus = this.versus.filter(item => item !== id);
            this.cargarCochesVersus();
        },

        crearVersus(){
            if(this.versus.length < 2) return this.$swal.fire('Error', 'Debes tener dos coches en el versus', 'error');

            if(this.selectedFile == null) return this.$swal.fire('Error', 'Debes subir una imagen', 'error');
            
            this.data.append('image', this.selectedFile);
            let parsedVersus = JSON.stringify(this.versus);
            this.data.append('resenas', parsedVersus);

            if(this.versus.length > 1 && this.selectedFile != null){
                this.axios.post(this.URL_CREAR, this.data, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
                })
                .then(response => {
                    this.$swal.fire('Exito', response.data.message, 'success').then(() => {
                        this.$router.push('/versus');
                    })
                })
                .catch(error => {
                    this.$swal.fire('Error', error.response.data.error, 'error');
                })
            }
        },

        cargarCochesVersus() {
            this.versusLista = [];
            this.preview = false;
            this.versus.forEach(element => {
                this.axios.get(this.URL_INFO + element, {
                    headers: {
                        'x-access-token': this.$store.getters.getUserToken
                    }
                })
                .then(response => {
                    this.versusLista.push(response.data[0]);
                    this.preview = true;
                    })
                .catch(error => this.$swal.fire('Error', error.response.data.error, 'error'));
            })
        }
    }
}
</script>




<template>

    <div class="card w-75 mx-auto">
        <div class="card-body">
            
            <form @submit.prevent="crearVersus">
                <div class="mb-3">
                <label for="" class="form-label">Coche #1</label>
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="param1" placeholder="Busca coches para el versus">
                        <div class="input-group-append">
                            <button class="btn btn-secondary" type="button" v-on:click="buscarResena(1)">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>           
                <div class="mb-3">
                    <label for="" class="form-label">Coche #2</label>
                        <div class="input-group">
                            <input type="text" class="form-control" v-model="param2" placeholder="Busca coches para el versus">
                            <div class="input-group-append">
                                <button class="btn btn-secondary" type="button" v-on:click="buscarResena(2)">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                </div>

                <div v-if="resultado">
                        <div class="card mt-2" v-for="resena in search" :key="resena.id">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 d-grid align-items-center">
                                        <img :src="resena.imagen" alt="" class="img-fluid">
                                    </div>
                                    <div class="col-md-8 text-center mx-auto d-grid align-items-center">
                                        <h5>{{ resena.titulo }}</h5>
                                        <p>Rating: {{ resena.calificaciones }}</p>
                                        <button class="btn btn-primary w-100" type="button" v-on:click="addToVersus(resena.id)">Agregar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

                <div class="my-3">
                        <label for="image" class="form-label">Sube una portada</label>
                        <input type="file" class="form-control" name="image" id="image" v-on:change="changeHandler">
                </div>


                <div class="container" v-if="versusLista.length > 0">
                                <div class="row justify-content-center align-items-center">
                                  <div class="col">
                                    <div class="card">
                                      <div class="card-header text-center">
                                        <h4>Previsualizacion:</h4>
                                      </div>
                                      <div class="card-body">

                                        <div class="card mt-2" v-for="info in versusLista" :key="info.id">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-4 d-grid align-items-center">
                                                                <img :src="info.imagen" alt="Imagen Resena" class="img-fluid">
                                                            </div>
                                                            <div class="col-md-8 text-center mx-auto d-grid align-items-center">
                                                                <h5>{{ info.titulo }}</h5>
                                                                <p>{{ info.calificaciones }}</p>
                                                                <button class="btn btn-danger w-100" type="button" v-on:click="deleteFromVersus(info.id)">Eliminar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                <button class="btn btn-block btn-primary w-100">Crear versus</button>
            </form>

        </div>
    </div>




</template>