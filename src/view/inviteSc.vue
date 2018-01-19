<template>
    <div class="inviteSc">
        <div class="ucenter-bg">
             <div class='saoma'>
                 <h2>我的专属邀请二维码</h2>
                 <p>{{tel}}</p>
                 <div class="sm-pic" id="qrcode">
                 </div>
                 <p>
                     直接扫描二维码或者将二维码截图发送给好友
                 </p>
             </div>      
        </div> 
    </div>
</template>
<script>
export default {
  name: "inviteSc",
  data() {
    return {
      userId: me.cookie.getItem("userId"),
      tel: "",
      src: ""
    };
  },
  methods: {
    activated() {
      this.$store.dispatch("setPageHead", {
        show: true,
        title: "面对面邀请",
        headFlag: true
      });
    },
    //获取接口
    getDataInit: function() {
      var that = this;
      if (me.cookie.getItem("userId")) {
        this.tel = me.str.str2char(me.cookie.getItem("phone"), 3, 4, "*");
        that.$config.getData({
          key: "getUserEncryptionUrl",
          method: "post",
          data: {
            userId: that.userId
          },
          callback: function(data) {
            if (data.result == "1") {
              var data = data.data;
              that.src = data.url + "&SC_OPERATE=A2&SC_CHANNEL=A2";
              $.getScript("static/lib/qrcode.min.js",function(){
                    let qrcode = new QRCode("qrcode", {
                    width: 200,
                    height: 200
                  });
                  qrcode.makeCode(that.src);
              });
              
            }
          }
        });
      }
    }
  },
  mounted() {
    this.activated();
    this.getDataInit();
  }
};
</script>

<style lang="less" scoped>
.ucenter-bg {
  background: #fff;
  margin: 1.5rem 1.2rem;
  .saoma {
    padding: 0.6rem;
    text-align: center;
    h2 {
      font-size: 0.6rem;
    }
    p {
      color: #999;
      font-size: 0.5rem;
    }
    .sm-pic {
      margin: 1rem auto;
    }
  }
}
</style>
<style lang="less">
.sm-pic {
  img {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
}
</style>