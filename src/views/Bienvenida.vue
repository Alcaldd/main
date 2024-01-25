

<template>
      
          <div class="wrapper wrapper-content animated fadeInRight">
            <div class="ibox-content m-b-sm border-bottom">
              <div class="p-xs">
                <div class="pull-left m-r-md">
                  <i class="fa fa-globe text-navy mid-icon"></i>
                </div>
                <h2>Portada</h2>
              </div>
            </div>

            <div class="ibox-content forum-container" id="forumContainer">
              <div class="forum-title text-center">
                <h3>Objetivos</h3>
                <p class="w-50 mx-auto">En esta plataforma, podras interactuar con usuarios, revisar reseñas y noticias relacionadas al mundo automovilistico.</p>
              </div>

              
              <div class="d-flex">
                <div class="row gap-5 justify-content-center">
                  <RouterLink to="/res/listar" class="card w-25 text-center shadow  text-decoration-none col-md-4">
                    <div class="card-body">
                      <span class="material-symbols-outlined fs-1 mb-3">
                      verified
                      </span>
                      <h4 class="card-title">Reseñas</h4>
                      <p class="card-text">Agrega y revisa reseñas de automoviles, la idea es dar informacion acerca de distintos modelos</p>
                    </div>
                  </RouterLink>
                  <RouterLink to="/foros" class="card w-25 text-center shadow text-decoration-none col-md-4">
                    <div class="card-body">
                      <span class="material-symbols-outlined fs-1 mb-3">
                      mail
                      </span>
                      <h4 class="card-title">Foros</h4>
                      <p class="card-text">Habla con otras personas acerca de distintos topicos, tambien puedes intercambiar ideas y opiniones</p>
                    </div>
                  </RouterLink>
                  <RouterLink to="/articulo/listar" class="card w-25 text-center shadow text-decoration-none col-md-4">
                      <div class="card-body rounded">
                        <span class="material-symbols-outlined fs-1 mb-3">
                        article
                        </span>
                        <h4 class="card-title">Articulos</h4>
                        <p class="card-text">Agrega y enterate de las noticias de la industria automovilistica o informacion relevante</p>
                      </div>
                  </RouterLink>
                </div>
              </div>

            </div>
          </div>

</template>




<style>
body{
    background:#eee;
    }
    
    .white-bg {
        background-color: #ffffff;
    }
    .page-heading {
        border-top: 0;
        padding: 0 10px 20px 10px;
    }
    
    .forum-post-container .media {
      margin: 10px 10px 10px 10px;
      padding: 20px 10px 20px 10px;
      border-bottom: 1px solid #f1f1f1;
    }
    .forum-avatar {
      float: left;
      margin-right: 20px;
      text-align: center;
      width: 110px;
    }
    .forum-avatar .img-circle {
      height: 48px;
      width: 48px;
    }
    .author-info {
      color: #676a6c;
      font-size: 11px;
      margin-top: 5px;
      text-align: center;
    }
    .forum-post-info {
      padding: 9px 12px 6px 12px;
      background: #f9f9f9;
      border: 1px solid #f1f1f1;
    }
    .media-body > .media {
      background: #f9f9f9;
      border-radius: 3px;
      border: 1px solid #f1f1f1;
    }
    .forum-post-container .media-body .photos {
      margin: 10px 0;
    }
    .forum-photo {
      max-width: 140px;
      border-radius: 3px;
    }
    .media-body > .media .forum-avatar {
      width: 70px;
      margin-right: 10px;
    }
    .media-body > .media .forum-avatar .img-circle {
      height: 38px;
      width: 38px;
    }
    .mid-icon {
      font-size: 66px;
    }
    .forum-item {
      margin: 10px 0;
      padding: 10px 0 20px;
      border-bottom: 1px solid #f1f1f1;
    }
    .views-number {
      font-size: 24px;
      line-height: 18px;
      font-weight: 400;
    }
    .forum-container,
    .forum-post-container {
      padding: 30px !important;
    }
    .forum-item small {
      color: #999;
    }
    .forum-item .forum-sub-title {
      color: #999;
      margin-left: 50px;
    }
    .forum-title {
      margin: 15px 0 15px 0;
    }
    .forum-info {
      text-align: center;
    }
    .forum-desc {
      color: #999;
    }
    .forum-icon {
      float: left;
      width: 30px;
      margin-right: 20px;
      text-align: center;
    }
    a.forum-item-title {
      color: inherit;
      display: block;
      font-size: 18px;
      font-weight: 600;
    }
    a.forum-item-title:hover {
      color: inherit;
    }
    .forum-icon .fa {
      font-size: 30px;
      margin-top: 8px;
      color: #9b9b9b;
    }
    .forum-item.active .fa {
      color: #1ab394;
    }
    .forum-item.active a.forum-item-title {
      color: #1ab394;
    }
    @media (max-width: 992px) {
      .forum-info {
        margin: 15px 0 10px 0;
        /* Comment this is you want to show forum info in small devices */
        display: none;
      }
      .forum-desc {
        float: none !important;
      }
    }
    
    
    
    
    
    .ibox {
      clear: both;
      margin-bottom: 25px;
      margin-top: 0;
      padding: 0;
    }
    .ibox.collapsed .ibox-content {
      display: none;
    }
    .ibox.collapsed .fa.fa-chevron-up:before {
      content: "\f078";
    }
    .ibox.collapsed .fa.fa-chevron-down:before {
      content: "\f077";
    }
    .ibox:after,
    .ibox:before {
      display: table;
    }
    .ibox-title {
      -moz-border-bottom-colors: none;
      -moz-border-left-colors: none;
      -moz-border-right-colors: none;
      -moz-border-top-colors: none;
      background-color: #ffffff;
      border-color: #e7eaec;
      border-image: none;
      border-style: solid solid none;
      border-width: 3px 0 0;
      color: inherit;
      margin-bottom: 0;
      padding: 14px 15px 7px;
      min-height: 48px;
    }
    .ibox-content {
      background-color: #ffffff;
      color: inherit;
      padding: 15px 20px 20px 20px;
      border-color: #e7eaec;
      border-image: none;
      border-style: solid solid none;
      border-width: 1px 0;
    }
    .ibox-footer {
      color: inherit;
      border-top: 1px solid #e7eaec;
      font-size: 90%;
      background: #ffffff;
      padding: 10px 15px;
    }
    
    .message-input {
        height: 90px !important;
    }
    .form-control, .single-line {
        background-color: #FFFFFF;
        background-image: none;
        border: 1px solid #e5e6e7;
        border-radius: 1px;
        color: inherit;
        display: block;
        padding: 6px 12px;
        transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
        width: 100%;
        font-size: 14px;
    }
    .text-navy {
        color: #1ab394;
    }
    .mid-icon {
        font-size: 66px !important;
    }
    .m-b-sm {
        margin-bottom: 10px;
    }
</style>