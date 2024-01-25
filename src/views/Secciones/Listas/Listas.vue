<template>
  
    <div class="ibox-content forum-container" id="forumContainer">
      <div class="forum-title text-center mb-5">
        <h3>¿Que gustas hacer?</h3>
      </div>
  
          <div class="d-grid mx-auto">
            <div class="row gap-5">
  
              <div class="card radius-10 border-start border-0 border-3 border-dark shadow col-sm">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="mx-auto">
                      <h4 class="my-1 text-dark">Crear nueva lista</h4>
                      <p class="mb-0 text-secondary">Crea tu top de autos y muestra tus opiniones al foro</p>
                      <RouterLink to="/listas/crear" class="btn btn-dark text-white mt-2 w-100">Crear ahora</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
  
          
              <div class="card radius-10 border-start border-0 border-3 border-primary shadow col-sm">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="mx-auto">
                      <h4 class="my-1 text-primary">Revisar Listas</h4>
                      <p class="mb-0 text-secondary">Busca y revisa las listas creadas por usuarios</p>
                      <RouterLink to="/listas/ver" class="btn btn-primary mt-2 w-100">Analizar ahora</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
  
        </div>
      </div>
  
  
      
    </div>
  
</template>

