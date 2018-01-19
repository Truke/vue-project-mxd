<template>
    <div class="index">
        <div class="banner" data-scroll-m="">
            <ul>
                <li data-content="" v-for="(item,index) in banners" :key="index">     
                    <a :href="item.hypeLink" :title="item.title"><img :src="item.url" alt=""></a>
                </li>   
            </ul>
            <div class="banner-page" v-if="banners.length>1">
                 <span v-for="(item,index) in banners"></span>
            </div>
        </div>
        <div v-if="userId" class="notice clearfix">
            <span class="fl">投资金额<b>&nbsp;{{sumMoney}}</b>元</span>
            <span class="fr"><b>{{sumPeople}}</b>&nbsp;用户</span>
        </div>
        <ul class="icons-menu">
            <li v-for="(item,index) in iconLists" :key="index">
                <dl @click="goTo(item.icon_url)">
                    <dt><img :src="item.pic_url" alt=""></dt>
                    <dd>{{item.title}}</dd>
                </dl>
            </li>  
        </ul>
        <div class="scrollCon" v-if="!userId">
            <div class="noticeScroll clearfix">
                <i class="fl"></i>
                <ul class="fl">
                    <li data-content="" >
                        <span>累计投资金额(元)</span>
                        <p class="s-org">{{sumMoney}}</p>
                    </li>
                    <li data-content="" >
                        <span>累计投资用户</span>
                        <p class="s-org">{{sumPeople}}</p>
                    </li>
                </ul>
                <button class="me-u-btn" data-color="orange" @click="goTo('login')">登录／注册</button>
            </div>
        </div>
        <index-list :prList="prLists"></index-list>
        <div class="tip">
            <span>市场有风险  投资需谨慎</span>
        </div>
    </div>
</template>

