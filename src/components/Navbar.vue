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
              <RouterLink to="/register" class="nav-link">Crear Cuenta</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/login" class="nav-link">Iniciar Sesion</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

</template>