<template>
    <div class="invite">
        <div class="tips">
            <div class="notice clearfix">
                <span class="me-ion-a-volume-up fl"></span>
                <ul class="fl">
                    <li data-content v-for ="(item,index) in tips" :key="index">
                        用户
                        {{item.name | chaTel}}<label>
                            已邀请{{item.phone_number}}位好友，{{item.invest_numberr}}人已投资。
                        </label>
                    </li>
                </ul>
            </div> 
        </div>
        <div style="position: absolute;top:1.5rem;width: 100%;bottom:2.12rem;overflow:auto">
            <div class="main">
                <div class="banner clearfix">
                    <span class="btnDe fr" @click="getUrl">
                        详细规则
                    </span>
                </div>
                <div class="page-bg p-bg01">
                    <div class="width-90">
                        <h3>好友完成注册</h3>
                        <p>双方各得<b>20元</b>红包</p>
                    </div>
                </div>
                <div class="page-bg p-bg02">
                    <div class="width-90">
                        <h3>好友首次投资定期</h3>
                        <p>你获得<b>1%</b>加息券</p>
                    </div>                
                </div>
                <div class="page-bg p-bg03">
                    <div class="width-90">
                        <h3>排名前三名旅游津贴</h3>
                        <p><b>20000元</b>双人出境游</p>
                        <p><b>12000元</b>双人出境游</p>
                        <p><b>8000元</b>双人国内游</p>
                    </div>

                </div>      
            </div>
            <div class="main">
                <div class="width-90 mTop20">
                    <div class="tab-title" data-wrap="layout">
                        <span data-item="col-8">
                            我的邀请记录
                        </span>
                        <label @click="goUrl('inviteRecord')" class="s-t-right"  data-item="col-4">
                            直接邀请记录>
                        </label>
                    </div>
                    <div class="invite-profit">
                        <span>{{totalMoney | my-filter}}</span>
                        获得总收益(元)
                    </div>
                    <table>
                        <tr>
                            <th width="25%"></th>
                            <th width="25%">好友人数</th>
                            <th width="25%">投资笔数</th>
                            <th width="25%">贡献收益</th>
                        </tr>
                        <tr v-for="(item,index) in items" :key="index">
                            <td><span class="s-99">{{item.type=='1'?'直接好友':'间接好友'}}</span></td>
                            <td>{{item.userNumber}}</td>
                            <td>{{item.investNumber}}</td>
                            <td>{{item.income | my-filter }}</td>
                        </tr> 
                    </table>             
                </div>    
            </div>
        </div>
        <div class="foot-fiexd">
            <div class="width-90 clearfix">               
                <button class="fl" @click="wxShow"></button>
                <button class="org fr" @click="goUrl('inviteSc')"></button>
            </div>    
        </div>
        <!--弹窗分享-->
        <div class="f_mask" v-show='stateWx'></div>
        <div class="weixin" v-show='stateWx'>
            <div class="weixin-main clearfix" >
                <span class="fl" @click="shareWechat('wechatFriend')">
                </span>
                <span class="fr wx02" @click="shareWechat('wechatTimeline')">
                </span>
            </div> 
            <p class="closed" @click="closed">
            </p>  
        </div>        
    </div>       
