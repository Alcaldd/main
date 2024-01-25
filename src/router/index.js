import { createRouter, createWebHistory } from "vue-router";

// Notificaciones

import Notificaciones from "../views/Secciones/Notificaciones.vue";

// Registros

import Registros from "../views/Secciones/Registros.vue";

// Homepage
import Inicio from "../views/Inicio.vue";
import Bienvenida from "../views/Bienvenida.vue";

// Componentes de Moderacion

import Usuarios from "../views/Administracion/Usuarios.vue";
import Quejas from "../views/Administracion/Quejas.vue";
import QuejasUsuario from "../views/Secciones/Quejas.vue";
import Reportes from "../views/Administracion/Reportes.vue";
import Anuncios from "../views/Administracion/Anuncios.vue";

// Componentes de Foros

import Foros from "../views/Secciones/Foros/Foros.vue";
import VerForo from "../views/Secciones/Foros/VerForo.vue";
import VerReglas from "../views/Secciones/Foros/VerReglas.vue";

// Componentes de Reseña

import Reseñas from "../views/Secciones/Reseñas/Reseñas.vue";
import Reseña from "../views/Secciones/Reseñas/Reseña.vue";
import VerReseña from "../views/Secciones/Reseñas/VerReseña.vue";
import CrearReseña from "../views/Secciones/Reseñas/CrearReseña.vue";

// Componentes de las Listas

import Listas from "../views/Secciones/Listas/Listas.vue";
import VerLista from "../views/Secciones/Listas/VerLista.vue";
import ListarListas from "../views/Secciones/Listas/ListarListas.vue";
import CrearLista from "../views/Secciones/Listas/CrearLista.vue";

// Articulos Componentes
import Articulos from "../views/Secciones/Articulos/Articulos.vue";
import Articulo from "../views/Secciones/Articulos/Articulo.vue";
import VerArticulos from "../views/Secciones/Articulos/VerArticulos.vue";
import CrearArticulo from "../views/Secciones/Articulos/CrearArticulo.vue";

// Versus Componentes
import Versus from "../views/Secciones/Versus/Versus.vue";
import VerVersus from "../views/Secciones/Versus/VerVersus.vue";
import CrearVersus from "../views/Secciones/Versus/CrearVersus.vue";

// Componentes de Sesionado
import Login from "../views/Sesion/Login.vue";
import Register from "../views/Sesion/Register.vue";
import ChangePassword from "../views/Sesion/Change.vue";

import store from "../store/index.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/inicio",
      name: "inicio",
      component: Inicio,
      meta: { requiresAuth: true },
    },
    {
      path: "/",
      name: "bienvenida",
      component: Bienvenida,
      meta: { requiresAuth: false },
    },
    {
      path: "/admin/anuncios",
      name: "anuncios",
      component: Anuncios,
      meta: { requiresAuth: true },
    },
    {
      path: "/notificaciones",
      name: "notifications",
      component: Notificaciones,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/registros",
      name: "registros",
      component: Registros,
      meta: { requiresAuth: true },
    },
    {
      path: "/foros",
      name: "foros",
      component: Foros,
      meta: { requiresAuth: false },
    },
    {
      path: "/foro/ver/:id",
      name: "forosver",
      component: VerForo,
      meta: { requiresAuth: false },
    },
    {
      path: "/admin/regla/listar",
      name: "reglasver",
      component: VerReglas,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/usuarios",
      name: "usuarios",
      component: Usuarios,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/quejas",
      name: "quejas",
      component: Quejas,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/reportes",
      name: "reportes",
      component: Reportes,
      meta: { requiresAuth: true },
    },
    {
      path: "/res/listar",
      name: "reseñaver",
      component: VerReseña,
      meta: { requiresAuth: false },
    },
    {
      path: "/res/crear",
      name: "reseñacrear",
      component: CrearReseña,
      meta: { requiresAuth: true },
    },
    {
      path: "/res/ver/:id",
      name: "reseñaarticulo",
      component: Reseña,
      meta: { requiresAuth: false },
    },
    {
      path: "/res",
      name: "reseñas",
      component: Reseñas,
      meta: { requiresAuth: true },
    },
    {
      path: "/articulos",
      name: "articulos",
      component: Articulos,
      meta: { requiresAuth: true },
    },
    {
      path: "/change/password",
      name: "change",
      component: ChangePassword,
      meta: { requiresAuth: false },
    },
    {
      path: "/articulo/crear",
      name: "creararticulo",
      component: CrearArticulo,
      meta: { requiresAuth: true },
    },
    {
      path: "/articulo/ver/:id",
      name: "articulo",
      component: Articulo,
      meta: { requiresAuth: false },
    },
    {
      path: "/listas",
      name: "listas",
      component: Listas,
      meta: { requiresAuth: true },
    },
    {
      path: "/listas/ver",
      name: "listarlistas",
      component: ListarListas,
      meta: { requiresAuth: true },
    },
    {
      path: "/listas/ver/:id",
      name: "listaver",
      component: VerLista,
      meta: { requiresAuth: true },
    },
    {
      path: "/listas/crear",
      name: "listacrear",
      component: CrearLista,
      meta: { requiresAuth: true },
    },
    {
      path: "/versus",
      name: "versus",
      component: Versus,
      meta: { requiresAuth: true },
    },
    {
      path: "/versus/crear",
      name: "crearversus",
      component: CrearVersus,
      meta: { requiresAuth: true },
    },
    {
      path: "/versus/:id",
      name: "verversus",
      component: VerVersus,
      meta: { requiresAuth: true },
    },
    {
      path: "/articulo/listar",
      name: "listararticulos",
      component: VerArticulos,
      meta: { requiresAuth: false },
    },
    {
      path: "/quejas",
      name: "quejasysugerencias",
      component: QuejasUsuario,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some((record) => record.meta.requiresAuth);
  if (rutaProtegida && !store.getters.isLoggedIn) {
    next({ name: "login" });
  } else if (!rutaProtegida && store.getters.isLoggedIn) {
    switch (to.name) {
      case "login":
        next({ name: "inicio" });
        break;
      case "register":
        next({ name: "inicio" });
        break;
      case "change":
        next({ name: "inicio" });
        break;
      case "articulo":
        next();
        break;
      case "reseñaver":
        next();
        break;
      case "reseñaarticulo":
        next();
        break;
      case "foros":
        next();
      case "forosver":
        next();
      case "listararticulos":
        next();
        break;
      case "bienvenida":
        next({ name: "inicio" });
        break;
      default:
        break;
    }
  } else {
    next();
  }
});

export default router;
