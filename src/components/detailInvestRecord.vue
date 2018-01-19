<template>
  <iscroll-view ref="scrollView" class="scroll-view" :options="{scrollY: true, probeType: 1}"  :scrollerClass="{'scroller': true}"  @pullUp="pullUp" @pullDown="pullDown">
    <div :style="{'min-height': winheight + 'px'}">
      <ul class="dirList">
        <li v-for="item,index in rowsData">
          <span class="num">{{item.num}}</span>
          <span class="ren">{{item.realName | change}}</span>
          <span class="mt"><strong>{{item.money || item.amount}}</strong>{{item.date || item.createTime | datetime}}</span>
        </li>
      </ul>
      <div class="data-load-tips">{{loadStatusConfig[loadStatus]}}</div>
    </div>
  </iscroll-view>
</template>

<script>
import datetime from '@/lib/dateTimeFormatter'
export default {
  props: ['rowsData', 'getPageData', 'total', 'offset', 'pullDown', 'tabIndex'],
  updated () {
    this.refresh()
  },
  data () {
    let loadStatus = ''
    if (this.offset < this.total) {
      loadStatus = 'canLoad'
    } else {
      loadStatus = 'canNotLoad'
    }
    return {
      winheight: window.innerHeight - 100,
      loadStatus: loadStatus,
      loadStatusConfig: {
        canLoad: '上拉加载更多',
        canNotLoad: '没有更多数据~',
        loading: '加载中...'
      }
    }
  },
  filters: {
    change (v) {
      return v.charAt(0) + '**'
    },
    datetime (v) {
      return Number(v) ? datetime(Number(v)) : v
    }
  },
  watch: {
    rowsData (newVal, oldVal) {
      if (this.offset < this.total) {
        this.loadStatus = 'canLoad'
      } else {
        this.loadStatus = 'canNotLoad'
      }
    },
    tabIndex (val) {
      if (val === 2) {
        this.getPageData()
        this.refresh()
      }
    }
  },
  methods: {
    refresh () {
      this.$refs.scrollView.refresh()
    },
    pullUp () {
      if (this.offset < this.total) {
        if (this.loadStatus !== 'loading') {
          this.loadStatus = 'loading'
          this.getPageData()
        }
      } else {
        this.loadStatus = 'canNotLoad'
      }
    },
  }
}
</script>
<style lang="less" scoped>
.dirList{
  background-color: #fff;
  font-size: 0;
  li{
    padding: 0.3rem .5rem;
    &:nth-child(2n+1){
      background-color: #f9f9f9;
    }
  }
  span{
    display: inline-block;
    vertical-align: middle;
    &.num,
    &.mt{
      font-family: arial;
    }
    &.num,
    &.ren{
      font-size: 0.56rem;
      width: 25%;
    }
    &.mt{
      width: 50%;
      font-size: 0.48rem;
      text-align: right;
      line-height: 1.4;
      color: #999;
      strong{
        display: block;
        font-weight: normal;
        color: #7193e9;
        font-size: 0.6rem;
      }
    }
  }
}
.data-load-tips{
  padding: 15px 0 10px 0;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>