</template>
<script>
import NativeShare from 'nativeshare'
    export default {
        name:'invite',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                show:true,
                stateWx:false,
                totalMoney:'',
                tips:[],
                items:[],
                wxurl:'',
                wxlogUrl:'',
                shareTile:'',
                shareData: {},
            }
        },
        filters:{
            chaTel(v){
                return me.str.str2char(v)
            }
        },
        methods:{
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '邀请好友',
                    headFlag: true
                })
            },
            notice(){
                var $this = this; 
                me.require.ready('carousel',function(){
                    me.CarouselPlug({
                        scrollobj : ".notice",
                        visible:1,
                        scroll:1,
                        mouseOver:false,
                        circular:true,
                        btnGo:false,
                        speed: 700, 
                        auto : 1000,
                        vertical:true
                    });
                });  
            },
            //详情规则url
            getUrl:function(){
                var that = this;
                that.$config.getData({
                    key:"findInterfaceSwitchByType",
                    method:'post',
                    data:{
                        type:1,
                    },
                    callback:function(data){
                        if(data.result == '1') { 
                            var data = data.data;
                            window.location.href = data.url+'&title='+data.title;
                        }
                    }
                }); 
            },
            goUrl:function(url){
                this.$root.goUrl(url);
            },
            wxShow: function(){
                if (this.$config.BrowserInfo.isWeixin) {
                    this.$vux.alert.show({
                        title: '分享提示',
                        content: '请点击微信右上角功能按钮分享'
                    })
                } else if (this.$config.BrowserInfo.isQQMBrowser || this.$config.BrowserInfo.isUCMBrowser) {
                    this.stateWx=true;
                } else {
                    this.handShare()
                }
            },
            closed: function(){
                this.stateWx=false;
            },
             //邀请好友排序
            getDateTop:function(){
                var that = this;
                that.$config.getData({
                    key:"findPhoneRanking",
                    method:'post',
                    data: {
                        year: +new Date().getFullYear()
                    },
                    callback:function(data){
                        if(data.result == '1'){ 
                            if(data.data.result == '1'){
                                var data = data.data;
                                that.tips = data.list;
                                that.$nextTick(() => {
                                    that.notice();
                                })
                            }
                        }
                    }
                }); 
            },
            //查询邀请好友贡献
            getDateInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findPhoneFriendContribute",
                        method:'post',
                        data:{
                            userId:that.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data;
                                that.totalMoney = data.totalIncome;
                                that.items = data.list;
                            }
                        }
                    }); 
                }
               
            },
            //获取微信接口
            getWeixin:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"getUserEncryptionUrl",
                        method:'post',
                        data:{
                            userId:that.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data;
                                that.wxurl = data.url+'&SC_OPERATE=A2&SC_CHANNEL=A2';
                                that.wxlogUrl= data.logUrl;
                                that.shareTile = data.shareTile;
                                that.initShare();
                            }
                        }
                    }); 
                }
               
            },
            //微信分享页面
            async initShare () {
                this.nativeShare = new NativeShare()
                this.shareData = {
                    icon: this.wxlogUrl,
                    link: this.wxurl,
                    title: this.shareTile,
                    desc: '民信贷-是一家专业提供个人借款小额借款的P2P网贷出借服务平台，为出借用户和借款用户双方提供公平、透明、安全、高效的互联网金融服务。在民信贷出借产品，更安全、更专业、更多收益。',
                    from: '@民信贷',
                }
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
            shareWechat (command) {
              // alert('微信分享：分享域名必须要在微信后台配置的安全域名之内')
              //只支持手机端UC浏览器和QQ浏览器
              try {
                this.nativeShare.call(command)
              } catch (err) {
                // 如果不支持，你可以在这里做降级处理
                this.stateWx = false;
                this.handShare()
              }
            },
            handShare () {
              this.$vux.alert.show({
                title: '分享提示',
                content: '将跳转到分享链接，请手动分享',
                onHide: () => {
                  window.location.href = this.wxurl
                }
              })
            },
        },
        mounted(){
           this.activated();
           this.getDateInit();//查询邀请好友贡献
           this.getDateTop()//邀请好友排序
           this.getWeixin();//获取微信接口
        },
        created(){
          me.require(['carousel'],'carousel');
        },

    }
</script>

