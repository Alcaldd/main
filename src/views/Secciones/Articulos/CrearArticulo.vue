<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  components: {
    editor: Editor,
  },
  data() {
    return {
      titulo: "",
      subtitulo: "",
      contenido: "",
      selectedFile: null,
      URL: "http://localhost:3000/api/articulos/crear",
      URL_IMAGE: "http://localhost:3000/api/articulos/image",
      alertaMessage: "",
      alerta: false,
    };
  },
  methods: {
    changeHandler(event) {
      this.selectedFile = event.target.files[0];
    },

    showContenido() {
      console.log(this.contenido);
    },

    createArticulo() {
      let formData = new FormData();

      if (this.titulo.trim() == "")
        return this.$swal.fire("Error", "Ingrese un titulo", "error");
      if (this.subtitulo.trim() == "")
        return this.$swal.fire("Error", "Ingrese un subtitulo", "error");
      if (this.contenido.trim() == "")
        return this.$swal.fire(
          "Error",
          "Ingrese contenido a su articulo",
          "error"
        );
      if (this.selectedFile == null)
        return this.$swal.fire("Error", "Ingrese una imagen", "error");

      formData.append("titulo", this.titulo);
      formData.append("subtitulo", this.subtitulo);
      formData.append("contenido", this.contenido);
      formData.append("image", this.selectedFile);

      this.axios
        .post(this.URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.alertaMessage = response.data.message;
          this.$swal
            .fire("Exito", this.alertaMessage, "success")
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        })
        .catch((error) => {
          this.alertaMessage = error.response.data.error;
          this.$swal
            .fire("Error", this.alertaMessage, "error")
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        });
    },

    customImageUploadHandler(blobInfo, success, failure) {
      const formData = new FormData();
      formData.append("image", blobInfo.blob(), blobInfo.filename());

      // Realiza una solicitud HTTP para cargar la imagen al servidor
      this.axios
        .post(this.URL_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          // Cuando la imagen se ha cargado con éxito, devuelve la URL de la imagen
          const imageUrl = response.data.url;
          success(imageUrl);
        })
        .catch((error) => {
          // En caso de error, llama a la función 'failure' y muestra un mensaje de error
          failure("Error al cargar la imagen");
        });
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h3>Redacta un articulo</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="createArticulo">
              <div class="mb-3">
                <label for="" class="form-label">Titulo</label>
                <input type="text" class="form-control" v-model="titulo" />
              </div>
              <div class="mb-3">
                <label for="" class="form-label">Subtitulo</label>
                <input type="text" class="form-control" v-model="subtitulo" />
              </div>

              <div class="mb-3">
                <label for="portada" class="form-label"
                  >Escoge una portada</label
                >
                <input
                  type="file"
                  class="form-control"
                  name="portada"
                  v-on:change="changeHandler"
                  aria-describedby="fileHelpId"
                />
              </div>

              <label for="contenido">Redacta el contenido</label>
              <editor
                v-model="contenido"
                api-key="4sy281yb48j3w5jel1fikdndfns9nmj1t7xjd76yyf6ok452"
                :init="{
                  menubar: false,
                  language: 'es_MX',
                  content_style: 'img { max-width: 100%; height: auto; }' ,
                  plugins: 'lists link image emoticons preview imagetools',
                  toolbar:
                    'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image emoticons image_upload_handler',
                  image_dimensions: false,
                  images_upload_url:
                    'http://localhost:3000/api/articulos/image/add',
                  image_upload_handler: customImageUploadHandler,

                  external_plugins: {
                    tiny_mce_wiris:
                      'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js',
                  },
                }"
              />
              <button
                type="submit"
                class="btn btn-primary btn-block w-100 mt-2"
              >
                Crear articulo
              </button>
              <RouterLink
                to="/articulos"
                class="btn btn-danger btn-block w-100 mt-2"
                >Regresar</RouterLink
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
