<script>

import Spinner from '../../components/Spinner.vue';
import Alerta   from '../../components/Alerta.vue'
import { ref, watch } from 'vue';
import axios from 'axios';

export default {
  components: {
    Spinner,
    Alerta
  },
  data() {
    return {
      usuario: "",
      correo: "",
      ciudad: "",
      contraseña: "",
      error: false,
      boton: false,
      spinner: false,
      errorRegister: false,
      errorMessage: ""
    }
  },
  
  watch: {
    correo(correo) { this.comprobarBoton(); },
    usuario(usuario) { this.comprobarBoton(); },
    ciudad(ciudad) { this.comprobarBoton(); },
    contraseña(contraseña) { this.comprobarBoton(); }
  },

  methods: {
    limpiarVariables(){
      this.usuario = "";
      this.correo = "";
      this.ciudad = "";
      this.contraseña = "";
    },
    comprobarBoton() {
      if(this.usuario.trim() == "" || !this.validarCorreo(this.correo) || this.ciudad.trim() == "" || this.contraseña.trim() == "") {
        this.boton = false;
        this.error = true;
      } else {
        this.boton = true;
        this.error = false;
        this.errorRegister = false;
      }
    },
    validarCorreo(correo) {
      const regex = /\w+@\w+\.[a-z]/;
      return regex.test(correo);
    },
    guardarRol(rol){
      this.$store.commit('setRol', rol);
    },
    guardarToken(token) {
      this.$store.commit('setToken', token);
    },
    registrarCuenta() {
      const data = { nombre: this.usuario, correo: this.correo, contraseña: this.contraseña, ciudad: this.ciudad };

      this.spinner = true;
      this.errorRegister = false;
      axios
        .post("http://localhost:3000/api/usuario/create", data)
        .then((res) => {
          const data = res.data;
          this.guardarRol(data.user.rol);
          this.guardarToken(data.token);
        })
        .catch((err) => {
          if(err.response){
            this.errorMessage = err.response.data.error;
            this.errorRegister = true;
            this.limpiarVariables();
          }
        })
        .finally(() => {
          this.spinner = false;
          this.limpiarVariables();
        });
    }
  } 
}


</script>



<template>
    <div class="container min-vh-100 d-grid">
        <div class="row justify-content-center h-100 align-items-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header text-center">
                <h3>Registra tu Cuenta</h3>
              </div>
              <div class="card-body">
                <form class="d-grid gap-3" id="loginForm" @submit.prevent="registrarCuenta">
                  <div class="mb-3">
                    <label for="" class="form-label">Usuario</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="usuario">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Correo</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder=""  v-model="correo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Ciudad</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="ciudad">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Contraseña</label>
                    <input type="password" class="form-control"  v-model="contraseña">
                  </div>

                  
                  <div class="alert alert-danger" role="alert" v-if="error">
                    <strong>Hay campos erroneos</strong> revisa haber completado los campos.
                  </div>

                  <Spinner v-if="spinner"/>

                  <Alerta v-if="errorRegister" :mensaje="errorMessage"/>

                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2" v-if="boton">Registrar cuenta</button>
                  <span class="mx-auto"><RouterLink to="/login" class="text-secondary text-decoration-none">Ya tengo una cuenta, quiero iniciar sesion!</RouterLink></span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>