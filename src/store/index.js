import Vuex from "vuex";


export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    rol: localStorage.getItem("rol") || null,
  },
  mutations: {
    logout(state) {
      localStorage.removeItem("token");
      location.reload();
    },
    setToken(state, newToken) {
      localStorage.removeItem("token");
      localStorage.setItem("token", newToken);
      location.reload();
    },
    setRol(state, newRol) {
      localStorage.removeItem("rol");
      localStorage.setItem("rol", newRol);
    }
  },
  actions: {},
  getters: {
    getUserToken(state){
      return state.token;
    },
    getUserRol(state){
      return state.rol;
    },
    isLoggedIn(state) {
      return !!state.token;
    },
  },
});