<script>
export default {
  name : "index",
  data () {
    return {
        userId: me.cookie.getItem("userId") || "",
        isVip: me.cookie.getItem("isVip") || 0, //1是VIP,0否
        isVips:0, //0未登录,1普通用户,2.VIP用户
        banners:[],
        sumMoney:"",
        sumPeople:"",
        iconLists:[
            {pic_url:require('@/assets/images/index/s_icon1.png'),icon_url:'newGuide',title:"新手引导"},
            {pic_url:require('@/assets/images/index/s_icon2.png'),icon_url:'invest?from=index',title:"优选标"},
            {pic_url:require('@/assets/images/index/s_icon3.png'),icon_url:'download',title:"下载APP"},
            {pic_url:require('@/assets/images/index/s_icon4.png'),icon_url:'invite',title:"邀请好友"}
        ],
        prLists:{
            newBorrow:{},
            borrow:{},
            youPlusBorrow:{},
            vipBorrow:{}
        }
     }
   },
   methods:{
       init(){
           this.$store.dispatch('setPageHead', {
             show: false,
             title: '首页',
             headFlag: false
          });
       },
       banner(){
           var $this = this;
           $this.$config.getData({
              key:"banner",
              method:"post",
              data:{
                nodeId:233
              },
              callback:function(data){
                if(data.result == "1"){
                    $this.banners = data.data.list; 
                    if($this.banners.length>1){
                        $this.$nextTick(function(){
                            me.require.ready('carousel',function(){
                                me.CarouselPlug({
                                    scrollobj : ".banner",
                                    visible:1,
                                    scroll:1,
                                    circular:true,
                                    pagesBox : "banner-page",
                                    btnGo:true,
                                    auto : 6000,
                                    currentPage : "curs",
                                    speed: 300, 
                                    touch : true
                                });
                            });
                        });
                    }  
                 }
              }
           }); 
       },
       notice(){
             var $this = this; 
             $this.$config.getData({
                key:"getInvestTotal",
                method:"post",
                data:{
                    name:"investTotal",
                    type:"appHomePage"
                },
                callback:function(data){
                    if(data.result == "1"){  
                        $this.sumMoney = data.data.code.split("|")[0];
                        $this.sumMoney = $this.sumMoney.replace("元","");
                        $this.sumPeople = data.data.code.split("|")[1];
                        if(!$this.userId){
                            $this.$nextTick(function(){
                                me.require.ready('carousel',function(){
                                    me.CarouselPlug({
                                        scrollobj : ".noticeScroll",
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
                            })
                        }
                     }
                }
           }); 
       },
       getList(){      
            var $this = this;
            if(!$this.userId){
                $this.isVips = 0;
            }else if($this.userId && $this.isVip==0){
                $this.isVips = 1;
            }else if($this.userId && $this.isVip==1){
                $this.isVips = 2;
            }
            $this.$config.getData({
                key:'newFindHomePageRecommand',
                method:'post',
                data: {
                    userId:$this.userId,
                    isVip:$this.isVips
                },
                callback: function (data) {
                    var result = data.data;
                    if (data.result == '1') {
                        if(!$this.userId || $this.userId && $this.isVip == 0){
                            $this.prLists.newBorrow = result.newBorrow || {};
                            $this.prLists.borrow = result.borrow  || {};
                            $this.prLists.youPlusBorrow = result.youPlusBorrow  || {};
                        }else if($this.userId && $this.isVip == 1){
                            $this.prLists.newBorrow = result.newBorrow || {};
                            $this.prLists.borrow = result.borrow  || {};
                            $this.prLists.youPlusBorrow = result.youPlusBorrow  || {};
                            $this.prLists.vipBorrow = result.vipBorrow || {};
                        }
                    }
                }
            });  
        },
        goTo(url){
            this.$root.goUrl(url);
        }
   },
    mounted(){
        this.init();
        this.banner();
        this.notice();
        this.getList();
    },
    created(){
        me.require(['carousel'],'carousel');
    }
}
</script>
<style lang="less" scoped>
   .icons-menu{
        padding: .5rem 0 .4rem 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: space-around;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background:#fff;
        margin-bottom:.4rem;
        li dl{
            color: #5f5f5f;
            text-align: center;
            img{
                display: inline-block;
                width: 1.92rem;
                height:1.92rem;
            }
            dd{
                height:1rem;
                line-height:1rem;
                overflow:hidden;
            }
        }
    }
   .banner{
        height:6.92rem;
        overflow: hidden;
        li img{width: 100%; height:6.92rem;}
        .banner-page {
            width: 100%;
            position: absolute;
            text-align: center;
            bottom: 0.2rem;
            z-index:99;
            span{
                width: 0.3rem;
                height: 0.3rem;
                margin: 0 0.15rem;
                display: inline-block;
                border-radius:50%; 
                overflow: hidden;
                background:#fff;
                opacity:0.5;
             }
             span.curs {
                background: #fff; 
                opacity:1;    
             }
        }
    }
    .notice{
        height:1.2rem;
        line-height:1.2rem;
        padding:0 .5rem;
        overflow:hidden;
        b{
            font-size:.56rem;
            color:#000;
        }
    }
    .scrollCon{
        background:#fff;
        padding:.4rem 0;
        .noticeScroll{
            height: 2rem !important;
            overflow: hidden;
            position: relative;
            i{  
                width:1.24rem;
                height:1.26rem;
                background:url(../assets/images/index/z_sicon.png) no-repeat center center;
                background-size:100%;    
                margin:.4rem 0 0 .8rem;       
            }
            ul{
                width: 50%;
                li{
                    color: #333; 
                    margin-left: .8rem; 
                    height: 100%; 
                    p{
                        font-size:.72rem;
                    }
                }
            }
            button{
                width:3.66rem;
                height:1.36rem;
                line-height:1.36rem;
                overflow:hidden;
                text-align:center;
                padding:0; 
                position:absolute;
                top:.3rem;
                right:.7rem;
                font-size:.6rem;
                color:#fff;
                background:#ffa200;
                border-radius:3px;
            }
        }
    }
   .tip{
       text-align:center;
       color:#2a2a2a;
       height:1rem;
       line-height:1rem;
       margin:.8rem 0;
       img,span{display: inline-block;}
       img{
         width: .56rem;
         height: .7rem;
         margin:-.1rem .4rem 0 0;
        }
    }
</style>

