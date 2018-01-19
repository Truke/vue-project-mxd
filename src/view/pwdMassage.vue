<template>
  <div>
    <x-header
      style="background-color: #fe6f07;"
      :left-options="leftOptions"
      :title="title"
      @on-click-back="clickBack">
    </x-header>
    <div class="wrapper">
      <group>
        <cell title="设置存管账户交易密码" :value="(isTransPwd===0||isOpenedAccount===0)?'未设置':'已设置'" :is-link="isOpenedAccount===0||isTransPwd===0" @click.native="prevTransLink" style="font-size: .48rem;height:1.7rem"></cell>
        <cell title="设置旧账户交易密码" :value="isOldTransPwd===0?'未设置':'已设置'" :is-link="isOldTransPwd===0" @click.native="prevOldLink" style="font-size: .48rem;height:1.7rem"></cell>
        <cell title="修改登录密码" value="" is-link :link="{name: 'pwdChange', params: {type: 'changeLogin'}}" style="font-size: .48rem;height:1.7rem"></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { XHeader, Group, Cell } from 'vux'
export default {
  data () {
    return {
      title: '密码管理'
    }
  },
  components: {
    XHeader,
    Group,
    Cell,
  },
  computed: {
    ...mapGetters(['userId', 'isRealNameAuth', 'isOpenedAccount', 'isOnCard', 'isTransPwd', 'isOldOnCard', 'isOldTransPwd']),
    leftOptions () {
      return {
        showBack: !0,
        backText: '',
        preventGoBack: !0
      }
    }
  },
  methods: {
    ...mapActions(['account', 'findAccountCartMsgAPI', 'findOnlyOneCardInfoAPI', 'checkPayPasswordAPI']),
    init () {
      this.$store.dispatch('setPageHead', {
        show: false,
        title: '密码管理',
        headFlag: false
      })
    },
    clickBack () {
      this.$router.replace({name: 'userSet'})
    },
    prevTransLink () {
      if (this.isOpenedAccount === 0) {
        this.$vux.alert.show({
          title: '请先完成开户',
          onHide: () => {
            this.$router.push({name: 'realName'})
          }
        })
      } else if (this.isOpenedAccount === 1 && this.isTransPwd === 0) {
        this.$router.push({name: 'pwdChange', params: {'type': 'changeSetTrans'}})
      }
    },
    prevOldLink () {
      if (this.isOldOnCard === 0) {
        this.$vux.alert.show({
          title: '请先完成绑卡',
          onHide: () => {
            this.$router.push({name: 'bankcardOld'})
          }
        })
      } else if (this.isOldOnCard === 1 && this.isOldTransPwd === 0) {
        this.$router.push({name: 'pwdChange', params: {'type': 'changeOldTrans'}})
      }
    },
  },
  created () {
    this.findAccountCartMsgAPI()
    this.findOnlyOneCardInfoAPI()
    this.checkPayPasswordAPI()
  },
  mounted () {
    this.init()
  },
}
</script>
<style lang='less' scoped>
.wrapper{
  .weui-cells{
    :first-child{
      margin-top:0;
    }
  }
}
</style>
