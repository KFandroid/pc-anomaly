import { EventBus } from "./pubsub.js";
import * as utils from "./util.js";
import Store from "./store";
import localForage from "localforage";
// import { getNumUnit } from "./changeUnit.js";
import { createStaticFileKeyStr, createKeyStr112 } from "./createKeyFn.js";

export const file109 = {
  // 交易日历
  type: "109",
  changeCb: data => {
    let key = utils.addZeroAfter("a109", 31);
    let newTradeDate = data.data[data.data.length - 1];

    Store.latestDate = newTradeDate;
    //   this.setData({
    //     date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2),
    //     date2: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
    //   })
    Store.static109 = true;
    localForage.setItem(key, data);
    EventBus.$emit("loginsuccess", {});
    //   this.isHasStaticData()
  },
  createKey: () => {
    let val = createStaticFileKeyStr(109);
    return val;
  }
  // isCallMainBack: false
};

export const file105 = {
  // 所有股票代码名称信息列表
  type: "105",
  changeCb: data => {
    console.log("data is", data);
    Store.a105 = data;
    Store.stockList = data.data;
    let key = utils.addZeroAfter("a105", 31);
    Store.static105 = true;
    localForage.setItem(key, data);
    EventBus.$emit("loginsuccess", {});

    //   wx.setStorage({ key, data }) FIXME
    //   this.isHasStaticData()
  },
  createKey: () => {
    let val = createStaticFileKeyStr(105);
    return val;
  }
};

export const file106 = {
  // 项目名称对应表
  type: "106",
  changeCb: data => {
    let itemArr = [];
    let a106 = data.data;
    for (let i = 0; i < a106.length; i++) {
      let cno = a106[i].no;
      let temp = {};
      if (a106[i].hasOwnProperty("children")) {
        let children = a106[i].children;
        for (let j = 0; j < children.length; j++) {
          temp = Object.assign({}, children[j]);
          temp.cno = "" + cno + children[j].cno;
          temp.name = a106[i].name;
          temp.code = utils.addZero(cno, 3) + utils.addZero(children[j].cno, 3);
          temp.totalName = "" + temp.name + "-" + temp.cname;
          itemArr.push(temp);
        }
      }
    }
    Store.static106 = true;
    let key = utils.addZeroAfter("a106", 31);
    localForage.setItem(key, data);
    Store.t106 = data;
    Store.a106 = data;
    EventBus.$emit("loginsuccess", {});

    //   this.isHasStaticData()
  },
  createKey: () => {
    let val = createStaticFileKeyStr(106);
    return val;
  }
};

export const file112 = {
  type: "112",
  intervalTime: 10000,
  changeCb: function(data) {
    let averagePrice = 0;
    let maxDeal = 0;
    let beforeDeal = 0;
    let beforeDealN = 0;
    let count = 0;
    let tempData = Object.assign({}, data);
    if (!data.data.length) {
      return;
    }
    tempData.data = [].concat(this.drawData.data);
    if (tempData.data.length === 0) {
      tempData.data = tempData.data.concat(data.data);
    } else {
      let equalIndex = 0;
      for (let i = 0; i < data.data.length; i++) {
        let lastData = tempData.data[tempData.data.length - 1];
        if (parseInt(data.data[i].date) === parseInt(lastData.date)) {
          equalIndex = i;
          break;
        }
      }
      tempData.data[tempData.data.length - 1] = Object.assign(
        {},
        data.data[equalIndex]
      );
      tempData.data = tempData.data.concat(data.data.slice(equalIndex + 1));
    }
    let val = createKeyStr112(112, this.stockCode);

    Store["a" + val.storage] = Object.assign({}, tempData);
    for (let i = 0, length = tempData.data.length; i < length && i < 256; i++) {
      tempData.data[i].dealA = tempData.data[i].da - beforeDeal;
      tempData.data[i].dealN = tempData.data[i].dn - beforeDealN;
      if (tempData.data[i].dealA >= maxDeal) {
        maxDeal = tempData.data[i].dealA;
      }
      beforeDeal = tempData.data[i].da;
      beforeDealN = tempData.data[i].dn;
      tempData.data[i];
      if (parseInt(tempData.data[i].date) >= 930) {
        averagePrice =
          parseFloat(tempData.data[i].dealPrice) + parseFloat(averagePrice);
        count = count + 1;
        tempData.data[i].averagePrice = (averagePrice / count).toFixed(2);
        tempData.data[i].averageDa = Math.round(
          parseFloat(tempData.data[i].da) / count
        );
      }
    }
    tempData.maxDeal = maxDeal;
    this.tempData = tempData;

    // if (!this.data.showCurrentInfo) {
    //   let lastData = Object.assign({}, tempData.data[tempData.data.length - 1]);
    //   lastData.date = lastData.date.replace(/(\d{2})(\d{2})/, "$1:$2");
    //   lastData.price = getNumUnit(lastData.price);
    //   lastData.dealA = getNumUnit(lastData.dealA);
    //   lastData.dealN = getNumUnit(lastData.dealN);
    //   lastData.rise =
    //     ((parseFloat(lastData.dealPrice) - parseFloat(tempData.pcp)) /
    //       parseFloat(tempData.pcp)) *
    //     100;
    //   lastData.rise = lastData.rise.toFixed(2);

    //   this.setData({
    //     currentInfo: lastData
    //   });
    // }
    debugger;
    return tempData;
  },
  createKey: function() {
    let val = createKeyStr112(112, this.stockCode);

    if (Store["a" + val.storage]) {
      val = createKeyStr112(
        112,
        this.stockCode,
        Store["a" + val.storage].totalPage
      );
    }
    return val;
  }
};
