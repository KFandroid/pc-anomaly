import EventBus from "./pubsub";
import * as utils from "./util.js";
import Store from "./store";
// import { getNumUnit } from "./changeUnit.js";
import { createStaticFileKeyStr, createKeyStr112 } from "./createKeyFn.js";

export const file105 = {
  // 所有股票代码名称信息列表
  type: "105",
  changeCb: data => {
    console.log("data is", data);
    Store.a105 = data;
    Store.stockList = data.data;
    let key = utils.addZeroAfter("a105", 31);
    Store.static105 = true;
    EventBus.emit("loginsuccess");
    //   wx.setStorage({ key, data }) FIXME
    //   this.isHasStaticData()
  },
  createKey: () => {
    let val = createStaticFileKeyStr(105);
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
