<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <FSLine :isStock="isStock" :stockinfo="stockInfo" :height="height" :width="width" settingItem=""/>
    <button @click="upStock">向上翻股票</button>
    <button @click="downStock">向下翻股票</button>
  </div>
</template>

<script>
import localForage from "localforage"
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import FSLine from "@/components/FSLine.vue";
import Store from "@/utils/store.js"
import storage from "@/utils/Storage.js"
import { addZeroAfter } from "@/utils/util.js"
import { EventBus } from "@/utils/pubsub.js"
import { debug } from 'util';

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
      code: ''
    },
    code: '',
    rwLocal: true,
  }),
  created() {
    
    let selectIndex = Store.selectStock
    console.log('11111', selectIndex)
    this.stockInfo = Object.assign({}, selectIndex)
    this.code = selectIndex.code
  },
  methods: {
    upStock() {
      this.changeStock(-1)
    },
    downStock() {
      this.changeStock(1)
    },
    changeStock(direction) {
      // hasDealAllData验证所有的数据都已经返回， rwLocal锁住本地
      if (!this.hasDealAllData() || !this.rwLocal) {
        return
      }
      this.rwLocal = false
      let index
      let globalData = Object.assign({}, Store)
      let unableKeys = ['a101', 'a108', 'a126', 'a128', 'a129'] // 可复用的类型
      function deleteGlobalData(key) {
      delete globalData[key]
      let key2 = addZeroAfter(key, 31)
      delete globalData[key2]
    }
    // 过滤出应该复制的数据类型
    let keys = Object.keys(Store)
      .filter(key => key.indexOf(this.stockCode) < 0 && unableKeys.indexOf(key.slice(0, 4)) < 0)
      for (let i = 0; i < keys.length; i++) {
      deleteGlobalData(keys[i])
    }
      localForage.setItem(this.code, globalData)
      let stockList = Store.stockList
      console.log('stockList is', stockList)
      for (let i = 0; i < stockList.length; i++) {
        if (stockList[i].code === this.stockInfo.code) {
          index = i
        }
      }
      let nextIndex = (index + direction + stockList.length) % stockList.length
      let currentStock = stockList[nextIndex]
      localForage.setItem('selectStock', currentStock)
      this.initData(currentStock)
      let data = {}
      localForage.getItem(currentStock.code).then((err, val) => {
        if(val) {
          Store = Object.assign({}, Store, data)
        }
      })
    },
    init(stockInfo) {
    this.stockChanged = true
    this.stockInfo = Object.assign({}, stockInfo)
    
    if (Object.keys(stockInfo).length > 0) {
      // this.initTabSelect()
      // this.setData({
      //   stockCode: addZero(stockInfo.code, 6),
      //   stockInfo: {
      //     name: stockInfo.stockName,
      //     stockNo: stockInfo.stockCode
      //   }
      // })
    }
  },
    initData(stock) {
      let stockInfo = stock
      this.init(stockInfo)
      storage.clearFile()
      // 清空完原先的请求和数据后再发送
      EventBus.$emit("changestock", {stockInfo})
      // this.clearData() 暂时没有一步也许以后会有
    },
    hasDealAllData() {
    if (storage) {
      return storage.hasDealData()
    } else {
      return false
    }
  },
  }
};
</script>
