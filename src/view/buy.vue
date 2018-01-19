<template>
  <div class="buy">
    <x-header
      style="background-color: #fe6f07;"
      :left-options="leftOptions"
      title="立即抢投"
      @on-click-back="clickBack">
    </x-header>
    <p class="tips" v-if="accountExplain">{{accountExplain}}</p>
    <flexbox class="cancell plr20">
      <flexbox-item :span="9">
        <h5>{{borrowType==='1'?'存管':'旧'}}账户可用余额</h5>
        <p><span>{{balance}}</span>元</p>
      </flexbox-item>
      <flexbox-item>
        <router-link :to="{name: 'recharge', params: {type: borrowType==='1'?'cg':'old',back:'0',redirect: $route.fullPath}}"><x-button>充值</x-button></router-link>
      </flexbox-item>
    </flexbox>
    <flexbox class="cancell plr20">
      <flexbox-item>
        <h5>可投金额</h5>
        <p><span>{{investAccount | cantou(amount)}}</span>元</p>
      </flexbox-item>
    </flexbox>
    <group>
      <x-input title='我要投资' type="number" placeholder="请输入投资金额" :show-clear="moneyClear" v-model="money" style="font-size:.52rem;" @on-focus="onFocus('moneyClear')" @on-blur="onBlur('moneyClear')" @input="moneyInput"></x-input>
    </group>
    <p class="plr20 profit">预期收益为：<span class="s_org">{{willmoney}}元</span> <x-icon type="ios-help-outline" class="cell-x-icon" size="20" style="display: inline-block;vertical-align: text-bottom;" @click="toastTip"></x-icon></p>
    <group class="yhcell" v-if="quan.show">
      <cell title="优惠券" :class="{'selected':selectTicket}" :value="quanValue" :is-link="quan.usetotalCount>0||quan.nousetotalCount>0" style="font-size:.52rem;" @click.native="prevSelQuan"></cell>
    </group>
    <p class="useturn plr20"><a @click="useTicketClick">使用兑换码</a></p>
    <div class="plr20" style="margin-top: 1rem">
      <x-button type="primary" style="background-color: #fe6f07;" @click.native="submit">下一步</x-button>
      <p class="danger_tip"><img :src="investimgUrl" width="20" alt=""> {{investMsg}}</p>
    </div> 
    <div v-transfer-dom>
      <x-dialog hide-on-blur v-model="enterTransPwd" class="enterTransPwd">
        <div style="padding: .5rem;">
          <h4 style="font-size: .64rem">输入交易密码</h4>
          <div class="etpArea">
            <input type="password" class="transpwdInput" placeholder="请输入交易密码" v-model="transpwd">
          </div>
          <p style="text-align: right;padding:.5rem;">
            <a href="javascript:void" class="link" style="color: #3184f5"></a>
          </p>
          <x-button type="primary" style="background-color: #fe6f07" @click.native="transpwdClick">确认</x-button>
        </div>
      </x-dialog>
    </div>  
    <transition name="router-slid">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formpost } from '@/lib/utils'
