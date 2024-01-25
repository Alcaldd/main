import { reactive } from "vue";
import { io } from "socket.io-client";
import * as Tools from './env.js'

export const state = reactive({
  messages: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = (Tools.STATUS) ? Tools.API : Tools.DEV;

export const socket = io(URL)
