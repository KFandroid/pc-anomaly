import EventBus from './pubsub'
import * as utils from './util.js'
import Store from './store'
import { createStaticFileKeyStr } from './createKeyFn.js'

export const file105 = { // 所有股票代码名称信息列表
    type: '105',
    changeCb: (data) => {
        Store.a105 = data
        Store.stockList = data.data
      let key = utils.addZeroAfter('a105', 31)
      Store.static105 = true
    EventBus.emit('loginsuccess')
    //   wx.setStorage({ key, data }) FIXME
    //   this.isHasStaticData()
    },
    createKey: () => {
      let val = createStaticFileKeyStr(105)
      return val
    }
  }