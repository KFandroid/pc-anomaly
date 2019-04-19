import localForage from "localforage";

// 初始化数据
const defaultStore = {
  selectStock: {
    code: "010001",
    stockName: "平安银行",
    stockCode: "000001"
  },
  date: "2019-04-19", // FIXEM 从109取 若无109则自己初始化一个
  firstInit: true
};

class Store {
  constructor() {
    let stockCode;
    for (let key in defaultStore) {
      this[key] = defaultStore[key];
    }
    localForage.getItem("selectStock").then((err, val) => {
      // 获取股票代码
      if (val) {
        stockCode = val.stockCode;
      } else {
        stockCode = defaultStore.selectStock.stockCode;
      }
      // 获取本地股票数据
      localForage.getItem("gloabalData" + stockCode).then((err, val) => {
        let store;
        if (val) {
          store = Object.assign(defaultStore, val);
        } else {
          store = defaultStore;
        }
        console.log(this, store);
        for (let key in store) {
          this[key] = store[key];
        }
      });
    });
  }
}
export default new Store();
