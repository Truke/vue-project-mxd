<template>
  <iscroll-view ref='scrollView' class="scroll-view" @pullUp='pullOneUp'  :options="{scrollY: true, probeType: 1}"  :scrollerClass="{'scroller': true}">
    <div class="page0" :style="{minHeight: winheight + 'px'}">
        <div class="page-cont">
            <div class="page-top" data-wrap="layout">
                <div data-item="col-6">
                    <p class="s-t-center">
                        <b>{{info.annualRate||'0' | rate}}</b>%
                    </p>
                    <p class="s-t-center">协议出借利率</p>
                </div>    
                <div data-item="col-6">
                    <p class="s-t-center">
                        <b>{{info.loanPeriod}}</b>个{{info.loanPeriodType===0?'月':info.loanPeriodType===1?'日':''}}
                    </p>
                    <p class="s-t-center">投资期限</p>
                </div> 
            </div> 
            <div class="page-main" data-wrap="layout">
                <div data-item="col-5" class="wavebox">
                    <wave-progress v-if="cur===0" ref="wave" :prevent="info.investPercentInt" color="#fe6f06"></wave-progress>
                </div>
                <div class="m-amount" data-item="col-7">
                    <p v-if="borrowType==='1'||borrowType==='4'"><b>{{info.investAccount | cantou(info.amount)}}</b> / <span>{{info.amount}}</span></p>
                    <p v-else-if="borrowType==='2'||borrowType==='3'">
                      <b>{{info.residualAmount}}</b>/ <span>{{info.planAmount}}</span>
                    </p>
                    <p>可投金额 / 总金额(元)</p>     
                </div>    
            </div>
            <div class="kaiq" v-if="openStartEnd&&info.startTimeStamp">
              <clocker class="timeforkq" :time="getTimeEnd(info.startTimeStamp)" slot="value">
                距离开抢 <span>%_H1%_H2</span>:<span>%_M1%_M2</span>:<span>%_S1%_S2</span>
              </clocker>
            </div>
            <div class="page-buy">
                <div data-wrap="layout">
                    <label data-item="col-3">我要投</label>
                    <input data-item="col-6" class="moneyInput" type="number" placeholder="请输入金额" :value="money" @input="moneyInput($event.target.value)" :style="{color:money>=info.initAmount?'#fe6f06 !important':''}" />
                    <span data-item="col-3">元</span>
                </div>
                <p class="s-t-center">
                    <b class='s-org'>{{willmoney}}</b><br/>
                    预期收益(元)
                </p>
            </div>
        </div>
        <div class="page-table">
            <table >
                <tbody >
                    <tr>
                        <td width="30%">项目名称</td>
                        <td width="70%">{{info.title || info.borrowSetName || ''}}</td>
                    </tr>
                    <tr>
                        <td >起投金额</td>
                        <td >{{info.initAmount || info.minAmount}}元</td>
                    </tr>
                    <tr>
                        <td width="30%">项目结束时间</td>
                        <td width="70%">{{info.endTimecg || info.endTime | datetime}}</td>
                    </tr>
                    <tr>
                        <td width="30%">项目开始时间</td>
                        <td width="70%">{{info.startTime | datetime}}</td>
                    </tr>
                    <tr>
                        <td width="30%">还款方式</td>
                        <td width="70%">{{info.repaymentType | repaymentfilter}}</td>
                    </tr>
                    <tr v-if="borrowType==='1'">
                        <td width="30%">预计计息日</td>
                        <td width="70%">放款指令执行</td>
                    </tr>
                </tbody>
            </table>    
        </div>
        <divider style="margin-top:1rem;">上滑查看更多详情</divider>
    </div>
  </iscroll-view>
</template>

