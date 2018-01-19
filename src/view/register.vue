<template>
    <div class="register">
        <div class="my-logo">
            <img src="../assets/images/logo.png" alt=""/>
        </div>
        <div class="width-90 my-form">
            <div class="u-input" data-type="icon">
                <i class="me-person me-ion"></i>
                <input type="tel" v-model.trim="userName" maxlength="11" placeholder="请输入手机号"
                @blur="blurEvent('tel')" @keyup="errorState('tel')" @focus="errorState('tel')"  />
                <span class="me-ion-close-circled" v-show="delIcon.telFlag" @click="del('tel')"></span>
            </div>
            <p class="u-error">
                <span v-show="uMsg">{{uMsg}}</span>
            </p>
            <div class="u-input" data-type="icon">
                <i class="me-locked me-ion"></i>
                <input type="password" v-model.trim="passWord"  maxlength="16" placeholder="密码由8-16位英文字母、数字或符号组成"
                    @blur="blurEvent('passWord')" @keyup="errorState('passWord')" @focus="errorState('passWord')" />
                <span class="me-ion-close-circled" v-show="delIcon.pwdFlag" @click="del('passWord')"></span>
                <!-- <label class="eyeshow" v-show="eyeState" @click="eyeEvent()">显示</label> -->
            </div>
            <p class="u-error"><span v-show="pMsg">{{pMsg}}</span></p>
            <div class="input-wap">
                <send-code :code.sync="codeMess" maxPerSecond="120" :phone="userName" type='1' channel='0'></send-code>
            </div>
            <p class="u-error"><span v-show="cMsg">{{cMsg}}</span></p>
            <div class="u-input clearfix" data-type="icon" >
                <i class="me-code me-ion"></i>
                <input type="tel" v-model="codeNum" maxlength="11" placeholder="请输入邀请码" 
                @blur="blurEvent('codeNum')" @keyup="errorState('codeNum')" @focus="errorState('codeNum')"/>
                <span class="me-ion-close-circled" v-show="delIcon.cNFlag" @click="del('codeNum')"></span>
            </div>
            <p class="u-error"><span v-show="cNMsg">{{cNMsg}}</span></p>  
            <button class="me-u-btn" data-size=block  data-color="orange" @click="regBtnClick()">注册</button>
            <div class="reg_foot" data-wrap="checkbox" data-orange>
                <input type="checkbox" id="mr0" @change="checkClick" v-model="checked"> 
                <label for="mr0">我已阅读并同意<a href="#/registerxieyi">《民信贷网站服务协议》</a></label>
            </div>
            <p class="u-error"><span v-show="checkMsg">{{checkMsg}}</span></p> 
        </div>
    </div>
</template>

