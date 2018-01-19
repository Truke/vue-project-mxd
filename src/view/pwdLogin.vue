<template>
    <div class="pwdLogin">
        <div class="width-90 my-form">
            <div class="u-input" data-type="icon">
                <input class="pl20" type="tel" v-model.trim="userName" maxlength="11" placeholder="请输入手机号"
                @blur="blurEvent('tel')" @keyup="errorState('tel')" @focus="errorState('tel')"  />
                <span class="me-ion-close-circled" v-show="delIcon.telFlag" @click="del('tel')"></span>
            </div>
            <p class="u-error">
                <span v-show="uMsg">{{uMsg}}</span>
            </p>
            <div class="input-wap">
                <send-code :code.sync ='codeMess' :phone ='userName' alone="true" maxPerSecond ='120'></send-code>
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
                userName: "",
                codeMess:'',
                uMsg:"",
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
                this.telCheck()
                this.codeMessCheck()
                if(this.result.telFlag&&this.result.cMFlag){
                    that.chaCode();
                }
            },
            //比较验证码否正确
            chaCode:function(){
                var that = this;
                that.$config.getData({
                    key:"provingCaptcha",
                    method:'post',
                    data:{
                        mobilePhone:that.userName,
                        content:that.codeMess,
                    },
                    callback:function(data){
                        if(data.result == 1) { 
                            if(data.data.result ==1){
                                me.cookie.setItem("userName",that.userName);
                                that.$router.replace({name:'pwdSud'})
                            }else{
                                me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                            }
                        }else{
                            me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                        }
                    }
                }); 
            },
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '找回密码',
                    headFlag: true
                })
            },

        },
        mounted(){
            this.activated()
            me.require(['errTips']);
        }
    }
</script>
<style lang="less" scoped>
.pwdLogin{padding-top:1rem}
.weui-vcode{height:40px;padding-left:.5rem;
    padding-top:.5rem;background:#fff;font-size:0.6rem;}
.input-wap{
    width: 100%;
    height: 1.76rem;
    line-height: 1.76rem;
    position: relative;
    background: #fff;
    border-radius: 3px;
}
</style>