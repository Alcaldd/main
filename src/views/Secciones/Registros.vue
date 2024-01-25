<script>
import axios from "axios";
export default {
  data() {
    return {
      registros: [],
      URL_REGISTROS: "http://localhost:3000/api/registros",
    };
  },
  created: function () {
    this.getRegistros();
  },
  methods: {
    getRegistros() {
      axios
        .get(this.URL_REGISTROS, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.registros = response.data;
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<template>
  <div class="table-responsive">
    <table class="table table-light">
      <thead>
        <tr class="text-center">
          <th scope="col">Sancionado</th>
          <th scope="col">Moderador</th>
          <th scope="col">Tipo</th>
          <th scope="col">Razon</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="registro in registros" :key="registro.id" class="text-center">
          <td>{{ registro.nombre_sancionado }}</td>
          <td>{{ registro.nombre_moderador }}</td>
          <td>{{ registro.tipo_sancion }}</td>
          <td>{{ registro.razon }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
