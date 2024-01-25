<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark p-3">
      <div class="container">
        <RouterLink to="/" class="navbar-brand">Automotores</RouterLink>
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <ul class="navbar-nav me-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <RouterLink to="/inicio" class="nav-link">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/articulos" class="nav-link">Articulos</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/foros" class="nav-link">Foros</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/notificaciones" class="nav-link">Notificaciones</RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" v-on:click="cerrarSesion">Cerrar Sesion</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>


<script>
export default {
  data() {
    return {
      auth: false
    }
  },
  methods: {
    cerrarSesion() {
      this.$store.commit('logout');
      this.$router.push({path: '/'});
    }
  }
}
</script>