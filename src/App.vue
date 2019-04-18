<template>
  <div id="app">
    
    <Login/>
    <!-- <FSLine :isStock="isStock" :stockInfo="stockInfo" :height="height" :width="width" settingItem=""/> -->
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import FSLine from "./components/FSLine.vue"
import Login from "./components/Login.vue"
import Store from "./utils/store.js"


export default {
  name: "app",
  components: {
    HelloWorld,
    FSLine,
    Login
  },
  data: ()=>({
    isStock: false,
    height: 200,
    width: 500,
    num1: {
      a: 1
    },
    stockInfo: {
      name: '',
      stockNo: ''
    },
    stockCode: '',

  }),
  created() {
    this.stockInfo = Store.selectIndex
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
