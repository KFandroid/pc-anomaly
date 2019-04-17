const defaultStore = {
  selectStock: {
    code: "010001",
    stockName: "平安银行",
    stockCode: "000001"
  },
  date: "2019-04-15"
};

class Store {
  constructor() {
    for (let key in defaultStore) {
      this[key] = defaultStore[key];
    }
  }
}

export default new Store();
