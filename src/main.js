import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "./App.vue";
import VueNativeSock from "vue-native-websocket";
import { wsUrl } from "../config/config";
import { file105 } from './utils/fileList';
import analysisByte from './utils/analysis.js'
import Storage from './utils/Storage'

Vue.use(VueNativeSock, wsUrl, {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
});
const socket = Vue.prototype.$socket
socket.onopen = () => {
  Storage.addFile(file105)
};

socket.onmessage = (event) => {
  console.log(event)
  var reader = new FileReader()
  reader.readAsArrayBuffer(event.data)
  reader.onload = function(event) {
    // 文件里的文本会在这里被打印出来
    console.log(analysisByte(event.target.result))
  };
  
  // analysisByte()
};

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
