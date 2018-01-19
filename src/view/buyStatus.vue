<template>
  <div>
    <x-header
      style="background-color: #fe6f07;"
      :left-options="leftOptions"
      :title="title"
      @on-click-back="clickBack">
    </x-header>
    <div class="wrapper">
      <a @click="wxShow" class="sharetoreg">
        <img src="../assets/images/c-icon_share.png" alt="">
      </a>
      <div class="statusTop">
        <i class="weui-icon weui_icon_success-no-circle weui-icon-success-no-circle"></i>
        <h3>购买成功</h3>
      </div>
      <div class="statusCont">
        <router-link :to="{name: 'invest'}" replace>
          <x-button type="primary" style="background-color: #fe6f07;border-radius: 1rem;">继续投资</x-button>
        </router-link>
        <router-link :to="{name: 'ucenter'}" replace>
          <x-button style="background-color: #fff;">进入账户中心</x-button>
        </router-link>
      </div>
      <div class="area" :class="{'active':showShare}">
        <h6 class="vux-1px-t">分享到</h6>
        <div class="sharecont">
          <a class="sharecell" @click="shareWechat('wechatFriend')"><img src="../assets/images/c-icon_wx.png" alt=""><span>微信好友</span></a>
          <a class="sharecell" @click="shareWechat('wechatTimeline')"><img src="../assets/images/c-icon_pyq.png" alt=""><span>朋友圈</span></a>
        </div>
        <p><span class="vux-close" @click="showShare=false"></span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XHeader, XButton } from 'vux'
import NativeShare from 'nativeshare'
import 'vux/src/styles/weui/weui.less'
import 'vux/src/styles/close.less'
export default {
  data () {
    return {
      title: '立即抢投',
      borrowId: this.$route.params.borrowId,
      borrowType: this.$route.params.borrowType,
      depositoryId: this.$route.params.depositoryId,
      status: null,
      showShare: false,
      nativeShare: null,
      shareData: {
        title: this.borrowTitle,
        desc: '民信贷-是一家专业提供个人借款小额借款的P2P网贷出借服务平台，为出借用户和借款用户双方提供公平、透明、安全、高效的互联网金融服务。在民信贷出借产品，更安全、更专业、更多收益。',
        // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
        link: '',
        icon: location.origin + location.pathname + '/static/images/icon.png',
        from: '@民信贷',
      }
    }
  },
  components: {
    XHeader,
    XButton,
  },
  computed: {
    ...mapGetters(['userId', 'borrowTitle']),
    leftOptions () {
      return {
        showBack: !0,
        backText: '',
        preventGoBack: !0
      }
    }
  },
  methods: {
    init () {
      this.$store.dispatch('setPageHead', {
        show: false,
        title: '立即抢投',
        headFlag: false
      })
    },
    async initShare () {
      this.nativeShare = new NativeShare()
      let config = await this.$config.getSign(encodeURIComponent(location.href.split('#')[0]))
      this.nativeShare.setConfig({
        wechatConfig: {
          debug: this.$config.phonetest,
          appId: config.appId,
          timestamp: config.timestamp,
          nonceStr: config.nonceStr,
          signature: config.signature,
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
        }
      })
      this.nativeShare.setShareData(this.shareData)
    },
    wxShow () {
      if (this.$config.BrowserInfo.isWeixin) {
        this.$vux.alert.show({
            title: '分享提示',
            content: '请点击微信右上角功能按钮分享'
        })
      } else if (this.$config.BrowserInfo.isQQMBrowser || this.$config.BrowserInfo.isUCMBrowser) {
          this.showShare=true;
      } else {
          this.handShare()
      }
    },
    shareWechat (command) {
      // alert('微信分享：分享域名必须要在微信后台配置的安全域名之内')
      //只支持手机端UC浏览器和QQ浏览器
      try {
        this.nativeShare.call(command)
      } catch (err) {
        // 如果不支持，你可以在这里做降级处理
        this.showShare = false
        this.handShare()
      }
    },
    handShare () {
      this.$vux.alert.show({
        title: '分享提示',
        content: '将跳转到分享链接，请手动分享',
        onHide: () => {
          window.location.href = this.shareData.link
        }
      })
    },
    clickBack () {
      this.$router.replace({name: 'buy', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
    },
    getUserEncryptionUrl () {
      return new Promise((resolve, reject) => {
        this.$config.getData({
          key: 'getUserEncryptionUrl',
          method: 'post',
          data: {
            userId: this.userId
          },
          callback: (data) => {
            resolve(data)
          }
        })
      })
    },
    async setShareInfo () {
      let { data, errorMsg, result } = await this.getUserEncryptionUrl()
      if (result === 1) {
        this.shareData.title = data.shareTile
        this.shareData.link = data.url + "&SC_OPERATE=A2&SC_CHANNEL=A2"
        this.shareData.icon = data.logUrl
      }
      this.initShare()
    }
  },
  mounted () {
    this.init()
    this.setShareInfo()
  },
}
</script>
<style lang="less" scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  position: absolute;
  top:1.9rem;
  left: 0;
  bottom:0;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  .sharetoreg{
    position: absolute;
    right: .5rem;
    top:.5rem;
    img{
      width: 1.2rem;
    }
  }
  .statusTop{
    width: 6rem;
    height: 6rem;
    border: 1px solid;
    border-radius: 3rem;
    margin: 3rem auto 1rem;
    color: #fe6f07;
    i{
      color: #fe6f07;
      font-size: 2rem;
      margin-top: 1.2rem;
    }
    h3{
      font-size: .8rem;
    }
  }
  .statusCont{
    flex: 1;
    width: 8rem;
    margin: .5rem auto;
    .weui-btn_default{
      margin-top: 1.2rem;
      color: #fe6f07;
      &:after{
        border-color: #fe6f07;
        border-radius: 4rem;
      }
    }
  }
  .area{
    position: absolute;
    bottom:0;
    left:0;
    right:0;
    background-color: #fff;
    transition: transform .5s;
    transform: translateY(100%);
    &.active{
      transform: translateY(0);
    }
    h6{
      line-height: 1.2rem;
    }
    .sharecont{
      width: 80%;
      margin: 0 auto;
      font-size: 0;
      text-align: center;
      .sharecell{
        display: inline-block;
        vertical-align: middle;
        width: 40%;
        img{
          height: 1.8rem;
        }
        span{
          display: block;
          padding-top: 3px;
          font-size: .5rem;
        }
      }
    }
  }
}
</style>