import BigDecimal from '@/lib/bigDecimal'
import { XHeader, Flexbox, FlexboxItem, Group, Cell, XInput, XButton, TransferDomDirective as TransferDom, XDialog } from 'vux'
import 'vux/src/styles/1px.less'
let cache = {}
export default {
  data () {
    return {
      info: {},
      balance: '0.00',
      money: "",
      moneyClear: true,
      willmoney: 0,
      timer: null,
      isMoney: false,
      quan: {
        show: null,
        usetotalCount: null,
        nousetotalCount: null,
      },
      enterTransPwd: false,
      transpwd: '',
    }
   },
   directives: {
    TransferDom
   },
   components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    XInput,
    XButton,
    XDialog,
   },
   filters: {
     cantou (v, a) {
      return BigDecimal.accSub(a, v).toFixed(2)
     }
   },
   computed: {
     ...mapGetters(['userId', 'bondTransSignStatus', 'amount', 'moneyInputValue', 'accountExplain', 'annualRate', 'investAccount', 'loanPeriod', 'repaymentType', 'loanPeriodType', 'investimgUrl', 'investMsg', 'selectTicket', 'minAmount', 'borrowId', 'borrowType', 'depositoryId']),
     quanValue () {
      if (this.quan.usetotalCount !== null) {
        if (this.selectTicket) {
          if (this.selectTicket.type === 1) {
            return this.selectTicket.amount + '元现金券'
          } else if (this.selectTicket.type === 2) {
            return BigDecimal.accMul(this.selectTicket.amount, 100) + '%加息券'
          }
          return 
        } else {
          return '当前额度' + this.quan.usetotalCount + '张券可用（共' + (this.quan.usetotalCount + this.quan.nousetotalCount) + '张券待用）'
        }
      }
     },
     leftOptions () {
      return {
        showBack: !0,
        backText: '',
        preventGoBack: !0
      }
    }
   },
   methods : {
    ...mapActions(['borrowinfo', 'clearborrow', 'getBorrowIdInfoAPI']),
    init () {
      this.$store.dispatch('setPageHead', {
        show: false,
        title: '立即抢投',
        headFlag: false
      })
    },
    clickBack () {
      this.$router.replace({name: 'investdetail', params: { borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
    },
    findBalanceCaption () {
      if (this.borrowType === '1') {
        this.$config.getData({
          key: 'findBalanceCaption',
          method: 'post',
          data: {
            userId: this.userId,
            type: 1
          },
          callback: (data) => {
            if (data.result === 1) {
              if (data.data.result === 1) {
                this.balance = data.data.balance
              }
            }
          }
        })
      } else {
        this.$config.getData({
          key: 'findAccount',
          method: 'post',
          data: {
            userId: this.userId
          },
          callback: (data) => {
            if (data.result === 1) {
              this.balance = data.data.availableAmount
            }
          }
        })
      }
      
    },
    getDetail () {
      this.getBorrowIdInfoAPI()
    },
    moneyInput () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.borrowinfo({
          selectTicket: ''
        })
        if (cache[this.money]) {
          this.willmoney = cache[this.money].willmoney
        } else if (this.money.trim() === '' || this.money.trim() == 0) {
          this.willmoney = 0
        } else {
          this.getWillMoney(this.money)
        }
        this.findAllCanUseCouponTicket(this.money)
      }, 500)
    },
    getWillMoney (value) {
      this.$config.getData({
        key: 'getRespectIncome',
        method: 'post',
        data: {
          amount: value || 0,
          annuRate: this.annualRate,
          month: this.loanPeriod,
          repaymentType: this.repaymentType,
          loanPeriodType: this.loanPeriodType,
          productType: (this.borrowType === '1' || this.borrowType === '4') ? 1 : 0
        },
        callback: (data) => {
          if (data.result === 1) {
            if (!cache[value]) cache[value] = {}
            this.willmoney = cache[value].willmoney = data.data
          }
        }
      })
    },
    couponCanUsed () {
      this.$config.getData({
        key: 'couponCanUsed',
        method: 'post',
        data: {
          userId: this.userId
        },
        callback: (data) => {
          if (data.result === 1) {
            if (data.data.result === 1) {
              this.quan.show = true
              this.findAllCanUseCouponTicket()
            }
          }
        }
      })
    },
    findAllCanUseCouponTicket (value) {
      if (this.quan.show) {
        this.$config.getData({
          key: 'findAllCanUseCouponTicket',
          method: 'post',
          data: {
            userId: this.userId,
            amount: value || 0,
            borrowId: this.borrowId,
            isSpecialBorrow: this.borrowType === '1' ? 0 : 1
          },
          callback: (data) => {
            if (data.result === 1) {
              this.borrowinfo({
                selectTicket: ''
              })
              this.quan.usetotalCount = data.data.usetotalCount
              this.quan.nousetotalCount = data.data.nousetotalCount
            }
          }
        })
      }
    },
    findInvestNoticeConf () {
      if (this.investMsg === '') {
        this.$config.getData({
          key: 'findInvestNoticeConf',
          method: 'post',
          data: {
            userId: this.userId
          },
          callback: (data) => {
            if (data.result === 1) {
              this.borrowinfo({
                investMsg: data.data.investMsg,
                investimgUrl: data.data.imgUrl
              })
            }
          }
        })
      }
    },
    updateCouponTicketUsername (v) {
      this.$config.getData({
        key: 'updateCouponTicketUsername',
        method: 'post',
        data: {
          userId: this.userId,
          ticketNumber: v,
        },
        callback: (data) => {
          if (data.result === 1) {
            if (data.data.result === '1') {
              this.$vux.toast.show({
                type: 'success',
                width: 'auto',
                text: '兑换成功'
              })
              this.findAllCanUseCouponTicket(this.money)
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                width: 'auto',
                text: data.data.msg
              })
            }
          }
        }
      })
    },
    useTicketClick () {
      this.$vux.confirm.show({
        showInput: true,
        title: ' ',
        placeholder: '请输入兑换码',
        hideOnBlur: true,
        confirmText: '立即兑换',
        closeOnConfirm: false,
        onConfirm: (v) => {
          if (v.trim() === '') {
            this.$vux.toast.show({
              type: 'cancel',
              width: 'auto',
              text: '请输入兑换码'
            })
          } else {
            this.updateCouponTicketUsername(v)
            this.$vux.confirm.hide()
          }
        }
      })
    },
    prevSelQuan () {
      if (this.quan.usetotalCount > 0 || this.quan.nousetotalCount > 0) {
        this.$router.push({name: 'couponCanuse', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId, money: this.money || 0}})
      }
    },
    onFocus (val) {
      setTimeout(() => {
        this[val] = true
      }, 0)
    },
    onBlur (val) {
      setTimeout(() => {
        this[val] = false
      }, 0)
    },
    toastTip () {
      this.$vux.toast.show({
        type: 'text',
        width: 'auto',
        text: '您的收益以实际到账为准'
      })
    },
    validate () {
      if (this.money.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '请填写投资金额'
        })
        return false
      } else if (+this.money < this.minAmount) {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '起投金额为' + this.minAmount + '元哦~'
        })
        return false
      } else if (+this.money > BigDecimal.accSub(this.amount, this.investAccount)) {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '投资金额大于可投金额'
        })
        return false
      } else if (+this.money > this.balance) {
        this.$vux.confirm.show({
          title: '可用余额不足！',
          confirmText: '立即充值',
          hideOnBlur: true,
          onConfirm: () => {
            this.$router.push({name: 'recharge', params: {type: this.borrowType === '1' ? 'cg' : 'old', back: '0', redirect: this.$route.fullPath}})
          }
        })
        return false
      }
      return true
    },
    submit () {
      if (this.validate()) {
        if (this.quan.usetotalCount > 0 && !this.selectTicket) {
          this.$vux.confirm.show({
            title: '是否使用优惠券',
            confirmText: '立即使用',
            onConfirm: () => {
              this.prevSelQuan()
            },
            onCancel: () => {
              this.submitNext()
            }
          })
        } else {
          this.submitNext()
        }
      }
    },
    async submitNext () {
      if (this.borrowType === '1') {
        this.$vux.loading.show({
          text: '提交中'
        })
        let { data, errorMsg, result} = await this.getInvestFormParams()
        this.$vux.loading.hide()
        if (result === 1) {
          if (data.result === 1) {
            if (this.depositoryId !== '0' && this.bondTransSignStatus === 1) {
              this.$vux.toast.show({
                type: 'success',
                width: 'auto',
                text: data.msg
              })
              this.getDetail()
              setTimeout(() => {
                this.$router.push({name: 'buyStatus', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
              }, 1000)
            } else {
              this.$vux.loading.show({
                text: '跳转中'
              })
              formpost(data.TARGET_URL, data.parameters).then(() => {
              }).catch(() => {
                this.$vux.loading.hide()
              })
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              width: 'auto',
              text: data.msg
            })
          }
        }
      } else if (this.borrowType==='2'||this.borrowType==='3'||this.borrowType==='4') {
        this.enterTransPwd = true 
      }
    },
    getInvestFormParams () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'getInvestFormParams',
          method: 'post',
          data: Object.assign({
            borrowId: this.borrowId,
            userId: this.userId,
            amount: this.money,
            forgerPwdUrl: '',
            transActionUrl: location.href + '/buyStatus',
            successResultUrl: location.href + '/buyStatus',
            source: 3,
          }, this.selectTicket && this.selectTicket.id ? {ticketId: this.selectTicket.id} : {}, this.depositoryId === '0' ? {} : { depositoryId: this.depositoryId }),
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    addSetInvest () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'addSetInvest',
          method: 'post',
          data: Object.assign({
            borrowId: this.borrowId,
            userId: this.userId,
            amount: this.money,
            isEncode: 2,
            investPwd: this.$config.cryptoBase64(this.transpwd),
            ip: '127.0.0.1',
            ref: this.$route.query.sc_source || 5,//统计来源渠道
            type: 3,
            clientType: 2,
          }, this.selectTicket.id ? {ticketId: this.selectTicket.id} : {}),
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    investSeptadTicket () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'investSeptadTicket',
          method: 'post',
          data: Object.assign({
            borrowId: this.borrowId,
            userId: this.userId,
            amount: this.money,
            isEncode: 2,
            investPwd: this.$config.cryptoBase64(this.transpwd),
            ip: '127.0.0.1',
            ref: this.$route.query.sc_source || 5,//统计来源渠道
            type: 3,
            clientType: 2,
            promation: '0',
            source: 3,
          }, this.selectTicket.id ? {ticketId: this.selectTicket.id} : {}),
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    async transpwdClick () {
      if (this.transpwd.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '请填写交易密码'
        })
      } else if (!/^\d+$/g.test(this.transpwd)) {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '交易密码格式错误'
        })
      } else {
        this.$vux.loading.show({
          text: '提交中'
        })
        this.enterTransPwd = false
        let { data, errorMsg, result} = await this[this.borrowType === '4' ? 'investSeptadTicket' : 'addSetInvest']()
        this.transpwd = ''
        this.$vux.loading.hide()
        if (result === 1) {
          if (data.result === 1 || (this.borrowType === '4' && data.result === '2')) {
            this.$vux.toast.show({
              type: 'success',
              text: data.msg
            })
            this.getDetail()
            setTimeout(() => {
              this.$router.push({name: 'buyStatus', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
            }, 1000)
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              width: 'auto',
              text: data.msg
            })
            this.enterTransPwd = true
          }
        } else {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: errorMsg
          })
          this.enterTransPwd = true
        }
      }
    }
   },
   created () {
    this.borrowinfo({
      borrowType: this.$route.params.borrowType,
      borrowId: this.$route.params.borrowId,
      depositoryId: this.$route.params.depositoryId,
    }).then(() => {
      this.getDetail()
    })
    if (this.moneyInputValue !== '') {
      this.money = this.moneyInputValue
    }
    cache = {}
    this.findBalanceCaption()
    this.couponCanUsed()
    if (this.investimgUrl === '' || this.investMsg === '') {
      this.findInvestNoticeConf()
    }
   },
   mounted () {
    this.init()
   },
   destroyed () {
    this.clearborrow()
    this.enterTransPwd = false
   }
}
</script>

