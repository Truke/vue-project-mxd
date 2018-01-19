<template>
  <div>
    <x-header
      style="background-color: #fe6f07;"
      :left-options="leftOptions"
      :title="title"
      @on-click-back="clickBack">
    </x-header>
    <div class="wrapper">
      <div class='account-container'>
        <div class='transaction-pwd' v-show='showInitPwd'>
          <div class='hint'>
            请输入交易密码
          </div>
          <label class="sixDigitPassword">
            <flexbox :gutter="0">
              <flexbox-item v-for="item,index in pwdInput" :key='index'>
                <i class="fake-input" :class="{'target':(index==password.length && hasFocus)}">
                  <b class="black-dot" v-show="password[index]"></b>
                  <span class='pwd-area'>{{password[index]}}</span>
                </i>
              </flexbox-item>
            </flexbox>
            <input type="tel" v-model="password" :maxlength="maxlength" id='pwd-node' @focus="hasFocus=true" @blur="hasFocus=false"/>
          </label>
        </div>
      </div>
      <div class='account-container rechecker' v-show='!showInitPwd&&C_hasPwd'>
        <div class='transaction-pwd'>
          <div class='hint'>
            请再次输入交易密码
          </div>
          <label class="sixDigitPassword">
            <flexbox :gutter="0">
              <flexbox-item v-for="item,index in rePwdInput" :key='index'>
                <i class="fake-input" :class="{'target':(index==rePassword.length && reHasFocus)}">
                  <b class="black-dot" v-show="rePwdInput[index]"></b>
                  <span class='pwd-area'>{{rePwdInput[index]}}</span>
                </i>
              </flexbox-item>
            </flexbox>
            <input type="tel" v-model="rePassword" :maxlength="maxlength" id='re-pwd-node' @focus="reHasFocus=true" @blur="reHasFocus=false"/>
          </label>
        </div>
      </div>
      <group-title>交易密码由{{maxlength}}位数字组成</group-title>
      <div style="margin-top: 1rem">
        <x-button type="primary" style="background-color: #fe6f07;" @click.native="submit">{{showInitPwd?'下一步':'确定'}}</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { XHeader, Flexbox, FlexboxItem, GroupTitle, XButton } from 'vux'
