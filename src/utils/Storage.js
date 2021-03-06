import Store from "./store";
import Vue from "vue";
class WXFile {
  constructor(file, storage) {
    this.type = file.type;
    // 请求的数据都返回了
    this.isReturn = true;
    this.changeCb = data => {
      file.changeCb.bind(file.ctx)(data);
      this.isReturn = true;
    };
    this.createKey = () => {
      // 每create一次key必定要返回一次数据，不论是本地还是线上的
      this.isReturn = false;
      return file.createKey.bind(file.ctx)();
    };
    // if(file.hasOwnProperty('intervalTime')) {
    this.intervalTime = file.intervalTime || 0; // FIXME
    // }
    this.updateHandle = null;
    if (this.intervalTime) {
      this.updateHandle = setInterval(() => {
        let key = this.createKey();
        storage.getData(key);
      }, this.intervalTime);
    }
  }

  // this.isCallMainBack = file.isCallMainBack

  deleteFile() {
    if (this.updateHandle) {
      clearInterval(this.updateHandle);
    }
  }
}

class Storage {
  /**
   *
   * @param fileList
   * @param fileList
   */
  constructor(fileList) {
    this.fileList = [];
    this.fileTypeList = [];
    this.upDateHandle = [];
    for (let i = 0; i < fileList.length; i++) {
      this.fileList.push(new WXFile(fileList[i], this));
      this.fileTypeList.push("" + fileList[i].type);
    }
  }
  /**
   * 是否所有请求的数据都返回回来了
   */
  hasDealData() {
    let flag = true;
    this.fileList.forEach(file => {
      if (!file.isReturn) {
        flag = false;
      }
    });
    return flag;
  }
  /**
   *
   * @param {Object} file
   */
  addFile(file) {
    if (this.fileTypeList.indexOf(file.type) > 0) {
      return;
    }
    let newFile = new WXFile(file, this);
    let key = newFile.createKey();
    this.fileList.push(newFile);
    this.fileTypeList.push("" + file.type);
    this.getData(key);
  }

  deleteFile(fileType) {
    fileType = "" + fileType;
    let index = this.fileTypeList.indexOf(fileType);

    if (index > -1) {
      let file = this.fileList[index];

      file.deleteFile();
      this.fileTypeList.splice(index, 1);
      this.fileList.splice(index, 1);
    }
  }

  clearFile() {
    let fileList = [].concat(this.fileList);
    fileList.forEach(file => {
      this.deleteFile(file.type);
    });
  }

  init() {
    this.fileList.forEach(file => {
      let key = file.createKey();
      this.getData(key);
    });
  }

  getFileData() {
    this.fileList.forEach(file => {
      let key = file.createKey();
      this.getData(key);
    });
  }
  /**
   *
   * @param {String} fileType
   * @param {Object} data
   */
  observeFileChange(fileType, data) {
    let fileIndex = this.fileTypeList.indexOf(fileType);
    if (fileIndex > -1) {
      this.setAData(fileType, data);
      let changeData = this.fileList[fileIndex].changeCb(data);
      if (changeData) {
        this.setAData(fileType, changeData);
      }
    }
  }

  /**
   * 将数据赋值到正在运行的页面中
   * @param {String} key
   * @param {Object} data
   */
  setAData(key, data) {
    function createKey(data) {
      return (
        key + data.code + data.page + data.stockCode + data.date + data.sortCode
      );
    }

    if (data.page === data.totalPage && parseInt(data.totalPage) > 0) {
      let pageTable = Store["pageTable" + data.stockCode] || {};
      pageTable[key] = data.totalPage;
      Store["pageTable" + data.stockCode] = pageTable;
    }
    let tableKey;
    if (key.length > 3) {
      tableKey = key;
    } else {
      tableKey = createKey(data);
    }
    Store["a" + tableKey.slice(0, 3)] = data;
    Store["a" + tableKey] = data;
  }
  /**
   * 从内存或本地文件中获取
   * @param {String} key
   */
  getStorage(key) {
    let data;
    let fileType = key.slice(0, 3);
    if (Store["a" + key] !== undefined) {
      data = Store["a" + key];
      this.observeFileChange(fileType, data);
    }
  }

  getData(keyValue) {
    this.getStorage(keyValue.storage);
    this.sendMessage(keyValue.query);
  }

  sendMessage(msg) {
    Vue.prototype.$socket.send(msg);
  }
}

export default new Storage([]);
