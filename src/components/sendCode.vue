<template>
  
    <x-input type="number" class="weui-vcode" placeholder="短信验证码" :show-clear="false" :max="6" :value="code" @on-change="onInput">
      <x-button class="send-code" slot="right" mini style="background-color: transparent;" :class="{'verifycode-unavailable': perSecond !== maxPerSecond}"  @click.native="sendCode">{{ tips }}</x-button>
    </x-input>
  
</template>

<script>
import { Group, XInput, XButton } from 'vux'

export default {
  //channel 注册 如果手机号已存在 已注册过 就不能再次注册
  //alone 找回登录密码 如果手机号不存在 则没有注册过 也就无所谓找回密码
  props: ['code', 'phone', 'alone', 'maxPerSecond', 'type', 'channel'],
  data () {
    return {
      codeClear: true,
      interval: 0,
      perSecond: 60,
      tips: '获取验证码',
    }
  },
  components: {
    Group, 
    XInput, 
    XButton,
  },
  methods: {
    phoneOne () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'regTel',
          method: 'post',
          data: {
              mobilePhone:this.phone
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    validatePhone () {
      let vali = /^1(([3|5|7|8][\d]{9})|(47|45)[\d]{8})$/
      if (this.phone.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '手机号不能为空'
        })
        return false
      } else if (this.$config.phonetest && this.phone.trim().startsWith('1110') && this.phone.trim().length === 11) {
        return true
      } else if (vali.test(this.phone.trim())) {
        return true
      } else {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '手机号码格式不正确'
        })
        return false
      }
    },
    async sendCode () {
      if (!this.validatePhone()) return
      //注册、找回密码需要验证手机号唯一性
      if (this.channel === '0' || this.alone) {
        let {data, errorMsg, result} = await this.phoneOne()
        if (result !== 1) {
          return
        }
        if (this.channel === '0' && data.result === '1') {
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            text: '手机号码已经存在，请登录'
          })
          return
        }
        if (this.alone && data.result === '0') {
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            text: '手机号码不存在，请注册'
          })
          return
        }
      }
      if (this.perSecond !== this.maxPerSecond) return
      this.$vux.loading.show({
        text: '发送中'
      })
      this.$config.getData({
        key: 'regGetMsg',
        method: 'post',
        data: Object.assign({
          mobilePhone: this.$config.RSAkey(this.phone.trim()),
          client: 1
        }, (this.type ? {type: this.type} : {}), (this.channel === '0' ? {channel: 0} : {})),
        callback: (data) => {
          this.$vux.loading.hide()
          if (typeof data === 'string') {
            data = JSON.parse(data || '{}')
          }
          if (data.result === 1) {
            if (data.data.result === 1) {
              this.$vux.toast.show({
                type: 'text',
                width: 'auto',
                text: '短信验证码已发送成功，请在有效期内使用'
              })
              this.countDown()
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                width: 'auto',
                text: data.data.Msg
              })
              this.refresh()
            }
          } else if (data.result === 0) {
            this.$vux.toast.show({
              type: 'cancel',
              width: 'auto',
              text: data.errorMsg
            })
            this.refresh()
          }
        }
      })
    },
    countDown () {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        let second = this.perSecond
        if (second > 0) {
          this.perSecond = second - 1
          this.tips = (second - 1) + 's重新发送'
        } else {
          clearInterval(this.interval)
          this.perSecond = this.maxPerSecond
          this.tips = '重新发送'
        }
      }, 1000)
    },
    onInput (v) {
      this.$emit('update:code', v)
    },
    refresh () {
      clearInterval(this.interval)
      this.perSecond = this.maxPerSecond
      this.tips = '获取验证码'
    }
  },
  mounted () {
    this.perSecond = this.maxPerSecond
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="less" scoped>
  .weui-vcode{
    padding-right: 0;
    button{
      vertical-align: middle;
    }
  }
  .send-code{
    background-color: transparent;
    color: #fe6f07;
    &:after{
      border:none;
      border-left: 1px solid #ccc;
      border-radius: 0;
    }
  }
  .verifycode-unavailable{
    color: #999;
  }
</style>
