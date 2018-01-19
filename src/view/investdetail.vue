<template>
  <div>
    <x-header class="idheader"
      :style="{'background-color': cur==0?'#2875d9':'#fe6f07'}"
      :left-options="leftOptions"
      :title="title" 
      @on-click-back="clickBack">
    </x-header>
    <div class="wrapper">
      <div class="contBox">
        <transition enter-active-class="slideInDown" leave-active-class="slideOutUp">
          <invest-one class="animated" v-show="cur===0" :cur="cur" :pullUp="pullUp" :info="info" :money.sync="money"></invest-one>
        </transition>
        <transition enter-active-class="slideInUp" leave-active-class="slideOutDown">
          <invest-two class="animated" v-show="cur===1" :cur="cur" :pullDown="pullDown"></invest-two>
        </transition>
      </div>
      <template v-if="info.status===2">
        <x-button type="primary" style="background-color: #fe6f07;border-radius:0;" @click.native="buy">立即抢投</x-button>
      </template>
      <template v-else-if="info.status===4||info.status===6||info.status===7||info.status===9">
        <x-button type="primary" disabled style="background-color: #757575;border-radius:0">{{info.status | statusText}}</x-button>
      </template>
    </div>
  </div>
</template>

<script>
import { formpost } from '@/lib/utils'
import { mapGetters, mapActions } from 'vuex'
import InvestOne from '@/components/invest-one'
import InvestTwo from '@/components/invest-two'
import { XHeader, XButton } from 'vux'
import '@/assets/css/animate.min.css'
export default {
  data () {
    return {
      cur: 0,
      info: {},
      money: ''
    }
  },
  components: {
    XHeader,
    XButton,
    InvestOne,
    InvestTwo,
  },
  computed: {
    ...mapGetters(['userId', 'isRealNameAuth', 'isOpenedAccount', 'isOnCard', 'isTransPwd', 'bondTransSignStatus', 'isOldOnCard', 'isOldTransPwd', 'borrowId', 'borrowType', 'depositoryId']),
    leftOptions () {
      return {
        showBack: !0,
        backText: '',
        preventGoBack: !0
      }
    },
    title () {
      return {1: '优选标详情', 2: 'VIP详情', 3: '新手标详情', 4: '优+系列详情'}[this.borrowType]
    },
  },
  filters: {
    statusText (v) {
      return {4: '已流标', 6: '已满标', 7: '还款中', 9: '已完成'}[v]
    }
  },
  methods: {
    ...mapActions(['account', 'borrowinfo', 'findAccountCartMsgAPI', 'findOnlyOneCardInfoAPI', 'checkPayPasswordAPI','getBorrowIdInfoAPI', 'checkBorrowIdStatusAPI']),
    init () {
      this.$store.dispatch('setPageHead', {
        show: false,
        title: {1: '优选标详情', 2: 'VIP详情', 3: '新手标详情', 4: '优+系列详情'}[this.borrowType],
        headFlag: false
      })
    },
    clickBack () {
      this.$router.replace({name: 'invest'})
    },
    getDetail () {
      this.getBorrowIdInfoAPI().then((data) => {
        if (data.result === 1) {
          this.info = data.data
          this.info.startTimeStamp = data.data.startTimeStamp || data.data.investStartTimeStamp
          this.checkBorrowIdStatusAPI().then((res) => {
            this.info.status = res.data.status
            this.info.statusName = res.data.statusName
          })
        }
      })
    },
    findAuth () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'findAuth',
          method: 'post',
          data: {
            userId: this.userId,
            authTypeId: '2'
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    packageJinDunDate () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'packageJinDunDate',
          method: 'post',
          data: {
            userId: this.userId,
            retUrl: this.$config.signcallback,
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    async autoSignClick () {
      this.$vux.loading.show()
      let { data, errorMsg, result } = await this.packageJinDunDate()
      this.$vux.loading.hide()
      if (result === 1) {
        if (data.result === 'success') {
          this.$vux.loading.show({
            text: '跳转中'
          })
          formpost(data.TARGET_URL, data.parameters).then(() => {
          }).catch(() => {
            this.$vux.loading.hide()
          })
        } else {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: data.msg
          })
        }
      } else {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: errorMsg
        })
      }
    },
    validateUser () {
      if (this.borrowType === '1') {//优选标验证
        if (this.isOpenedAccount === 0) {
          this.$vux.confirm.show({
            title: '请先进行开户！',
            confirmText: '立即开户',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'realName'})
            },
          })
        } else if (this.isOnCard === 0) {
          this.$vux.confirm.show({
            title: '请先完成绑卡！',
            confirmText: '立即绑卡',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'bankcardcg', query: { redirect: this.$route.fullPath}})
            },
          })
        } else if (this.isTransPwd === 0) {
          this.$vux.confirm.show({
            title: '请先设置存管账户交易密码！',
            confirmText: '立即设置',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'pwdChange', params: {type: 'changeSetTrans'}, query: { redirect: this.$route.fullPath}})
            },
          })
        } else {
          return true
        }
      } else if (this.borrowType === '2' || this.borrowType === '3' || this.borrowType === '4') {//vip标验证
        if (this.isRealNameAuth === 0) {
          this.$vux.confirm.show({
            title: '请先进行实名认证！',
            confirmText: '立即认证',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'bankcardOld', query: { redirect: this.$route.fullPath}})
            },
          })
        }else if (this.isOldOnCard === 0) {
          this.$vux.confirm.show({
            title: '请先完成绑卡！',
            confirmText: '立即绑卡',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'bankcardOld', query: { redirect: this.$route.fullPath}})
            },
          })
        } else if (this.isOldTransPwd === 0) {
          this.$vux.confirm.show({
            title: '请先设置旧账户交易密码！',
            confirmText: '立即设置',
            hideOnBlur: true,
            onConfirm: () => {
              this.$router.push({name: 'pwdChange', params: {type: 'changeOldTrans'}})
            },
          })
        } else {
          return true
        }
      }
      return false
    },
    async validate () {
      //如果未登录 跳转登录
      if (this.userId === '') {
        this.$router.push({name: 'login', query: { redirect: this.$route.fullPath}})
        return false
      } else {
        //如果非存管标 先验证是否实名
        if (this.isRealNameAuth === '') {
          let { data, errorMsg, result } = await this.findAuth()
          if (result === 1) {
            this.account({
              isRealNameAuth: data.status === '9' ? 1 : 0
            })
          }
        }
        await this.findAccountCartMsgAPI()
        if (this.borrowType === '2' || this.borrowType === '3' || this.borrowType === '4') {
          await this.checkPayPasswordAPI()
        }
        if (this.validateUser()) {
          let { data, errorMsg, result } = await this.checkBorrowIdStatusAPI()
          if (result === 1) {
            if (data.investFlag === 1) {
              if (this.info.depositoryFlag === 1 && this.depositoryId !== '0') {
                if (this.bondTransSignStatus === 0) {
                  this.$vux.confirm.show({
                    title: '您还未开通自动债转签约！',
                    confirmText: '立即开通',
                    onConfirm: () => {
                      this.autoSignClick()
                    },
                  })
                  return false
                }
              }
              return true
            } else {
              if (data.status === 4) {
                this.$vux.toast.show({
                  type: 'text',
                  width: 'auto',
                  text: '抱歉，此项目流标了'
                })
              } else if (data.status === 6) {
                this.$vux.toast.show({
                  type: 'text',
                  width: 'auto',
                  text: '手慢一步，已满标'
                })
              }
              this.getDetail()
            }
          }
        } else {
          return false
        }
        return false
      }
    },
    async buy () {
      if (await this.validate()) {
        this.borrowinfo({
          moneyInputValue: this.money,
        })
        this.$router.push({name: 'buy', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
      }
    },
    pullUp () {
      this.cur = 1
    },
    pullDown (y) {
      this.cur = 0
    },
  },
  created () {
    this.borrowinfo({
      borrowType: this.$route.params.borrowType,
      borrowId: this.$route.params.borrowId,
      depositoryId: this.$route.params.depositoryId,
    }).then(() => {
      this.getDetail()
    })
  },
  mounted () {
    this.init()
  },
}
</script>

<style lang="less" scoped>
.idheader{
  width:100%;position:absolute;top:0;transition: background-color .5s;
  z-index: 1;
}
.wrapper{
  display: flex;
  flex-direction: column;
  position: absolute;
  top:1.9rem;
  bottom:0;
  width: 100%;
  .contBox{
    flex: 1;
    position: relative;
  }
}
</style>
