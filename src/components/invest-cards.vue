<template>
  <iscroll-view  ref="scrollView" class="scroll-view investListS" :options="{click:true, scrollY: true, probeType: 1}"  :scrollerClass="{'scroller': true}"  @pullUp="pullUp" @pullDown="pullDown">
    <divider class="pulldown-tips"><inline-loading></inline-loading> 下拉刷新</divider>
    <router-link class="ivlink" v-for="item,index in rowsData" :to="{name: 'investdetail',params:{borrowType:yovipactive,borrowId:item.borrowId,depositoryId:item.depositoryId||'0'}}" :key="index">
      <card :header="{title: item.title}">
        <div slot="content" class="card-icont">
          <clocker v-if="openStartEnd&&item.invest_start_time" class="timeend" :time="getTimeEnd(item.invest_start_time)" slot="value">距离开抢 <span>%_H1</span><span>%_H2</span>:<span>%_M1</span><span>%_M2</span>:<span>%_S1</span><span>%_S2</span></clocker>
          <div>
            <span class="precent"><big>{{item.annualRate | rate}}</big>%</span>
            <br/>
            协议年化利率
          </div>
          <div>
            <span>{{item.loanPeriod}}个{{item.loanPeriodType===0?'月':item.loanPeriodType===1?'日':''}}</span>
            <br/>
            期限
          </div>
          <div>
            <template v-if="item.status===9">
              <img :src="ywc" alt="已完成" width="60">
            </template>
            <template v-else-if="item.status===7">
              <img :src="hkz" alt="还款中" width="60">
            </template>
            <template v-else-if="item.status===6">
              <img :src="ymb" alt="已满标" width="60">
            </template>
            <template v-else-if="item.status===2">
            <span>{{item.canInvestAmount | milliFormat}}</span>
            <br/>
            可认购金额（元）
            </template>
          </div>
        </div>
        <flexbox v-if="item.investPercentInt<100" slot="footer" class="iprogress" :gutter="0">
          <flexbox-item :span="10/12">
            <x-progress :percent="item.investPercentInt" :show-cancel="false"></x-progress>
          </flexbox-item>
          <flexbox-item style="text-align: center;"><span>{{item.investPercentInt}}</span>%</flexbox-item>
        </flexbox>
      </card>
    </router-link>
    <divider v-if="total===0&&offset===0">没有数据</divider>
    <divider class="data-load-tips" v-else><inline-loading v-if="loadStatus=='loading'"></inline-loading>{{loadStatusConfig[loadStatus]}}</divider>
  </iscroll-view>
</template>

<script>
import BigDecimal from '@/lib/bigDecimal'
import datetime from '@/lib/dateTimeFormatter'
import { InlineLoading, Card, Flexbox, FlexboxItem, XProgress, Clocker, Divider } from 'vux'
import 'vux/src/styles/1px.less'
export default {
  props: ['yovipactive', 'rowsData', 'getPageData', 'page', 'total', 'offset'],
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
      ymb: require('@/assets/images/c-icon_ymb.png'),
      hkz: require('@/assets/images/c-icon_hkz.png'),
      ywc: require('@/assets/images/c-icon_ywc.png'),
      loadStatus: loadStatus,
      loadStatusConfig: {
        canLoad: '上拉加载更多',
        canNotLoad: '没有更多数据~',
        loading: '加载中...'
      },
      openStartEnd: false
    }
  },
  components: {
    InlineLoading,
    Card,
    Flexbox,
    FlexboxItem,
    XProgress,
    Clocker,
    Divider,
  },
  watch: {
    rowsData (newVal, oldVal) {
      if (this.page === 1) {
        this.$nextTick(() => {
          this.$refs.scrollView.scrollTo(0, 0, 0)
        })
      }
      if (this.offset < this.total) {
        this.loadStatus = 'canLoad'
      } else {
        this.loadStatus = 'canNotLoad'
      }
    }
  },
  filters: {
    rate (v) {
      return BigDecimal.accMul(v || '', 100).toFixed(2)
    },
    milliFormat (v) {
      return BigDecimal.milliFormat(v.toString() || '')
    }
  },
  methods: {
    accMul (v, b) {
      return BigDecimal.accMul(v, b).toFixed(2)
    },
    getTimeEnd (v) {
      return datetime((+new Date()) + v)
    },
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
    pullDown (iscroll) {
      if (iscroll.distY > 130) {
        this.getPageData('refresh')
      }
    }
  },
  mounted () {
  },
}
</script>
<style lang="less">
.investListS  {
  .weui-panel{
    &:before,
    &:after{
      border:none;
    }
  }
  .weui-panel__hd{
    padding-bottom: 0;
    &:after{
      border:none;
    }
  }
}
.iprogress{
  text-align: center;
  padding-left: .5rem;
  padding-bottom: .5rem;
  color: #7193e9;
  font-size: .52rem;
  .weui-progress__inner-bar{
    background-color: #7193e9;
  }
}
</style>
<style lang="less" scoped>
.scroll-view {
  position: absolute;
  top: 0;
  left:0;
  bottom:0;
  right:0;
  overflow: hidden;
  background-color: #eeeeee;
  touch-action: none;
  .scroller{

  }
}
.card-icont {
  display: flex;
  padding: .5rem 0;
  .timeend{
    position: absolute;
    color: #f74c31;
    right: .5rem;
    top: 11px;
    background-color: #f7f7f7;
    padding: 0 .5rem;
    border-radius: .5rem;
    span{
      color: #f74c31;
      font-size: .52rem;
      line-height: 1rem;
    }
  }
  & > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #999;
    &:last-child{
      text-align: right;
      padding-right:.5rem;
    }
  }
}
.card-icont span {
  color: #666;
  font-size: .54rem;
  line-height: 1.2rem;
  &.precent{
    font-family: arial;
    color: #f74c31;
    big{
      font-size: .8rem;
      line-height: 1;
    }
  }
}
.pulldown-tips{
  position: absolute;
  top:0;
  padding: 20px 0;
  transform: translateY(-100%);
}
.data-load-tips{
  padding: 15px 0 10px 0;
  text-align: center;
  color: #999;
  font-size: 12px;
}
.ivlink{
  display: block;
  margin-bottom: .5rem;
  &:focus,
  &:hover{
    .weui-panel {
      background-color: #f7f7f7;
    }
  }
}
</style>
