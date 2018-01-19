<template>
    <div class="pwdLogin">
        <div class="width-90 my-form">
            <p class="u-error"><span v-show="pMsg">{{pMsg}}</span></p>
            <div class="u-input" data-type="icon">
                <i class="me-locked me-ion"></i>
                <input type="password" v-model.trim="passWord"  maxlength="16" placeholder="新登录密码"
                    @blur="blurEvent('passWord')" @keyup="errorState('passWord')" @focus="errorState('passWord')" />
                <span class="me-ion-close-circled" v-show="delIcon.pwdFlag" @click="del('passWord')"></span>
            </div>           
            <p class="p_tip">密码由8-16位英文字母、数字或符号组成</span></p>
            <button class="me-u-btn" data-size=block  data-color="orange" @click="submitBtn()">完成</button>
        </div>
    </div>
</template>

<script>
    export default {
        name:'pwdSud',
        data(){
            return {
                userName:me.cookie.getItem("userName"),
                passWord:'',
                pMsg:"",
                userId:'',
                delIcon:{pwdFlag:false},
                result:{pwdFlag:false}
            }
        },
        methods:{
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
            errorState:function(type){
                if(type=="passWord"){
                    if(this.passWord){
                        this.pMsg="";
                        this.delIcon.pwdFlag=true
                    }
                }
            },
            blurEvent:function(type){
                setTimeout(()=>{
                    if(type=="passWord"){
                        this.delIcon.pwdFlag=false
                    } 
                }, 0);
            },
            del:function(type){
                if(type=="passWord"){
                    this.passWord="";
                }
            },
            getUserName:function(){//获取用户验证过的手机号
                var that = this;
                that.$config.getData({
                    key:'findUserByEmailandPhone',
                    method:'post',
                    data:{
                        userName:that.userName
                    },
                    callback:function(data){
                        if(data.result==1){
                            if(data.data.result == 1){
                                that.userId=data.data.userId
                            }else{
                                me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                            }
                        }
                    }
                })
            },
            submitBtn:function(){
                this.passWordCheck()
                if(this.result.pwdFlag){
                    var that=this;
                    that.$config.getData({
                        key:'updatePassword',
                        method:'post',
                        data:{
                            userId:that.userId,
                            passWord:that.$config.cryptoBase64(that.passWord),
                            isEncode:2,
                        },
                        callback:function(data){
                            if(data.result==1){
                                if(data.data.result ==1){
                                    me.cookie.setItem("phone",that.userName);
                                    me.errorTips({'text':"设置成功",from:'25%',to:'25%',callback:function(){
                                        that.$router.replace({name:'login'})
                                    }});
                                }else{
                                    me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                                }
                                
                            }
                        }
                    })
                }
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
            this.getUserName()
            me.require(['errTips']);
        }
    }
</script>
<style lang="less" scoped>
.pwdLogin{padding-top:.5rem}
.my-form [data-type=icon] {
    input{padding-left:.5rem;}
    position: relative;
    .u-w70{width:65%;}
}
.my-form .u-input{
    background:#fff;
}
.p_tip{color:#666;padding-top:.5rem;}   
</style>