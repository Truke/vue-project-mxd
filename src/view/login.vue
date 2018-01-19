<template>
    <div class="login">
        <div class="my-logo">
            <img src="../assets/images/logo.png" alt=""/>
        </div>
        <div class="my-form width-90">
            <div class="u-input" data-type="icon">
                <i class="me-person me-ion"></i>
                <input type="tel" v-model.trim="userName" placeholder="手机号/邮箱/昵称" 
                @keyup="hideError('tel')" @focus="hideError('tel')" @blur="hideIcon('tel')"/>
                <span class="me-ion-close-circled" v-show="iconResult.telIcon" @click="del('tel')"></span>
            </div>
            <p class="u-error">  
                <span v-show="msgResult.telMsg">{{msgResult.telMsg}}</span>
		    </p>  
            <div class="u-input" data-type="icon">
                <i class="me-locked me-ion"></i>
                <!--<input type="password" v-model.trim="passWord" maxlength="16" placeholder="请输入登录密码" v-if="type=='password'"
                @keyup="hideError('pwd')"  @focus="hideError('pwd')" @blur="hideIcon('pwd')"/>-->
                <input type="password" v-model.trim="passWord" maxlength="16" placeholder="密码由8-16位字母、数字或符号组成"
                @keyup="hideError('pwd')"  @focus="hideError('pwd')" @blur="hideIcon('pwd')"/>
                <span class="me-ion-close-circled" v-show="iconResult.pwdIcon" @click="del('pwd')"></span>
                <!--<em class="me-ion-me-ionic" v-show="eye" @click="changeEye"></em>-->
            </div>
            <p class="u-error">
			    <span v-show="msgResult.pwdMsg">{{msgResult.pwdMsg}}</span>
		    </p>         
            <button class="me-u-btn" data-size=block  data-color="orange" @click="login">登录</button>
            <p class="s-t-center re-btn"><span class="s-org" @click="goTo('register')">免费注册</span></p>
            <p class="s-t-center"><span @click="goTo('pwdLogin')">忘记密码？</span></p>        
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { Base64 } from 'js-base64'
    export default {
        name:'login',
        data(){
            return {
                userName: me.cookie.getItem("phone"),
                passWord: "",
                msgResult:{telMsg:"", pwdMsg:""},
                flagResult:{telFlag : false, pwdFlag : false},
                iconResult:{telIcon : false, pwdIcon : false}
                // type : 'password',
                // eye:false
            }
        },
        methods:{
            ...mapActions(['account']),
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '登录',
                    headFlag: false
                })
            },
            checkMobile(){
                //var phone =  /^1(([3|5|7|8][\d]{9})|(47|45)[\d]{8})$/;
                if(!this.userName){
                    this.msgResult.telMsg = '手机号不能为空!';
                    this.flagResult.telFlag = false;
                }else{
                    this.msgResult.telMsg = '';
                    this.flagResult.telFlag = true;
                }
                // else if (this.$config.phonetest && this.userName.substr(0,4) == '1110' && this.userName.length == 11) {
                //     this.msgResult.telMsg = '';
                //     this.flagResult.telFlag = true;
                // }else if(!phone.test(this.userName)){
                //     this.msgResult.telMsg = '手机号格式错误!';
                //     this.flagResult.telFlag = false;       
                // }else{
                //     this.msgResult.telMsg = '';
                //     this.flagResult.telFlag = true;
                // }			
		    },
            checkPwd(){
                var passWord =  /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/;
                if(!this.passWord){
                    this.msgResult.pwdMsg = '密码不能为空!';
                    this.flagResult.pwdFlag = false;
                }else if(!passWord.test(this.passWord)){
                    this.msgResult.pwdMsg = '8-16位字母、数字、符号组合!';
                    this.flagResult.pwdFlag = false;
                }else{
                    this.msgResult.pwdMsg = '';
                    this.flagResult.pwdFlag = true;
                }
		    },
            hideError(type){
                if(type == "tel"){
                    this.msgResult.telMsg = '';
                    if(this.userName){
                        this.iconResult.telIcon = true;
                    }
                }else{
                    this.msgResult.pwdMsg = '';
                    if(this.passWord){
                        this.iconResult.pwdIcon = true;
                        // this.eye = true;
                    }
                }
            },
            hideIcon(type){
                setTimeout(()=>{
                    if(type == "tel"){
                        this.iconResult.telIcon = false;
                    }else{
                        this.iconResult.pwdIcon = false;
                    } 
                }, 0);
            },
            del(type){
                if(type == "tel"){
                    this.userName = '';
                }else{
                    this.passWord = '';
                } 
            },
            // changeEye:function(){
            //     if(this.type=="password"){
            //         return this.type = 'text';
            //     }else{
            //         return this.type = 'password';
            //     }
		    // },      
            login(){
                this.checkMobile();
                this.checkPwd();
                if(this.flagResult.telFlag&&this.flagResult.pwdFlag){
                    var $this = this;
                    $this.$vux.loading.show()
                    $this.$config.getData({
                        key:"login",
                        method:'post',
                        data:{
                            userLogin:$this.userName,
                            passWord:$this.$config.cryptoBase64($this.passWord),
                            isEncode: 2,
                            ip:"127.0.0.1"
                        },
                        callback:function(data){
                            $this.$vux.loading.hide()
                            if(data.result == '1') {   
                                var data = data.data; 
                                if(data.result ==" 1"){
                                    var strInfo = decodeURIComponent(data.authKey),
                                        userId = Base64.decode((strInfo.split("||")[0])),
                                        isVip = Base64.decode((strInfo.split("||")[5]));
                                    me.cookie.setItem("userId",userId,60*60);
                                    me.cookie.setItem("isVip",isVip,60*60);
                                    me.cookie.setItem("phone",$this.userName,60*60);
                                    $this.account({userId, isVip, phone: $this.userName});
                                    if ($this.$route.query.redirect) {
                                        $this.$router.replace({path: $this.$route.query.redirect})
                                    } else {
                                        $this.$root.goUrl('/')
                                    }
                                }else{
                                    me.errorTips({'text':data.errMsg,from:'25%',to:'25%'});
                                }
                            }
                        }
                    });     
                }
            },
            goTo(url){
                this.$root.goUrl(url);
            }
        },
        mounted(){
            me.require(['errTips']);
            this.init();
        },
    }
</script>

<style lang="less" scoped>
    .login{
        position:relative;
        width:100%;
    }
    .me-person{
        width:.76rem;
        height:.8rem;
        background:url(../assets/images/z_icon1.png) no-repeat;
        background-size:100%;
    }
    .me-locked{
        width:.72rem;
        height:1rem;
        background:url(../assets/images/z_icon2.png) no-repeat;
        background-size:100%;
    }
    .s-t-right span{
        height:1.5rem;
        line-height:1.5rem;
        font-size:.48rem;
    }
    .re-btn span{
        color:#ff6000;
        width:3.4rem;
        height:1.28rem;
        line-height:1.28rem;
        font-size:.56rem;
        border:1px solid #ff6000;
        border-radius:.16rem;
        display:inline-block;
        margin:5rem 0 .5rem 0;
    }
</style>