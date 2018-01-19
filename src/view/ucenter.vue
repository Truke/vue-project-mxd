<template>
    <div class="ucenter">
        <div class="main-top clearfix">
            <div class="nav-top">
                <span @click="goUrl('userSet')">{{userTel}}<b></b></span>
            </div>
            <div class="total s-t-center" @click="goUrl('collect')">
                <p>待收总额（元）</p>
                <b>{{unincomeAmount | my-filter}}</b>
            </div>
            <div class="profit" data-wrap="layout">
                <div data-item="col-6" @click="goUrl('yesterday')">
                    <p>昨日收益</p>
                    <b>{{yestdayIncome | my-filter}}</b>
                </div>
                <div data-item="col-6" @click="goUrl('cumulative')">
                    <p>累计收益</p>
                    <b>{{incomeInterest | my-filter}}</b>
                </div>
            </div>
            <div class="width-90">
                <div class="main-center">
                    <ul class="" data-wrap="layout">
                        <li data-item="col-3">
                            <span class="mxdLogo">
                                旧账户
                            </span>
                        </li>
                        <li data-item="col-6" >
                            <div @click="goUrl('available',{type:'v'})">
                                <p>可用金额</p>
                                <p><b>{{availableAmount | my-filter}}</b></p>
                            </div>
                            <p><label>冻结金额<i>{{freezeAmount | my-filter}}</i></label></p>
                        </li>
                        <li class="clearfix btn" data-item="col-3">
                            <button class="u-btn-small fl" @click.stop="checkRecharge">充值</button>
                            <button class="u-btn-small blue fr" @click="appShow">提现</button>
                        </li>
                    </ul>    
                </div>
                <div class="main-center">
                    <ul class="" data-wrap="layout">
                        <li data-item="col-3">
                            <span class="bankLogo">
                                银行存管
                            </span>
                        </li>
                        <li data-item="col-6" >
                            <div @click="goUrl('available',{type:'cg'})">
                                <p >可用金额<label class="askBtn" @click.stop="showInti"><b class="me-ion-o-help"></b></label></p>
                                <p><b>{{availableAmountcg | my-filter}}</b></p>
                            </div>
                            <p><label>冻结金额<i>{{freezeAmountcg | my-filter}}</i></label></p>
                        </li>
                        <li class="clearfix btn" data-item="col-3">
                            <button class="u-btn-small fl" @click="checkRechargecg">充值</button>
                            <button class="u-btn-small blue fr" @click="appShow">提现</button>
                        </li>
                    </ul>    
                </div>
            </div>        
        </div>
        <div class="main-foot">
            <ul class="list" data-wrap="layout">
                <li data-item="col-6">
                   <span @click="goUrl('investManage')">投资管理</span>
                </li>
                <li  class="g-u-iocn02" data-item="col-6">
                   <span @click="goUrl('coupon')">我的券</span>
                </li>
                <li class="g-u-iocn03" data-item="col-6">
                    <span @click="goUrl('invite')">邀请好友</span>
                </li>
            </ul>    
        </div>
        <div class="f_mask" v-show="showResult.flage">
        </div>    
        <div class="markMgs" v-show="showResult.flage">
            <p>{{showResult.msg}}</p>
            <button class="me-u-btn" data-size = block  data-color="orange" @click="goUrl(showResult.type)">
                {{showResult.msgBtn}}
            </button>    
        </div>    
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    export default {
        name:'ucenter',
        data(){
            return {
               userTel:"",
               unincomeAmount:"0.00",
               yestdayIncome:"0.00",
               incomeInterest:"0.00",
               freezeAmount:"0.00",//旧账户
               availableAmount:"0.00",
               freezeAmountcg:"0.00",//存管
               availableAmountcg:"0.00",
               showResult:{
                   flage:false,
                   msg:"",
                   msgBtn:"",
                   type:"",
               },
               userId:me.cookie.getItem("userId"),
            }
            
        },
        methods:{
            ...mapActions(['findAccountCartMsgAPI']),
            //头部显示
            init () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '我的账户',
                    headFlag: false
                })
            },
            //页面跳转
            goUrl:function(url,data){
                if(this.showResult.type=="realName"){
                    this.$root.goUrl('realName')
                }else if(this.showResult.type=="bankcard"){
                    this.$root.goUrl('bankcard')
                }else if(this.showResult.type=="pwdMassage"){
                    this.$root.goUrl('pwdMassage')
                }
                this.$root.goUrl(url,data);
            },
            //点击说明
            showInti:function(){
                me.errorTips({'text':"银行处理债权转让划扣时，可用金额会有延迟解冻的情况，但实际资金不受影响。",from:'25%',to:'25%'});
            },
            //检查登录状态
            checkLogin:function(){
                if(me.cookie.getItem("userId")){
                    this.userTel = me.str.str2char(me.cookie.getItem("phone"),3,4,'*');
                    this.getDataInit();
                }else{
                    this.$root.goUrl("login");
                }
            },
            //获取页面数据
            getDataInit:function(){   
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccount",
                        method:'post',
                        data:{
                            userId:that.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data
                                if(data){
                                    that.unincomeAmount = data.unincomeAmount;
                                    that.yestdayIncome = data.yestdayIncome;
                                    that.incomeInterest = data.incomeAllAmount;
                                    that.freezeAmount = data.freezeAmount;
                                    that.availableAmount = data.availableAmount;
                                    that.freezeAmountcg = data.freezeAmountcg;
                                    that.availableAmountcg = data.availableAmountcg; 
                                }
                            }else{
                                me.errorTips({'text':data.errMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                }  
            },
            //旧账户充值开关
            checkRecharge:function(){
                var that = this;
                that.$config.getData({
                    key:"checkRecharge",
                    method:'post',
                    data:{
                       userId : that.userId
                    },
                    callback:function(data){
                        if(data.result == '1') { 
                            that.$router.push({name: 'recharge', params: {type: 'old', back: '0'}})
                        }else{
                            me.errorTips({'text':data.errMsg,from:'25%',to:'25%'});
                        }
                    }
                });                
            },
            //存管状态
            checkRechargecg:function(){
                var that = this;
                this.findAccountCartMsgAPI().then((data) => {
                    if(data.result == '1') {      
                        //先判断是否开户
                        //开户以后是否绑卡
                        //绑卡以后是否有交易密码
                        var data = data.data;
                        if(data.isOpenedAccount==1){
                            if(data.isOnCard==1){
                                if(data.isTransPwd==1){
                                    that.$router.push({name: 'recharge', params: {type: 'cg', back: '0'}})
                                }else{
                                    that.showResult.flage=true;
                                    that.showResult.msg="请先设置存管交易密码";
                                    that.showResult.msgBtn="立即设置";
                                    that.showResult.type="pwdMassage";
                                }
                            }else{
                                that.showResult.flage=true;
                                that.showResult.msg="请先完成绑卡";
                                that.showResult.msgBtn="立即绑卡";
                                that.showResult.type="bankcard"
                            }
                        }else{
                            that.showResult.flage=true;
                            that.showResult.msg="请先进行开户";
                            that.showResult.msgBtn="立即开户";
                            that.showResult.type="realName";
                        }
                    }else{
                        me.errorTips({'text':data.errMsg,from:'25%',to:'25%'});
                    }
                })
            },
            appShow:function(){
                var that = this;
                this.$vux.confirm.show({
                    title:'提现请在民信贷App操作',
                    cancelText: '打开app',
                    confirmText: '下载app',
                    hideOnBlur: true,
                    onCancel:()=>{
                        if(!that.$config.BrowserInfo.isWeixin){
                            if(that.$config.BrowserInfo.isAndroid){
                                window.location.href = "launchapp://minxindai"; 
                            }else if(that.$config.BrowserInfo.isIphone){
                                //ios
                                window.location.href = "iOSMinxindai://com.minxin.www"; 
                            }
                        }else{
                            me.errorTips({'text':"请用浏览器打开",from:'25%',to:'25%'});
                        }
                    },
                    onConfirm:()=>{
                        if(that.$config.BrowserInfo.isAndroid){
                            window.location.href = "http://sj.qq.com/myapp/detail.htm?apkName=com.minxindai"; 
                        }else if(that.$config.BrowserInfo.isIphone){
                            //ios
                             window.location.href = "https://itunes.apple.com/us/app/min-xin-dai/id1263410899?l=zh&ls=1&mt=8";
                        }
                    },
                });
            },
        },
        mounted(){
           this.init()
           this.checkLogin();
           me.require(['errTips']);
           me.localStorage.setItem('from','');
           me.localStorage.setItem('investManageData','');
           me.localStorage.setItem('investManageFlag','');
        },
    }
