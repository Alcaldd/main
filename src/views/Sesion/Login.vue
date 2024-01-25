<script>
import Spinner from '../../components/Spinner.vue';
import Alerta from '../../components/Alerta.vue'
export default {
  components: {
    Spinner,
    Alerta
  },
  data() {
    return {
      correo: null,
      contraseña: null,
      correoValido: false,
      contraseñaValida: false,
      mostrarBoton: false,
      spinner: false,
      error: false,
      errorMessage: ""
    };
  },
  watch: {
    correo(correo) {
      if(this.validarCorreo(correo)) {
        this.correoValido = false;
      } else { this.correoValido = true; }
      this.comprobarBoton();
    },
    contraseña(contraseña) {
      if(contraseña.trim() != ""){
        this.contraseñaValida = true; 
      } else {
        this.contraseñaValida = false;
      }
      this.comprobarBoton();
    }
  },
  methods: {
    comprobarBoton() {
      this.mostrarBoton = !this.correoValido && this.contraseñaValida;
      this.error = false;
    },
    validarCorreo(correo) {
      const regex = /\S+@\S+\.\S+/;
      return regex.test(correo);
    },
    guardarRol(rol){
      this.$store.commit('setRol', rol);
    },
    guardarToken(token) {
      this.$store.commit('setToken', token);
    },
    loguearCuenta() {
      const data = { correo: this.correo, contraseña: this.contraseña };
      this.spinner = true;
      this.mostrarBoton = false;
      this.error = false;
      this.axios
                  .post("http://localhost:3000/api/usuario/login", data)
                   .then(res => {
                    const data = res.data;
                    this.guardarRol(data.user.rol);
                    this.guardarToken(data.token);
                   })
                   .catch(err => {
                    if(err.response){
                      this.error = true;
                      this.errorMessage = err.response.data.error;
                    }
                   })
                   .finally(() => {
                      this.spinner = false;
                   })
    }
  }
}
</script>


<template>
    <div class="container min-vh-100 d-grid">
        <div class="d-flex row justify-content-center h-100 align-items-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header text-center">
                <h3>Inicia Sesion</h3>
              </div>
              <div class="card-body">
                <form class="d-grid gap-3" id="loginForm" @submit.prevent="loguearCuenta">
                  <div class="mb-3">
                    <label for="" class="form-label">Correo</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="correo">
                  </div>

                  <div class="alert alert-danger" role="alert" v-if="correoValido">
                    <strong>Hay campos erroneos</strong> revisa que escribiste bien tu correo.
                  </div>

                  <div class="mb-3">
                    <label for="" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" v-model="contraseña">
                  </div>

                  <Spinner v-if="spinner"/>

                  <Alerta v-if="error" :mensaje="errorMessage"/>
                  
                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2" v-if="mostrarBoton">Iniciar Sesion</button>
                  <span class="mx-auto"><RouterLink to="/change/password" class="text-secondary text-decoration-none">Olvide mi contraseña!</RouterLink></span>
                  <span class="mx-auto"><RouterLink to="/register" class="text-secondary text-decoration-none">No tengo una cuenta, quiero registrarme!</RouterLink></span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>