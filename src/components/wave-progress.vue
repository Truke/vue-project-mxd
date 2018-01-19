<template>
  <div class="waveContainer" ref="waveContainer">
    <canvas ref="canvas">啊哦，你的浏览器不支持canvas</canvas>
  </div>
</template>

<script>
export default {
  props: ['prevent', 'color'],
  data () {
    return {
      ctx: null,
      vertexes: [],
      diffPt: [],
      autoDiff: 1000,
      verNum: 200,
      Vertex: null,
      xx: 0,
      dd: 6,
      timer: null,
    }
  },
  computed: {
    sy () {
      return 100 - (this.prevent / 100) * 200
    }
  },
  methods: {
    init () {
      let width = this.$refs.waveContainer.offsetWidth - 5
      this.$refs.canvas.width = this.$refs.canvas.height = width
      this.ctx = this.$refs.canvas.getContext('2d')
      for (let i = 0; i < this.verNum; i++){
        this.vertexes[i] = new this.Vertex(width / (this.verNum - 1) * i, width / 2, width / 2);
      }
      this.initDiffPt();
      const FPS = 30
      let interval = 1000 / FPS >> 0
      this.timer = setInterval(this.update, interval)
    },
    initDiffPt () {
      for (let i = 0; i < this.verNum; i++) {
        this.diffPt[i] = 0
      }
    },
    update () {
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      this.autoDiff -= this.autoDiff * 0.95;
      this.diffPt[this.xx] = this.autoDiff;
      //左侧
      //差分，使得每个点都是上一个点的下一次的解，由于差分函数出来的解是一个曲线，且每次迭代后，曲线相加的结果形成了不断地波浪
      for (let i = this.xx - 1; i > 0; i--) {
        let d = this.xx - i;
        if (d > this.dd) d = this.dd;
        this.diffPt[i] -= (this.diffPt[i] - this.diffPt[i + 1]) * (1 - 0.01 * d);
      }
      //右侧
      for (let i = this.xx + 1; i < this.verNum; i++) {
        let d = i - this.xx;
        if (d > this.dd) d = this.dd;
        this.diffPt[i] -= (this.diffPt[i] - this.diffPt[i - 1]) * (1 - 0.01 * d);
      }

      //更新点Y坐标
      for (let i = 0; i < this.vertexes.length; i++) {
        this.vertexes[i].updateY(this.diffPt[i]);
      }
      this.draw()
      
    },
    initVertex () {
      this.Vertex = function (x, y, baseY) {
        this.baseY = baseY;
        this.x = x;
        this.y = y;
        this.vy = 1;
        this.targetY = 0;
        this.friction = 0.15;
        this.deceleration = 0.95;
      }
      this.Vertex.prototype.updateY = function (diffVal) {
        this.targetY = diffVal + this.baseY;
        this.vy += this.targetY - this.y;
        this.y += this.vy * this.friction;
        this.vy *= this.deceleration;
      }
    },
    draw () {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.$refs.canvas.height);
      this.ctx.fillStyle = this.color;
      this.ctx.lineTo(this.vertexes[0].x, this.vertexes[0].y + this.sy);
      for (var i = 1; i < this.vertexes.length; i++) {
          this.ctx.lineTo(this.vertexes[i].x, this.vertexes[i].y + this.sy);
      }
      this.ctx.lineTo(this.$refs.canvas.width, this.$refs.canvas.height);
      this.ctx.lineTo(0, this.$refs.canvas.height);
      this.ctx.fill();

      this.ctx.fillStyle = "#fff";
      this.ctx.font = "60px arial";
      this.ctx.textBaseline = "top";
      this.ctx.textAlign = "center";
      this.ctx.fillText(this.prevent, 90, this.$refs.canvas.height / 2.8);
      this.ctx.font = "28px arial";
      this.ctx.fillText('%', 154, this.$refs.canvas.height / 2);
    },
    refresh () {
      this.destroy()
      this.initVertex()
      this.init()
      setTimeout(() => {
        clearInterval(this.timer)
      }, 5000)
    },
    destroy () {
      this.ctx = null
      this.vertexes = []
      this.diffPt = []
      this.Vertex = null
      this.autoDiff = 1000
      clearInterval(this.timer)
    }
  },
  mounted () {
    this.initVertex()
    this.init()
    setTimeout(() => {
      clearInterval(this.timer)
    }, 5000)
  },
  beforeDestroy () {
    this.destroy()
  }
}
</script>

<style scoped>
.waveContainer{width:200px;height:200px;background:#ffe8c0
  ;border-radius:50%;overflow:hidden;position:absolute;border:5px solid #fff;}
canvas{border-radius:50%;overflow:hidden;position:absolute;top:0px}
</style>