<script>
    import SendCode from '@/components/sendCode'
    export default {
        name:'register',
        data(){
            return {
                userName: "",
                passWord: "",
                codeMess:'',
                codeNum:'',
                uMsg:"",
                pMsg:"",
                cMsg:"",
                cNMsg:"",
                checkMsg:"",
                checked:true,
                phoneState:false,
                captchaState: false,
                delIcon:{telFlag:false,pwdFlag:false,cMFlag:false,cNFlag:false},
                result:{telFlag:false,pwdFlag:false,cMFlag:false,cNFlag:false}
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
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '注册',
                    headFlag: true
                })
            },
            telCheck:function(){
                var tel =  /^1(([3|5|7|8][\d]{9})|(47|45)[\d]{8})$/;
                if(this.userName==""){
                    this.uMsg="手机号不能为空";
                    this.result.telFlag=false;
                }else if (this.$config.phonetest && this.userName.substr(0,4) == '1110' && this.userName.length == 11) {
                    this.uMsg = '';
                    this.result.telFlag=true;
                }
                else if(tel.test(this.userName)){
                    this.uMsg="";
                    this.result.telFlag=true;
                }else{
                    this.uMsg="手机号码格式不正确";
                    this.result.telFlag=false;
                }
            },
            passWordCheck:function(){
                var passWord =  /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/;
                if(this.passWord==""){
                    this.pMsg="密码不能为空";
                    this.result.pwdFlag=false;
                }else if(passWord.test(this.passWord)){
                    this.pMsg="";
                    this.result.pwdFlag=true;
                }else{
                    this.pMsg="密码由8-16位英文字母、数字或符号组成";
                    this.result.pwdFlag=false;
                }
            },
            codeMessCheck:function(){
                var code= /^[0-9]*$/ ;
                if(!this.codeMess.length){
                    this.cMsg="验证码不能为空";
                    this.result.cMFlag=false;
                }else if(code.test(this.codeMess)){
                    this.cMsg="";
                    this.result.cMFlag=true;
                }else{
                    this.cMsg="验证码格式不正确";
                    this.result.cMFlag=false;
                }
            },
            codeNumCheck:function(){
                if(this.codeNum.length > 0){
                    if(!/^\d+$/.test(this.codeNum)){
                        this.cNMsg="请输入正确的邀请码";
                        this.result.cNFlag=false;
                    }else{
                        this.cNMsg="";
                        this.result.cNFlag=true;
                    }
                }
            },
            errorState:function(type){
                var that = this;
                if(type=="tel"){
                    if(this.userName){
                        this.uMsg="";
                        this.delIcon.telFlag=true;
                    }
                }else if(type=="passWord"){
                    if(this.passWord){
                        this.pMsg="";
                        this.delIcon.pwdFlag=true
                    }
                }else if(type=="codeNum"){
                    if(this.codeNum.length > 0){
                        this.cNMsg="";
                        this.delIcon.cNFlag=true
                    }
                }else{
                    if(this.codeMess){
                        this.cMsg="";
                    }
                }
            },
            blurEvent:function(type){
                setTimeout(()=>{
                    if(type=="tel"){
                        this.delIcon.telFlag=false;
                    }else if(type=="passWord"){
                        this.delIcon.pwdFlag=false
                    }if(type=="codeNum"){
                        this.delIcon.cNFlag=false
                    }    
                }, 0);
            },
            del:function(type){
                if(type=="tel"){
                    this.userName="";
                }else if(type=="passWord"){
                    this.passWord="";
                }else if(type=="codeNum"){
                    this.codeNum="";
                }
            },
            checkClick:function(){
                if(this.checked==false){
                    this.checkMsg="请阅读并同意《民信贷网站服务协议》"
                }else{
                    this.checkMsg=""
                }
            },
            phoneOne:function(){
                var that=this;
                return new Promise((resolve, reject) => {
                    that.telCheck();
                    if(that.result.telFlag){
                        that.$config.getData({
                            key:'regTel',
                            method:'post',
                            async:false,
                            data:{
                                mobilePhone:that.userName,
                            },
                            callback:function(data){
                                if (data.result == 1) {
                                    if(data.data.result==0){
                                        that.phoneState=true;
                                    }else{
                                        that.phoneState=false; 
                                    }
                                }
                                resolve()
                            }
                        })
                    } 
                })
            },
            provingCaptcha () {
              return new Promise((resolve, reject) => {
                this.$config.getData({
                  key: 'provingCaptcha',
                  method: 'post',
                  data: {
                    mobilePhone: this.userName,
                    content: this.codeMess,
                    type: 1
                  },
                  callback: (data) => {
                    if (data.result == 1) {
                        if (data.data.result == 1) {
                            this.captchaState = true
                        } else {
                            this.captchaState = false
                            me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                        }
                    } else {
                        this.captchaState = false
                    }
                    resolve()
                  }
                })
              })
            },

            async regBtnClick () {
                //注册先验证表单格式
                this.telCheck()
                this.passWordCheck()
                this.codeMessCheck()
                this.codeNumCheck()
                this.checkClick()
                if(this.result.telFlag&&this.result.pwdFlag&&this.checked&&this.result.cMFlag){
                    var that=this;
                    //注册验证手机号唯一性
                    await that.phoneOne()
                    if(that.phoneState){
                        //注册验证短信验证码
                        await that.provingCaptcha()
                        if (that.captchaState) {
                            that.regUser()
                        }
                    }
                }
            },
            regUser () {
                let that = this
                that.$config.getData({
                    key:'regUser',
                    method:'post',
                    data:{
                        mobile:that.userName,
                        passWord:that.$config.cryptoBase64(that.passWord),
                        isEncode: 2,
                        client:4,
                        code:that.codeNum,
                        inviteKey:"",
                        ref:0,
                        tid:"",
                        regType:1,
                    },
                    callback:function(data){
                        if(data.result==1){
                            if(data.data.result==1){
                                me.cookie.setItem("phone",that.userName);
                                me.errorTips({'text':'注册成功, 请登录',from:'25%',to:'25%'});
                                setTimeout(() => {
                                    that.$router.replace({name: 'login'})
                                }, 1000)
                            }else{
                                me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                            }
                        }
                    }
                })
            }
        },
        mounted(){
            this.activated();
            me.require(['errTips']);
        },
    }
</script>

<style lang="less" scoped>
    .me-person{
        width:.76rem;
        height:.8rem;
        background:url(../assets/images/g_r_tel.png) no-repeat;
        background-size:100%;
    }
    .me-locked{
        width:.72rem;
        height:1rem;
        background:url(../assets/images/z_icon2.png) no-repeat;
        background-size:100%;
    }
    .me-code{
        width:.72rem;
        height:1rem;
        background:url(../assets/images/g_r_icon01.png) no-repeat;
        background-size:100%;
    }
    .my-form [data-type=icon] {
        position: relative;
        .u-w70{width:65%;}
    }
    .my-form .u-input{
        background:#fff;
    }
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

    .reg_foot{padding:0.35rem 0 0 4px;
        a{color:#fe6f06}
    }
</style>