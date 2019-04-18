<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <FSLine :isStock="isStock" :stockInfo="stockInfo" :height="height" :width="width" settingItem=""/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import FSLine from "@/components/FSLine.vue";
import Store from "@/utils/store.js"

export default {
  name: "home",
  components: {
    HelloWorld,
    FSLine
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
