<script>
import Spinner from '../../../components/Spinner.vue'
export default {
    components: {Spinner},
    data() {
        return {
            versus: [],
            URL: "http://localhost:3000/api/versus/"
        }
    },
    created: function () { this.callApiVersus() },
    methods: {
        callApiVersus(){
            this.axios.get(this.URL, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
            .then((response) => {
                this.versus = response.data;
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>


<template>

    <div class="container">

        <div class="text-center my-2 p-3 w-50 mx-auto">
            <h1>Listado de Versus</h1>
            <p>Enterate de comparaciones y enfrentamientos de vehiculos y vota por el que mas te guste y cumpla tus expectativas</p>
            <RouterLink to="/versus/crear" class="btn btn-block btn-success mx-auto w-75">Crear nuevo versus</RouterLink>
        </div>

        <Spinner v-if="versus.length == 0"></Spinner>

        <div v-if="versus.length > 0">
            <div class="cards-container">
                <div class="card" v-for="versus in versus" :key="versus.versus_id">
                    <img class="card-img-top" :src="versus.imagen" alt="Portada Versus">
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ versus.coche1_titulo }} VS {{ versus.coche2_titulo }}</h5>
                        <RouterLink :to="{ name: 'verversus', params: {id: versus.versus_id }}" class="btn btn-block w-100 btn-danger">Revisar</RouterLink>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>

<style scoped>
.cards-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 25px;
}

</style>