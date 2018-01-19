<template>
  <div>
    <div class="wrapper">
      <group :title="text" class="weui-cells_form">
        <template v-if="type==='changeOldTrans'">
          <x-input type="text" placeholder="真实姓名" :show-clear="nameClear" v-model="name" @on-focus="onFocus('nameClear')" @on-blur="onBlur('nameClear')"></x-input>
          <x-input type="text" placeholder="身份证号" :show-clear="IDcardIClear" v-model="IDcardI" @on-focus="onFocus('IDcardIClear')" @on-blur="onBlur('IDcardIClear')"></x-input>
        </template>
        <send-code :code.sync="code" maxPerSecond="120" :phone="phone"></send-code>
      </group>
      <div style="margin-top: 1rem">
        <x-button type="primary" style="background-color: #fe6f07;" @click.native="nextStep">下一步</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formpost } from '@/lib/utils'
import { mapGetters } from 'vuex'
import SendCode from '@/components/sendCode'
import { Group, XInput, XButton } from 'vux'
export default {
  data () {
    return {
      type: this.$route.params.type,
      types: {
        'changeSetTrans': '设置存管账户交易密码',
        'changeOldTrans': '设置旧账户交易密码',
        'changeLogin': '修改登录密码'
      },
      name: '',
      nameClear: true,
      IDcardI: '',
      IDcardIClear: true,
      code: '',
    }
  },
  computed: {
    ...mapGetters(['userId', 'phone', 'isRealNameAuth', 'realName', 'IDcard']),
    text () {
      return this.$route.params.type === 'changeOldTrans' ? '' : ('向' + this.rephone(this.phone) + '发送短信，请输入收到的短信验证码')
    }
  },
  components: {
    Group,
    XInput,
    XButton,
    SendCode,
  },
  methods: {
    init () {
      this.$store.dispatch('setPageHead', {
        show: true,
        title: this.types[this.$route.params.type],
        headFlag: true
      })
    },
    rephone (v) {
      return (v || '').trim().replace(/(\d{3})\d{4}(\d{4})/g,'$1****$2')
    },
    validate () {
      if (this.type === 'changeOldTrans') {
        if (this.IDcardI.trim() === '') {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '请填写身份证号'
          })
          return false
        }
        if (me && !me.validate.IDCard(this.IDcardI)) {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '身份证号格式不正确'
          })
          return false
        }
      }
      if (this.code.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '请填写短信验证码'
        })
        return false
      }
      return true
    },
    verifyUserNameCardNoAndCaptcha () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'verifyUserNameCardNoAndCaptcha',
          method: 'post',
          data: {
            userId: this.userId,
            userName: this.name,
            cardNo: this.IDcardI,
            phoneCaptcha: this.code
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    provingCaptcha () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'provingCaptcha',
          method: 'post',
          data: {
            mobilePhone: this.phone,
            content: this.code
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    setTransPwd () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'setTransPwdH5',
          method: 'post',
          data: {
            userId: this.userId,
            successUrl: this.$config.refreshurl + '/pwdMassage',
            failureUrl: this.$config.refreshurl + '/pwdMassage'
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    async getSetTransPwdUrl () {
      let { data, errorMsg, result } = await this.setTransPwd()
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
    async nextStep () {
      if (this.validate()) {
        let route = {name: '', params: {type: this.type}}
        if (this.type === 'changeLogin' || this.type === 'changeSetTrans') {
          let { data, errorMsg, result } = await this.provingCaptcha()
          if (result === 1) {
            if (data.result === 1) {
              if (this.type === 'changeLogin') {
                route.name = 'pwdChangeLogin'
                this.$router.replace(route)
              } else if (this.type === 'changeSetTrans') {
                this.getSetTransPwdUrl()
              }
              
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                width: 'auto',
                text: data.Msg
              })
            }
          }
        } else if (this.type === 'changeOldTrans') {
          route.name = 'pwdSetOld'
          let { data, errorMsg, result } = await this.verifyUserNameCardNoAndCaptcha()
          if (result === 1) {
            if (data.result === 1) {
              this.$router.replace(route)
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                width: 'auto',
                text: data.msg
              })
            }
          }
        }
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
    }
  },
  mounted () {
    this.init()
    if (this.isRealNameAuth === 1) {
      this.name = this.realName
      this.IDcardI = this.IDcard
    }
  },
}
</script>
<style lang='less' scoped>
.wrapper{
  padding: 0 .6rem;
  overflow: hidden;
  .weui-cells{
    background-color: transparent;
  }
}
</style>
