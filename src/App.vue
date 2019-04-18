<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <!-- <FSLine :isStock="isStock" :stockInfo="stockInfo" :height="height" :width="width" settingItem=""/>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <router-link to="/test">/user/bar</router-link> -->
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import FSLine from "./components/FSLine.vue"

// import Store from "./utils/store.js"

// export default {
//   name: "app",
//   components: {
//     HelloWorld,
//     FSLine
//   },
//   data: ()=>({
//     isStock: false,
//     height: 200,
//     width: 500,
//     num1: {
//       a: 1
//     },
//     stockInfo: {
//       name: '',
//       stockNo: ''
//     },
//     stockCode: '',

//   }),
//   created() {
//     this.stockInfo = Store.selectIndex
//   }
// };
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
