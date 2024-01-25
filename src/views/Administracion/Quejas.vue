<script>
import Alerta from '../../components/Alerta.vue';

export default {
    components: {
        Alerta
    },
    data(){
        return {
            quejas: [],
            URL: "http://localhost:3000/api/quejas",
            URL_ELIMINAR: "http://localhost:3000/api/quejas/eliminar/",
            alertaNoQuejas: false
        }
    },
    created: function () { this.getQuejas() },

    methods: {
        getQuejas () {
            this.axios.get(this.URL, {
            headers: {
                'x-access-token': this.$store.getters.getUserToken
            }
            }).then(response => {
                this.alertaNoQuejas = response.data.length === 0;

                this.quejas = response.data.length > 0 ? response.data : [];
            }).catch(error => {
                console.log(error);
            })
        },

        cerrarQueja(id){
                    this.$swal.fire({
                        icon: 'question',
                        title: '¿Quieres eliminar esta queja?',
                        text: 'No podras deshacer tus acciones',
                        confirmButtonText: 'Eliminar',
                        confirmButtonColor: '#0ECCFF',
                        }).then((result) => {
                        if (result.isConfirmed) {
                                this.axios.post(this.URL_ELIMINAR + id, {}, {
                                    headers: {
                                        'x-access-token': this.$store.getters.getUserToken,
                                    }
                                }).then(response => {
                                    this.$swal.fire(
                                    'Eliminado',
                                    response.data.message,
                                    'success'
                                    ).then((result) => {
                                        if (result.isConfirmed) {
                                            location.reload();
                                        }
                                    })
                                }).catch(error => {
                                    this.$swal.fire(
                                    'Error',
                                    error.response.data.error,
                                    'error'
                                    )
                                })

                            }
                        })
                    }
    }
    
}


</script>

<template>
    <div class="table-responsive">
        <table class="table table-light text-center">
            <thead>
                <tr>
                    <th scope="col">Usuario Sugerente</th>
                    <th scope="col">Argumento</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="queja in quejas" :key="queja.id">
                    <td>{{queja.nombre}}</td>
                    <td>{{queja.mensaje}}</td>
                    <td>
                        <span class="material-symbols-outlined btn btn-danger p-1" v-on:click="cerrarQueja(queja.id)">
                        warning
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

        <Alerta mensaje="No se encontraron quejas o sugerencias que mostrar" v-if="alertaNoQuejas"></Alerta>
        
    </div>
    
</template>