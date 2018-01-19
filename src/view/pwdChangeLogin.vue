<template>
  <div>
    <div class="wrapper">
      <group>
        <x-input :type="type" placeholder="当前登录密码" :show-clear="passwordClear" v-model="password" @on-focus="onFocus('passwordClear')" @on-blur="onBlur('passwordClear')"></x-input>
        <x-input :type="type" placeholder="新登录密码" :show-clear="newpasswordClear" v-model="newpassword" @on-focus="onFocus('newpasswordClear')" @on-blur="onBlur('newpasswordClear')"></x-input>
      </group>
      <group-title style="padding-left: 3px">密码由8-16位英文字母、数字或符号组成</group-title>
      <check-icon :value.sync="showPwd" type="plain">显示密码</check-icon>
      <div style="margin-top: 1rem">
        <x-button type="primary" style="background-color: #fe6f07;" @click.native="submit">确定</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Group, GroupTitle, XInput, XButton, CheckIcon } from 'vux'
export default {
  data () {
    let self = this
    return {
      password: '',
      passwordClear: true,
      newpassword: '',
      newpasswordClear: true,
      showPwd: false,
    }
  },
  components: {
    Group,
    GroupTitle,
    XInput,
    XButton,
    CheckIcon,
  },
  computed: {
    ...mapGetters(['userId']),
    type () {
      return this.showPwd ? 'text' : 'password'
    }
  },
  methods: {
    init () {
      this.$store.dispatch('setPageHead', {
        show: true,
        title: '修改登录密码',
        headFlag: true
      })
    },
    validatePwd () {
      let passWordReg =  /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/
      if (this.password.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '当前登录密码不能为空'
        })
      } else if (this.newpassword.trim() === '') {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '新登录密码不能为空'
        })
      } else if (!passWordReg.test(this.password)) {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '当前登录密码格式不正确'
        }) 
      } else if (!passWordReg.test(this.newpassword)) {
        this.$vux.toast.show({
          type: 'cancel',
          width: 'auto',
          text: '新登录密码格式不正确'
        }) 
      }else {
        return true
      }
      return false
    },
    modifyPassword () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'modifyPassword',
          method: 'post',
          data: {
            userId: this.userId,
            oldPassword: this.$config.cryptoBase64(this.password),
            password: this.$config.cryptoBase64(this.newpassword),
            isEncode: 2
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
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
    async submit () {
      if (this.validatePwd()) {
        let { data, errorMsg, result } = await this.modifyPassword()
        if (result === 1) {
          if (data.result === '1') {
            this.$vux.toast.show({
              type: 'success',
              text: data.msg
            })
            setTimeout(() => {
              this.$router.replace({name: 'pwdMassage'})
            }, 1000)
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
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  padding: 0 .6rem;
  
}
</style>
