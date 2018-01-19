<template>
    <div class="reserved">
        <div class="width-90 my-form">
            <h2>原手机号码</h2>
            <div class="u-input" data-type="icon">
                <i class="me-person me-ion">手机号</i>
                <input type="tel" class="pl20" :disabled='status' v-model.trim="userName" maxlength="11" placeholder="请输入原手机号"
                    @keyup="errorState('userName')"  />    
                <span class="me-ion-close-circled" v-show="delIcon.telFlag" @click="del('tel')"></span>
            </div>
            <p class="u-error">
                <span v-show="uMsg">{{uMsg}}</span>
            </p>
            <div class="u-input clearfix" data-type="icon" >
                <i class="me-code me-ion">验证码</i>
                <send-code :code.sync ='codeMess' :phone ='mobilePhone' maxPerSecond ='120'></send-code>
            </div>
            <p class="u-error"><span v-show="cMsg">{{cMsg}}</span></p>
            <button class="me-u-btn" data-size=block  data-color="orange" @click="submitBtn()">下一步</button>

        </div>
    </div>
</template>

<script>
import SendCode from '@/components/sendCode'
    export default {
        name:'pwdLogin',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                userName: "",
                reservedPhoneNo:"",
                mobilePhone:'',
                status:false,
                codeMess:'',
                uMsg:'',
                cMsg:"",
                delIcon:{telFlag:false,cMFlag:false},
                result:{telFlag:false,cMFlag:false}
            }
        },
        components: {
            SendCode,
        },
        watch: {
            codeMess (n,o){
                this.$nextTick(() => {
                    this.codeMessCheck()
                })
            }
        },
        methods:{
            telCheck:function(){
                var tel =  /^1(([3|5|7|8][\d]{9})|(47|45)[\d]{8})$/;
                if(this.userName==""){
                    this.uMsg="手机号不能为空";
                    this.result.telFlag=false;
                }else if (this.$config.phonetest && this.userName.substr(0,4) == '1110' && this.userName.length == 11) {
                    this.uMsg = '';
                    this.result.telFlag=true;
                }else if(tel.test(this.userName)){
                    this.uMsg="";
                    this.result.telFlag=true;
                }else{
                    this.uMsg="手机号码格式不正确";
                    this.result.telFlag=false;
                }
            },
            codeMessCheck:function(){
                var code= /^\d+$/g;
                if(!this.codeMess.length){
                    this.cMsg="验证码不能为空";
                    this.result.cMFlag=false;
                }if(code.test(this.codeMess)){
                    this.cMsg="";
                    this.result.cMFlag=true;
                }else{
                    this.cMsg="验证码格式不正确";
                    this.result.cMFlag=false;
                }
            },
            errorState:function(type){
                if(type=="tel"){
                    if(this.userName){
                        this.uMsg="";
                        this.delIcon.telFlag=true
                    }
                }
            },
            blurEvent:function(type){
                setTimeout(()=>{
                    if(type=="tel"){
                        this.delIcon.telFlag=false
                    } 
                }, 0);
            },
            del:function(type){
                if(type=="tel"){
                    this.userName="";
                }
            },
            submitBtn:function(){
                var that=this;
                if(that.status){
                    that.mobilePhone = that.reservedPhoneNo;
                    that.codeMessCheck()
                    if(that.result.cMFlag){
                        that.chaCode();
                    }
                }else{
                    that.mobilePhone = that.userName;
                    that.telCheck()
                    that.codeMessCheck()
                    if(that.result.telFlag&&that.result.cMFlag){
                        that.chaCode();
                    }
                }
            },
            //比较验证码否正确
            chaCode:function(){
                var that = this;
                that.$config.getData({
                    key:"provingCaptcha",
                    method:'post',
                    data:{
                        mobilePhone:that.mobilePhone,
                        content:that.codeMess,
                    },
                    callback:function(data){
                        if(data.result == 1) { 
                            if(data.data.result == 1){
                                 that.$root.goUrl("reserved")
                            }else{
                                me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                            }
                        }else{
                            me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                        }
                    }
                }); 
            },
            //获取页面数据
            getDataInit:function(callback){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccountMsg",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result === 1 && data.data.result === 1) { 
                                var data = data.data.personalInfoVo;
                                if(data.reservedPhoneNo){
                                    that.userName = me.str.str2char(data.reservedPhoneNo);
                                    that.reservedPhoneNo = data.reservedPhoneNo;
                                    that.mobilePhone = data.reservedPhoneNo;
                                    that.status = true;
                                    that.result.telFlag=true;
                                }else{
                                    that.status = false;
                                }
                            }else{
                                me.errorTips({'text':data.errMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                }
                
            },
            headerTitle () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '银行预留手机号',
                    headFlag: true
                })
            }

        },
        mounted(){
            this.getDataInit(function(){

            });
            this.headerTitle();
            me.require(['errTips']);
        }
    }
</script>

<style lang="less" scoped>
.reserved{
    h2{height:2rem;line-height:2rem;font-size:0.56rem;padding-left:.5rem;color:#999}
    .my-form .u-input{
        border:1px solid #dbdbdb;
        input.pl20{
            background:#fff;
            padding-left:2.5rem;
            width:100%;height:100%;font-size:0.6rem;
        }
        .weui-vcode{height:40px;padding-left:1rem;
            padding-top:.6rem;
        }
    }
   .my-form .u-input i.me-ion{
        color:#000;font-size:0.58rem;line-height:0.7rem;
    }
}
</style>