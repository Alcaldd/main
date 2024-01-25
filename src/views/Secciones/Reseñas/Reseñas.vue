<template>
  
  <div class="ibox-content forum-container" id="forumContainer">
    <div class="forum-title text-center mb-5">
      <h3>¿Que gustas hacer?</h3>
    </div>

        <div class="d-grid mx-auto">
          <div class="row gap-5">

            <div class="card radius-10 border-start border-0 border-3 border-info shadow col-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="mx-auto">
                    <h4 class="my-1 text-info">Escribir reseña</h4>
                    <p class="mb-0 text-secondary">Escribe tu reseña y cuentale al mundo tus opiniones</p>
                    <RouterLink to="/res/crear" class="btn btn-info text-white mt-2 w-100">Escribe ahora</RouterLink>
                  </div>
                </div>
              </div>
            </div>

        
            <div class="card radius-10 border-start border-0 border-3 border-success shadow col-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="mx-auto">
                    <h4 class="my-1 text-success">Revisar reseñas</h4>
                    <p class="mb-0 text-secondary">Enterate y chequea las reseñas de otros usuarios</p>
                    <RouterLink to="/res/listar" class="btn btn-success mt-2 w-100">Analizar ahora</RouterLink>
                  </div>
                </div>
              </div>
            </div>

      </div>
    </div>


    
  </div>

</template>