<style lang="less">
.weui-cell_access.selected .weui-cell__ft{
  color: #fe7a19;
}
.enterTransPwd{
  .etpArea{
    width: 80%;
    margin: 0 auto;
  }
  .transpwdInput{
    color: #999;
    font-size: .52rem;
    border-bottom: 1px solid;
    line-height: 1.6rem;
    width: 100%;
    text-align: center;
  }
}
</style>
<style lang="less" scoped>
.s_c_99{
    color:#999;
}
.s_org{color:#fe7a19;}
.plr20{padding:0 .5rem}
.buy{width:100%;overflow:hidden;
    .tips{
        background:#ffde6a;height:1rem;line-height:1rem;font-size:.48rem;color:#b74d00;padding:0 .5rem;
    }
    .buyFrom{padding-bottom:2rem;}
    .buyCont{padding:.8rem 0;
       ul{
           padding:0 .5rem;margin-bottom:.3rem;
       }
       li{width:50%;font-size:.58rem;
            span,label{
                display: block;
            }
        }
    }
    .cancell{
      padding-top: .5rem;
      h5{
        font-size: .52rem;
      }
      span{
        font-weight: 700;
      }
      button{
        transform: scale(.9);
      }
    }
    .profit{margin-bottom:0.5rem;padding-top:.2rem;font-size:.58rem;}
    .coupon{padding:0 .5rem;color:#428df0;padding-top:.5rem;text-align:right}
    .danger_tip{text-align:center; font-size:.52rem;padding-top: .5rem;}
}

.useturn{
  text-align: right;
  padding-top: 5px;
  a{
    color: #3184f5;
  }
}
.cell-x-icon{
  fill:gray;
}
.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
  transform: translateX(100%);
}
</style>


