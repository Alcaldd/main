<script>
export default {
    data(){
        return {
            mensaje: "",
            URL: "http://localhost:3000/api/quejas/crear"
        }
    },

    methods: {
        enviarQueja(){
            const data = {mensaje: this.mensaje}
            this.axios.post(this.URL, data, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                            this.$swal.fire(
                            'Enviado',
                            response.data.message,
                            'success'
                            )
                        }).catch(error => {
                            this.$swal.fire(
                                'Error',
                                error.response.data.error,
                                'error'
                            )
                        })
        }
    }
}

</script>

<template>
    
    <div class="mb-3 bg-light rounded p-3 my-5 d-flex flex-column align-items-center w-75 mx-auto gap-3">
        <h5>Escribe tu sugerencia e idea, para mejorar nuestros sistemas</h5>
        <textarea id="autoColsTextarea" class="auto-cols" placeholder="Escribe tu sugerencia o queja" v-model="mensaje"></textarea>
        <button class="btn-primary btn w-100 mt-2" v-on:click="enviarQueja">Enviar sugerencia</button>
    </div>


</template>

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