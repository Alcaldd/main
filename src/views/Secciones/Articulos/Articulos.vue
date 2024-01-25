<template>
  
  <div class="ibox-content forum-container" id="forumContainer">
    <div class="forum-title text-center mb-5">
      <h3>Comparte e informate.</h3>
    </div>

        <div class="d-grid mx-auto">
          <div class="row gap-5">

            <div class="card radius-10 border-start border-0 border-3 border-danger shadow col-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="mx-auto">
                    <h4 class="my-1 text-danger">Escribir articulo</h4>
                    <p class="mb-0 text-secondary">Escribe un articulo informativo y compartelo</p>
                    <RouterLink to="/articulo/crear" class="btn btn-danger text-white mt-2 w-100">Escribe ahora</RouterLink>
                  </div>
                </div>
              </div>
            </div>

        
            <div class="card radius-10 border-start border-0 border-3 border-warning shadow col-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="mx-auto">
                    <h4 class="my-1 text-warning">Revisar articulos</h4>
                    <p class="mb-0 text-secondary">Busca y enterate de las ultimas noticias y novedades</p>
                    <RouterLink to="/articulo/listar" class="btn btn-warning text-white mt-2 w-100">Revisar ahora</RouterLink>
                  </div>
                </div>
              </div>
            </div>

      </div>
    </div>


    
  </div>

</template>
