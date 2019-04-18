<template>
  <canvas
    ref="canvas"
    @click="clickCanvas"
    :width="width"
    :height="height"
    style="border:1px solid #000000;"
  ></canvas>
</template>

<script>
import Storage from "../utils/Storage.js";
import { file112 } from "../utils/fileList.js";
import { timeTable } from "../utils/FSTimeTable.js";
import { debug } from "util";

export default {
  name: "FSLine",
  props: {
    isStock: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 200
    },
    width: {
      type: Number,
      default: 400
    },
    stockInfo: {
      type: Object,
      default: () => ({
        code: "010001",
        stockName: "平安银行",
        stockCode: "000001"
      })
    }
  },
  computed: {
    gap() {
      return (this.xRange[1] - this.xRange[0]) / (this.timeIndex - 1);
    },
    xRange() {
      return [0, this.width];
    },
    yRange() {
      return [0, this.height];
    }
  },
  watch: {
    gap: function(newVal) {
      this.doDraw();
    },
    height: function(newVal) {
      this.yRange = [0, newVal];
    },
    tempData: function(newData) {
      if (newData.data.length === 0) {
        this.clearCanvas();
      }
      if (newData.data.length > 0 && !this.firstInit) {
        this.firstInit = true;
        //   if (this.kSettingItem.fsHair) {
        //     this.showCrosshair = true
        //     let index = newData.data.length - 1
        //     if (!this.kSettingItem.jhjj) {
        //       index -= 15
        //     }
        //     this.moveCrosshair(index)
        //   }
      }

      let temp = {};
      let initTimeTable = [];
      // 清空原先数据
      for (let i = 0; i < timeTable.length; i++) {
        initTimeTable.push(Object.assign({}, timeTable[i]));
      }
      // 重新赋值
      for (let i = 0; i < newData.data.length; i++) {
        temp = newData.data[i];
        for (let j = 0; j < initTimeTable.length; j++) {
          if (temp.date === initTimeTable[j].date) {
            initTimeTable[j] = Object.assign({}, initTimeTable[j], temp);
            break;
          }
        }
      }
      this.drawData = newData;
      this.drawData.data = initTimeTable;

      this.doDraw();
    }
  },
  data: () => ({
    stockCode: "010001",
    showCrosshair: false,
    drawData: {
      data: []
    },
    tempData: {
      data: []
    },
    firstInit: false,
    // xRange: [0, 400], // 画布腰围
    // yRange: [0, 200], // 画布身高
    callAuctionCloseArr: [1030, 1130, 1400],
    callAuctionOpenArr: [930, 1030, 1130, 1400],
    xGrid: [930, 1030, 1130, 1400],
    start: [9, 15],
    timeIndex: 256,
    openjhjjFlag: true,
    crosshair: {
      x: 100,
      y: 0
    }
  }),
  created() {
      Storage.addFile(Object.assign({ ctx: this }, file112));
  },
  updated() {
    if (this.drawData.data.length === 0) {
      this.clearCanvas();
    }
    this.doDraw();
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
  },
  methods: {
    clickCanvas(e) {
      console.log(e);
      this.$refs.canvas;
      let canvasX = e.x - this.$refs.canvas.offsetLeft;
      this.showCrosshair = true;
      let index = this.tranferX2Index(canvasX);
      let time = this.transferIndex2Time(index);
      let price;
      let tempData;
      for (let i = 0; i < this.drawData.data.length; i++) {
        if (this.drawData.data[i].date === time) {
          price = this.drawData.data[i].dealPrice;
          tempData = Object.assign({}, this.drawData.data[i]);
        }
      }
      this.crosshair = {
          x: canvasX,
          y: 0
      }
      tempData.date = tempData.date.replace(/(\d{2})(\d{2})/, "$1:$2");
      console.log(tempData);
      this.doDraw()
    },
    tranferX2Index(x) {
      let index = Math.round(x / this.gap);
      if (index > this.currentTimeIndex) {
        index = this.currentTimeIndex;
      } else if (index < 0) {
        index = 0;
      }
      return index;
    },
    draw() {
      const ctx = this.ctx;
      this.clearCanvas()
      if (this.showCrosshair) {
        this.drawCrosshair(ctx);
      }

      if (
        Object.keys(this.drawData).length !== 0 &&
        this.drawData.data.length &&
        this.drawData.pcp
      ) {
        // if (this.kSettingItem.fsjx) {
        //   this.drawAPL(ctx)
        // }

        ctx.beginPath();
        ctx.closePath();
        this.drawFline(ctx);
        this.drawText(ctx);
      }
      this.drawGrid(ctx);
      ctx.stroke();
    },
    drawFline(ctx) {
      ctx.setLineDash([0, 0, 0]);
      let data = this.drawData.data;
      let startIndex = 0;
      for (let i = 0, length = data.length; i < length; i++) {
        if (parseInt(data[i].dealPrice) != 0) {
          startIndex = i;
          break;
        }
      }

      ctx.moveTo(data[startIndex].x, data[startIndex].y);
      let prevData = data[startIndex];
      for (let i = startIndex + 1, length = data.length; i < length; i++) {
        if (data[i].dealA !== 0 || parseInt(data[i].dealPrice) !== 0) {
          ctx.lineTo(data[i].x, data[i].y);
          prevData = data[i];
        } else if (data[i].averageDa !== 0) {
          ctx.lineTo(data[i].x, prevData.y);
        }
      }
      ctx.strokeStyle = "blue";
      ctx.setLineDash([0, 0], 0);
      ctx.stroke();
      ctx.closePath();
    },
    transferIndex2Time(index) {
      if (this.openjhjjFlag) {
        index = index + 15;
      } else {
        index = index + 30;
      }
      if (index > 150) {
        index += 90;
      }
      let hours = Math.floor(index / 60) + 9;

      let min = index % 60;
      return String(100 + hours).slice(1) + String(100 + min).slice(1);
    },
    // 可以mix
    transfer2y(y) {
      let yRange = this.yRange;
      let yDomain = this.yDomain;
      return (
        ((yDomain[1] - y) / (yDomain[1] - yDomain[0])) *
          (yRange[1] - yRange[0]) +
        yRange[0]
      );
    },
    transfer2TimeIndex(time) {
      let start = this.start;
      let date = [];

      let dataDate = parseInt(time);
      date[0] = Math.floor(dataDate / 100);

      date[1] = dataDate % 100;

      let index = (date[0] - start[0]) * 60 + (date[1] - start[1]);
      if (date[0] >= 13) {
        index = index - 90;
      }
      return index;
    },
    transfer2x(time) {
      let index = this.transfer2TimeIndex(time);
      let gap = this.gap;

      return gap * index;
    },
    drawCrosshair(ctx) {
      ctx.setLineDash([0, 0, 0]);
      ctx.beginPath();
      ctx.moveTo(this.crosshair.x, 0);
      ctx.lineTo(this.crosshair.x, this.yRange[1]);
      // ctx.moveTo(0, this.crosshair.y)
      // ctx.lineTo(this.xRange[1], this.crosshair.y)
      ctx.closePath();
      ctx.strokeStyle = "black";
      ctx.stroke();
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    },
    drawText(ctx) {
      const midY = this.yRange[1] / 2;
      const fontSize = 10;
      const yEnd = this.yRange[1];
      const xEnd = this.xRange[1] - 3 * fontSize;
      ctx.font = `${fontSize}px`;
      let TextInfo;

      if (this.isStock) {
        TextInfo = [
          {
            text: parseFloat(this.drawData.pcp).toFixed(2),
            x: xEnd,
            y: midY + fontSize / 3,
            color: "gray"
          },
          {
            text: parseFloat(this.yDomain[1]).toFixed(2),
            x: xEnd,
            y: fontSize,
            color: "gray"
          },
          {
            text: parseFloat(this.yDomain[0]).toFixed(2),
            x: xEnd,
            y: yEnd - fontSize / 3,
            color: "gray"
          }
        ];
      } else {
        TextInfo = [
          {
            text: Math.round(this.drawData.pcp),
            x: xEnd,
            y: midY + fontSize / 3,
            color: "gray"
          },
          {
            text: Math.round(this.yDomain[1]),
            x: xEnd,
            y: fontSize,
            color: "gray"
          },
          {
            text: Math.round(this.yDomain[0]),
            x: xEnd,
            y: yEnd - fontSize / 3,
            color: "gray"
          }
        ];
      }
      for (let i = 0; i < TextInfo.length; i++) {
        ctx.fillStyle = TextInfo[i].color;
        ctx.fillText(TextInfo[i].text, TextInfo[i].x, TextInfo[i].y);
      }
    },
    drawTimeLine(time, ctx) {
      let x = this.transfer2x(time);
      // ctx.setStrokeStyle('black')
      ctx.beginPath();
      ctx.setLineDash([3, 3, 2]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.yRange[1]);
      ctx.closePath();
      ctx.stroke();
    },
    drawYLine(yPosition, ctx) {
      // ctx.setStrokeStyle('black')
      ctx.beginPath();
      ctx.setLineDash([3, 3, 10]);
      ctx.moveTo(0, yPosition);
      ctx.lineTo(this.xRange[1], yPosition);
      ctx.closePath();
      ctx.stroke();
    },
    drawGrid(ctx) {
      let timeArr = this.xGrid;
      ctx.fillStyle = "rgba(186, 186, 186, 1)";
      for (let i = 0, length = timeArr.length; i < length; i++) {
        this.drawTimeLine(timeArr[i], ctx);
      }
      const midY = this.yRange[1] / 2;
      const firstY = (this.yRange[0] + midY) / 2;
      const lastY = (this.yRange[1] + midY) / 2;
      const YLineArr = [midY, firstY, lastY];
      // ctx.beginPath()
      for (let i = 0; i < YLineArr.length; i++) {
        this.drawYLine(YLineArr[i], ctx);
      }
    },
    doDraw() {
      if (
        Object.keys(this.drawData).length !== 0 &&
        this.drawData.data.length
      ) {
        this.preprocess();
      }
      this.draw();
    },
    preprocess() {
      if (!this.drawData.pcp) {
        return;
      }
      let data = this.drawData;

      let zuidacha = (data.pcp * 0.02).toFixed(2);
      let lastDate = data.data[data.data.length - 1].date;
      let currentTimeIndex = this.transfer2TimeIndex(lastDate);

      this.currentTimeIndex = currentTimeIndex;
      let zuidacha1 = Math.abs(data.pcp - data.hp).toFixed(2);
      let zuidacha2 = Math.abs(data.pcp - data.lp).toFixed(2);
      if (parseFloat(zuidacha1) >= parseFloat(zuidacha2)) {
        zuidacha =
          parseFloat(zuidacha1) > parseFloat(zuidacha)
            ? parseFloat(zuidacha1)
            : parseFloat(zuidacha);
      } else {
        zuidacha =
          parseFloat(zuidacha2) > parseFloat(zuidacha)
            ? parseFloat(zuidacha2)
            : parseFloat(zuidacha);
      }
      let zhi = parseFloat(zuidacha) + parseFloat(data.pcp);
      let chaPercent = (
        (parseFloat(zuidacha) / parseFloat(data.pcp)) *
        100
      ).toFixed(2);

      let yDomain = [
        parseFloat((data.pcp - zuidacha).toFixed(2)),
        parseFloat(zhi.toFixed(2))
      ];

      this.yDomain = yDomain;
      this.chaPercent = parseFloat(chaPercent);
      for (let i = 0, length = data.data.length; i < length; i++) {
        data.data[i].x = this.transfer2x(data.data[i].date);
        data.data[i].y = this.transfer2y(data.data[i].dealPrice);
        data.data[i].averagey = this.transfer2y(data.data[i].averagePrice);
      }
      if (this.DrawM30) {
        data.data[15].dealA = data.data[10].dealA;
        data.data[15].dealN = data.data[10].dealN;
      }
      this.drawData = data;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("../common/css/flex.css");
.red {
  background: red;
}
</style>
