<script>
import Spinner from "../../components/Spinner.vue";
import Alerta from "../../components/Alerta.vue";
export default {
  components: {
    Spinner,
    Alerta,
  },
  data() {
    return {
      correo: null,
      correoValido: false,
      mostrarBoton: false,
      spinner: false,
      codeStage: true,
      passwordStage: false,
      error: false,
      code: "",
      contra: "",
      errorMessage: "",
      URL: "http://localhost:3000/api/usuario/"
    };
  },
  watch: {
    correo(correo) {
      if (this.validarCorreo(correo)) {
        this.correoValido = false;
      } else {
        this.correoValido = true;
      }
      this.comprobarBoton();
    },
  },
  methods: {
    comprobarBoton() {
      this.mostrarBoton = this.correoValido != true;
      this.error = false;
    },
    validarCorreo(correo) {
      const regex = /\S+@\S+\.\S+/;
      return regex.test(correo);
    },
    changePass(){
      if(this.code.trim() == '' && this.contra.trim() == ''){
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: "No puedes dejar campos vacios",
        });
        return;
      }
      this.axios.post(this.URL + "change/pass", {codigo: this.code, newPass: this.contra})
                .then(res => {
                  if(res.data.success){
                    this.$swal.fire({
                      icon: "success",
                      title: "Contraseña cambiada",
                      text: "Se ha cambiado tu contraseña",
                    });
                    this.$router.push("/login");
                  }
                })
                .catch(err => {
                  this.$swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.error,
                  });
                })
    },
    sendCode() {
        this.axios.post(this.URL + "recover", {correo: this.correo})
        .then((response) => {
            if (response.data.success) {
                this.$swal.fire({
                    icon: "success",
                    title: "Codigo enviado",
                    text: "Se ha enviado un codigo a tu correo",
                });
            }
            this.codeStage = false;
            this.passwordStage = true;
        }).catch((error) => {
            this.$swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.error,
            })
        });
    },
  },
};
</script>

<template>
  <div class="container min-vh-100 d-grid">
    <div class="d-flex row justify-content-center h-100 align-items-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h3>Cambia tu contraseña</h3>
          </div>
          <div class="card-body">
            <form
              class="d-grid gap-3"
              id="loginForm"
            >
              <div class="sendCodeStage" v-if="codeStage">
                <div class="mb-3">
                  <label for="" class="form-label">Correo</label>
                  <input
                    type="email"
                    class="form-control"
                    aria-describedby="helpId"
                    placeholder=""
                    v-model="correo"
                  />
                </div>

                <div
                  class="alert alert-danger"
                  role="alert"
                  v-if="correoValido"
                >
                  <strong>Hay campos erroneos</strong> revisa que escribiste
                  bien tu correo.
                </div>

                <Spinner v-if="spinner" />

                <Alerta v-if="error" :mensaje="errorMessage" />

                <button
                  type="button"
                  class="btn btn-primary btn-block w-100 my-2"
                  v-on:click="sendCode"
                  v-if="mostrarBoton"
                >
                  Recibir codigo
                </button>
                <span class="mx-auto"
                  ><RouterLink
                    to="/login"
                    class="text-secondary text-decoration-none"
                    >Recorde mi contraseña!</RouterLink
                  ></span
                >
              </div>

              <div class="sendCodeStage" v-if="!codeStage">
                <div class="mb-3">
                  <label for="" class="form-label">Codigo</label>
                  <input
                    type="text"
                    class="form-control"
                    aria-describedby="helpId"
                    placeholder="El codigo recibido ej: 728328"
                    v-model="code"
                  />
                </div>

                <div
                  class="alert alert-danger"
                  role="alert"
                  v-if="correoValido"
                >
                  <strong>Hay campos erroneos</strong> revisa que escribiste
                  bien tu correo.
                </div>

                <div class="mb-3">
                  <label for="" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    aria-describedby="helpId"
                    placeholder=""
                    v-model="contra"
                  />
                </div>

                <Spinner v-if="spinner" />

                <Alerta v-if="error" :mensaje="errorMessage" />

                <button
                  type="button"
                  class="btn btn-primary btn-block w-100 my-2"
                  v-on:click="changePass"
                >
                  Reestablecer contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