</script>
<style lang="less" scoped>
body{height:100%;}
.ucenter{position:absolute;top:0;left:0px;height:100%;width:100%;
    background:#fff!important;
    .main-top{
        width:100%;min-height:10.1rem;background:#eee url(../assets/images/g-u-bg.png) no-repeat center top;
        background-size:100%;
        .nav-top{
            width:100%;height:1.6rem;padding:.4rem 0;
            color:#fff;text-align:center;font-size:0.6rem;
            span{display:inline-block;position:relative;}
            b{
                display:inline-block;width:0.6rem;height:0.26rem;
                background:url(../assets/images/g-u-tips.png) no-repeat center bottom;
                background-size:0.26rem auto;
            }
        }
        .total{
            color:#fff;height:2.5rem;
            p{font-size:0.52rem;}
            b{font-size:1rem;}
        }
        .profit{
            color:#fff;padding:.45rem 0;
            height:2.5rem;
            div{text-align:center;line-height:0.8rem;}
            p{font-size:0.52rem;}
            b{font-size:0.6rem;}
            
        }
        .main-center{
            height:3.2rem;padding:0.45rem 0;padding-right:0.70rem;
            background:#fff;border-radius:3px;margin-bottom:0.48rem;
            ul{
                li span{display:block;
                    width:100%;min-height:1.6rem;padding-top:1.6rem;text-align:center;
                }
                span.mxdLogo{
                    background:url(../assets/images/g-u-mxdlogo.png) no-repeat center top;
                    background-size:1.6rem auto;color:#fd7801;
                }
                span.bankLogo{
                    background:url(../assets/images/g-u-banklogo.png) no-repeat center top;
                    background-size:1.6rem auto;color:#029491;
                }
                p{
                    position: relative;
                    line-height:0.8rem;
                    b{font-size:0.68rem;} 
                    label{color:#999;padding-top:.1rem;display:inline-block} 
                    i{padding-left:.5rem;}           
                }
                li.btn{
                    padding-top:0.2rem;
                }
            }
        }

    }
    .main-foot{width:100%;background:#fff;
        .list{
            li{
                height:2.52rem;
                border-bottom:1px solid #e5e5e5;
                background:url(../assets/images/g-u-icon01.png) no-repeat 1.52rem center ;
                background-size:1.04rem auto;
                border-right:1px solid #e5e5e5;
                span{
                    line-height:2.52rem;color:#333;font-size:0.56rem;padding-left:3rem;display:block;
                }
            }
            li:nth-child(2n){border-right:0;}
            li.g-u-iocn02{
                background:url(../assets/images/g-u-icon02.png) no-repeat 1.52rem center;
                background-size:1.04rem auto;
            }
            li.g-u-iocn03{
                background:url(../assets/images/g-u-icon03.png) no-repeat 1.52rem center;
                background-size:1.04rem auto;
            }
            
        }

    }
    .askBtn{
        position:absolute;
        left:58px;top:-1px;
        .me-ion-o-help{
            font-size:.8rem;
        }
    }
    
}
</style>