<script>
import { mapGetters } from 'vuex'
import waveProgress from '@/components/wave-progress'
import BigDecimal from '@/lib/bigDecimal'
import datetime from '@/lib/dateTimeFormatter'
import { Divider, Clocker } from 'vux'
let cache = {}
export default {
  props: ['pullUp', 'info', 'cur', 'money'],
  data () {
    return {
      winheight: window.innerHeight - 70,
      timer: null,
      initTimer: null,
      willmoney: 0,
      openStartEnd: false
    }
  },
  components: {
    waveProgress,
    Divider,
    Clocker,
  },
  computed: {
    ...mapGetters(['borrowId', 'borrowType', 'depositoryId'])
  },
  filters: {
    repaymentfilter (v) {
      return {0: '按月等额本息还款', 1: '按月付息到期还本', 2: '到期还本付息'}[v]
    },
    rate (v) {
      return BigDecimal.accMul(v || '', 100).toFixed(2)
    },
    cantou (v, a) {
      return BigDecimal.accSub(a, v)
    },
    datetime (v) {
      return Number(v) ? datetime(Number(v)) : v
    }
  },
  methods: {
    moneyInput (v) {
      this.$emit('update:money', v)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (cache[v]) {
          this.willmoney = cache[v]
        } else if (v.trim() === '' || v.trim() == 0) {
          this.willmoney = 0
        } else {
          this.getWillMoney(v)
        }
      }, 500)
    },
    getWillMoney (value) {
      this.$config.getData({
        key: 'getRespectIncome',
        method: 'post',
        data: {
          amount: value || 0,
          annuRate: this.info.annualRate,
          month: this.info.loanPeriod,
          repaymentType: this.info.repaymentType,
          loanPeriodType: this.info.loanPeriodType,
          productType: (this.borrowType === '1' || this.borrowType === '4') ? 1 : 0
        },
        callback: (data) => {
          if (data.result === 1) {
            this.willmoney = data.data
            cache[value] = data.data
          }
        }
      })
    },
    getTimeEnd (v) {
      return datetime((+new Date()) + v)
    },
    pullOneUp (iscroll) {
      if (iscroll.distY < -70) {
        this.pullUp()
      }
    }
  },
  watch: {
    cur (val) {
      if (val === 0) {
        this.$nextTick(() => {
          this.$refs.scrollView && this.$refs.scrollView.refresh()
          this.$refs.wave.refresh()
        })
      }
    }
  },
  mounted () {
    clearTimeout(this.initTimer)
    this.initTimer = setTimeout(() => {
      this.$refs.scrollView && this.$refs.scrollView.refresh()
    }, 1000)
    
  }
}
</script>

<style lang="less" scoped>
.scroll-view{
  width:100%;
  touch-action:none;
  position: absolute;
  left:0;
  top:0;
  right: 0;
  bottom:0;
  overflow:hidden;
}
.page0{
    .page-cont{
        width:100%;
        background:#fff url("../assets/images/c-icon_wavebg.png") no-repeat center top;
        background-size: contain;
        .page-top{color:#fff;font-size:0.48rem;padding-top:1rem;
            b{font-size:1rem;}
        }
        .page-main{
            width:80%;margin:0 auto;padding:1.6rem 0 .6rem;
            .yuan{
                width:3.6rem;height:3.6rem;background:#fdae3b;border-radius:50%;font-size:0.86rem;
                border:4px solid #fff;text-align:center;line-height:3.3rem;color:#fff;font-family: arial;
            }
            .m-amount{padding-top:1.3rem;color:#999;
                span{color:#333;font-size:.58rem;}
                b{color:#fdae3b;font-size:.7rem;padding-right:5px;}
            }
        }
    }
    .page-buy{width:66%;margin:0 auto;padding-bottom:1rem;
        span,label{
            display:block;
            line-height:1.6rem;text-align:center
        }
        input{
            display:block;height:1.6rem;line-height:1.6rem;border-bottom:1px solid #ddd;text-align:center;
            font-size: 1.2rem;
            font-family: arial;
            color: #fe6f06;
            &::-webkit-input-placeholder{
              font-size: .52rem;
            }
            &:-moz-placeholder{
              font-size: .52rem;
            }
            &::-moz-placeholder{
              font-size: .52rem;
            }
            &:-ms-input-placeholder{
              font-size: .52rem;
            }
        }
        p{
          padding-top: .5rem;
          b{
            font-size: 0.68rem;
          }
        }
    }
    .page-table{
      margin-top: .4rem;
        table{width:100%;
            tr{background:#fff;}
            td{height:1.6rem;line-height:1.6rem;padding:0 .5rem;
              font-size: 0.52rem;
              &:first-child{
                color: #999;
                text-align: justify;
                text-align-last: justify;
              }
              &:last-child{
                color: #666;
              }
            }
            tr:nth-child(2n+1){background:#f9f9f9}
        }
    }
}
.kaiq{
  background-color: #fff8e6;
  color: #fe6f06;
  text-align: center;
  line-height: 1.8rem;
  font-size: 0.64rem;
  margin-bottom: .6rem;
  span{
    display: inline-block;
    vertical-align: middle;
    height: 1rem;
    line-height: 1rem;
    border-radius: 5px;
    color: #fff;
    background-color: #fe6f06;
    padding: 0 .1rem;
    margin: 0 .2rem;
  }
}
.wavebox{
  height: 100px;
}
.waveContainer{
  transform: scale(.5);
  transform-origin: left top;
}
</style>