export default {
  data () {
    return this.initSet()
  },
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    GroupTitle,
    XButton,
  },
  computed: {
    ...mapGetters(['userId', 'isOldTransPwd']),
    leftOptions () {
      return {
        backText: '',
        preventGoBack: !this.showInitPwd
      }
    }
  },
  methods: {
    ...mapActions(['account']),
    init () {
      this.$store.dispatch('setPageHead', {
        show: false,
        title: '设置旧账户交易密码',
        headFlag: true
      })
    },
    clickBack () {
      this.transMode('2nd-1st')
    },
    initSet() {
      let _const = { errorTime: 0, maxlength: 6 }
      let firstInput = {
        pwdInput: new Array(_const.maxlength), //密码转换 w6元数组
        password: '', //密码区域
        hasFocus: false, //是否光标进入
      }
      let initState = {
        showInitPwd: true,
        C_hasPwd: false, //是否已设置过密码
        rePassword: '',
        rePwdInput: new Array(_const.maxlength),
        reHasFocus: false,
        title: '设置旧账户交易密码',
        type: this.$route.params.type,
      }
      return Object.assign(_const, initState, firstInput)
    },
    transMode(type) { //定义页面切换
      let pwdNode = document.getElementById('pwd-node')
      let rePwdNode = document.getElementById('re-pwd-node')
      if (type == '1st-2nd') {
        this.reHasFocus = true //重复密码自动光标进入
        this.C_hasPwd = true
        this.showInitPwd = false
        this.$nextTick(() => {
          pwdNode.blur()
          rePwdNode.focus()
        });
      } else if (type == '2nd-1st') {
        this.hasFocus = true;
        this.showInitPwd = true
        this.$nextTick(() => {
          pwdNode.focus()
          rePwdNode.blur()
        })
      }
    },
    validate (val) {
      if (this.showInitPwd) {
        if (this.password.trim() === '') {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '请填写交易密码'
          })
          return false
        }
        if (!/^\d+$/g.test(this.password) || this.password.length !== this.maxlength) {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '交易密码格式不正确'
          })
          return false
        }
        return true
      } else {
        if (this.rePassword.trim() === '') {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '请填写交易密码'
          })
          return false
        }
        if (this.rePassword !== this.password) {
          this.$vux.toast.show({
            type: 'cancel',
            width: 'auto',
            text: '两次密码必须保持一致'
          })
          return false
        }
        return true
      }
    },
    changePayPassword () {
      let obj = {
        userId: this.userId,
        payPassword: this.$config.cryptoBase64(this.password),
        typeCode: '1',
        isEncode: 2
      }
      this.$config.getData({
        key: 'changePayPassword',
        method: 'post',
        data: Object.assign(obj, {key: this.$config.getKEYMD5(obj)}),
        callback: (data) => {
          if (data.result === 1) {
            if (data.result === 1) {
              this.$vux.toast.show({
                type: 'success',
                width: 'auto',
                text: data.data.msg
              })
              this.account({isOldTransPwd: 1})
              this.$router.replace({name: 'pwdMassage'})
            } else {
              this.$vux.toast.show({
                type: 'cancel',
                width: 'auto',
                text: data.data.msg
              })
            }
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              width: 'auto',
              text: data.errorMsg
            })
          }
        }
      })
    },
    submit () {
      if (this.showInitPwd) {
        if (this.validate(this.password)) {
          this.transMode('1st-2nd')
        }
      } else {
        if (this.validate(this.rePassword)) {
          this.changePayPassword()
        }
      }
      
    }
  },
  watch: {
    password: function(val, oldValue) {
      let reg = /^[\d]*$/
      let isN = reg.test(val)
      if (!isN) {
        this.$nextTick(() => {
          this.password = ''
        })
      } else {
        let newPwdArr = [...val + '']
        if (newPwdArr.length <= this.maxlength) {
          let _empty = new Array(this.maxlength - newPwdArr.length)
          this.pwdInput = [...newPwdArr, ..._empty]
        }
      }
    },
    rePassword: function(val, oldValue) {
      let reg = /^[\d]*$/
      let isN = reg.test(val)
      if (!isN) {
        this.$nextTick(() => {
          this.rePassword = ''
        })
      } else {
        let newPwdArr = [...val + '']
        if (newPwdArr.length <= this.maxlength) {
          let _empty = new Array(this.maxlength - newPwdArr.length)
          this.rePwdInput = [...newPwdArr, ..._empty]
        }
      }
    }
  },
  created () {
    if (this.isOldTransPwd === 1) {
      this.$vux.alert.show({
        title: '提示信息',
        content: '您已设置过旧账户交易密码',
        onHide: () => {
          this.$router.replace({name: 'pwdMassage'})
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
@color-f1:#f1f1f1;
@color-75:#757575;
@color-e9:#E9E9E9;
@color-00:#005EBD;
@color-21:#212121;
@color-e5:#E54A1B;
@color-fe:#FEC9B4;
@color-61:#616161;
@color-bd:#bdbdbd;
.wrapper{
  padding: 0 .6rem;
}
.account-container {
  background: @color-f1;
  width: 100%;
  height: 100%;
  .transaction-pwd {
    margin: auto;
    .hint {
      font-size: 14px;
      color: @color-75;
      text-align: center;
      margin-top: 24px;
    }
    .sixDigitPassword {
      margin: 12px auto;
      background: #fff;
      border: 1px solid @color-e9;
      height: 48px;
      display: block;
      position: relative; 
      &:after {
        clear: both;
        display: block;
        height: 0;
      }
      /*假的input框*/
      input {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        opacity: 0;
        z-index: -1000;
      }
      i.fake-input {
        display: block;
        height: 48px;
        padding: 20px;
        border-right: 1px solid @color-e9;
        background: #fff;
        position: relative; 
        &.target { 
          background:#fff url('../assets/images/password-blink.gif') no-repeat center center;
          b {
            display: none;
          }
        }
        .pwd-area {
          display: none;
        }
        b {
          display: block;
          margin: 0 auto;
          width: 7px;
          height: 7px;
          border-radius: 7px;
          background: black;
        }
      }
    }
    .show-pwd {
      margin-top: 12px;
      font-size: 14px;
      position: relative;
      text-align: center;
      .show-btn {
          color: @color-00;
          position: absolute;
          right: 0;
          top: 0;
        }
        .validator-msg {
          color: @color-75;
        }
    }
  }
}

</style>
