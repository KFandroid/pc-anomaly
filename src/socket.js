import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
import Storage from "./utils/Storage";
import analysisByte from "./utils/analysis.js";
import { file105, file109, file106 } from "./utils/fileList";
import { wsUrl } from "../config/config";

export const createConnect = () => {
  Vue.use(VueNativeSock, wsUrl, {
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
  });
  const socket = Vue.prototype.$socket;
  socket.onopen = () => {
    Storage.addFile(file109);
    Storage.addFile(file106);
    Storage.addFile(file105);
  };

  socket.onmessage = event => {
    console.log(event);
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.data);
    reader.onload = function(event) {
      // 文件里的文本会在这里被打印出来
      let data = analysisByte(event.target.result);
      Storage.observeFileChange(data.type, data);
    };

    // analysisByte()
  };
};