<style lang="less" scoped>
.invite{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tips{
        position:absolute;;
        top:0;
        left:0px;
        width:100%;
        background:#fff;
        line-height:1.4rem;
        color:#fe6f06;
        box-shadow: 0px 2px 2px #eee;
    }
    .notice{
        position:relative;
        height:1.5rem;
        padding:0 2%;
        overflow: hidden;
        z-index: 0 !important;
        span{font-size:.6rem;color:#fec106;padding-right:.3rem;}
        // label{}
        ul{
            width:93%;
        }
    }
    .main{
         background:#fff;padding-bottom:.5rem;
        .banner{
            background:url(../assets/images/invite/g-bg.jpg) no-repeat center;
            height:8.28rem;
            background-size:auto 8.28rem;
           .btnDe{
               display:inline-block;
               height:.9rem;
               line-height:.8rem;
               border:1px solid #fff;
               color:#fff;
               text-align:center;
               border-radius:20px;
               padding:0 .6rem;
               margin-top:.5rem;
               margin-right:.5rem
           }
        }
        .page-bg{
            width:100%;
            h3{
                padding-top:.8rem;line-height:1.4rem;;
            }
            p{color:#666;}
            b{font-weight:bold}
            .width-90{
                border-bottom:1px solid #eee;
                padding-left:7.0rem;
                min-height:4.12rem;
            }
        }
        .p-bg01{
            background:url(../assets/images/invite/g-bg-m01.jpg) no-repeat;
            background-size:auto 4.12rem;
            h3{color:#dd4303;}
        }
        .p-bg02{
            background:url(../assets/images/invite/g-bg-m02.jpg) no-repeat;
            background-size:auto 4.12rem;
            h3{color:#fea234}
        }
        .p-bg03{
            background:url(../assets/images/invite/g-bg-m03.jpg) no-repeat left .5rem;
            background-size:auto 3.8rem;
            h3{color:#ee76ff;}
            .width-90{
                border-bottom:0;
            }
        }
        .mTop20{
           margin-top:.5rem;
        }
        .tab-title{
            height:1.76rem;
            line-height:1.76rem;
            border-bottom:1px solid #eee;
            label{color:#999;}
        }
        .invite-profit{
            padding:.8rem 0 .8rem 4.8rem;
            background:url(../assets/images/invite/g-bg-icon01.jpg) 3.5rem no-repeat;
            background-size:.94rem auto;
            color:#999;
            font-size:.52rem;
            line-height:.9rem;
            span{display:block;
                color:#fb7a21;
                font-size:.92rem;
            }
        }
        table{
            width:100%;
            th{color:#999}
            td,th{line-height:1.5rem;text-align:center}
        }
    }
    .foot-fiexd{
        position: absolute;
        bottom:0px;
        width:100%;
        background:url(../assets/images/g-in-bg-r.png) repeat-x;
        height:2.12rem;
        background-size:auto 2.12rem;
        button{margin-top:.1rem;
            display:block;
            width:6.14rem;
            height:2rem;
            border:0;
            outline:0;
            background:url(../assets/images/g-in-btn-red.png) no-repeat left;
            background-size:auto 2rem;
        }
        button.org{
            background:url(../assets/images/g-in-btn-org.png) no-repeat right;
            background-size:auto 2rem;
        }
    }
    .f_mask{
        z-index: 0;
    }
    .weixin{
        position:fixed;
        bottom:3.5rem;
        width:100%;
        .weixin-main{
            width:55%;
            border-radius:3px;
            background:#fff;
            margin:0 auto;
            padding:.6rem 1.5rem;
            span{
                display:block;
                width:1.72rem;
                height:1.72rem;
                background:url(../assets/images/g-in-r-wx01.png) no-repeat;
                background-size:auto 1.72rem; 
            }
            span.wx02{
                background:url(../assets/images/g-in-r-wx02.png) no-repeat;
                background-size:auto 1.72rem; 
            }
        }
        .closed{
            width:1.2rem;
            height:1.06rem;
            background:url(../assets/images/g-in-r-closed.png) no-repeat;
            background-size:1.2rem auto;
            margin:.88rem auto;
        }
        
        
    }
}
</style>