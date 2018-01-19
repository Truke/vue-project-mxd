<template>
    <div>
        <p class="my-tip">为了您的资金安全，请开通江西银行存管账户</p>
        <div class="bank-logo">
            <img src="../assets/images/z_logo.png" alt=""/>
            <img src="../assets/images/z_jx.png" alt=""/>
        </div>
        <div class="my-form width-90">
            <div v-if="!isRealName">
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion"></i>
                    <input type="text" v-model.trim="name" placeholder="请输入您的真实姓名" 
                    @keyup="hideError('name')" @focus="hideError('name')" @blur="hideIcon('name')"/>
                    <span class="me-ion-close-circled" v-show="iconResult.nameIcon" @click="del('name')"></span>
                </div>
                <p class="u-error">  
                    <span v-show="msgResult.nameMsg">{{msgResult.nameMsg}}</span>
                </p>  
                <div class="u-input" data-type="icon">
                    <i class="me-card me-ion"></i>
                    <input type="tel" v-model.trim="card" maxlength="18" placeholder="请输入您的身份证号" 
                    @keyup="hideError('card')" @focus="hideError('card')" @blur="hideIcon('card')"/>
                    <span class="me-ion-close-circled" v-show="iconResult.cardIcon" @click="del('card')"></span>
                </div>
                <p class="u-error">  
                    <span v-show="msgResult.cardMsg">{{msgResult.cardMsg}}</span>
                </p>
            </div>
            <div v-else>
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion"></i>
                    <input type="text" v-model.trim="name" readonly="readonly">
                </div>
                <p class="u-error"></p>  
                <div class="u-input" data-type="icon">
                    <i class="me-card me-ion"></i>
                    <input type="tel" v-model.trim="card" readonly="readonly">
                </div>
                <p class="u-error"></p>  
            </div>
             <button class="me-u-btn" data-size=block  data-color="orange" @click="realName">下一步</button>
        </div>
    </div> 
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        data(){
            return {
                 userId: me.cookie.getItem("userId") || "",
                 name:"",
                 card:"",
                 isRealName:"",
                 realData:{},
                 msgResult:{nameMsg:"", cardMsg:""},
                 flagResult:{nameFlag : false, cardFlag : false},
                 iconResult:{nameIcon : false, cardIcon : false}
            }
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '实名认证',
                    headFlag: true
                });
            },
            checkName(){
                var name = /^([一-龥]){2,7}$/;
                if(!this.name){
                    this.msgResult.nameMsg = '姓名不能为空!';
                    this.flagResult.nameFlag = false;
                }else if(!name.test(this.name)){
                    this.msgResult.nameMsg = '姓名格式错误!';
                    this.flagResult.nameFlag = false;       
                }else{
                    this.msgResult.nameMsg = '';
                    this.flagResult.nameFlag = true;
                }			
            },
            checkId(){
                var cardId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
                if(!this.card){
                    this.msgResult.cardMsg = '身份证号不能为空!';
                    this.flagResult.cardFlag = false;
                }else if(!cardId.test(this.card)){
                    this.msgResult.cardMsg = '身份证号格式错误!';
                    this.flagResult.cardFlag = false;       
                }else{
                    this.msgResult.cardMsg = '';
                    this.flagResult.cardFlag = true;
                }			
            },
            hideError(type){
                if(type == "name"){
                    this.msgResult.nameMsg = '';
                    if(this.name){
                        this.iconResult.nameIcon = true;
                    }
                }else{
                    this.msgResult.cardMsg = '';
                    if(this.card){
                        this.iconResult.cardIcon = true;
                    }
                }
            },
            hideIcon(type){
                setTimeout(()=>{
                    if(type == "name"){
                        this.iconResult.nameIcon = false;
                    }else{
                        this.iconResult.cardIcon = false;
                    } 
                }, 0);
            },
            del(type){
                if(type == "name"){
                    this.name = '';
                }else{
                    this.card = '';
                } 
            },
            getRealInfo(){
                var $this = this;
                $this.$config.getData({
                    key:'findAccountMsg',
                    method:'post',
                    data:{
                        userId:$this.userId
                    },
                    callback:function(data){
                        if(data.result == "1") {    
                            var data = data.data;
                            if(data.result == "1"){
                                $this.isRealName = data.personalInfoVo.realname;
                                $this.name = data.personalInfoVo.realname;
                                $this.card = data.personalInfoVo.idCardNo;
                            }
                        }
                    }
                });   
            },
            realName(){
                this.checkName();
                this.checkId();
                if(this.flagResult.nameFlag&&this.flagResult.cardFlag){
                    this.realData.name = this.name;
                    this.realData.idCard = this.card;
                    me.localStorage.setItem("realData", this.realData);
                    this.$root.goUrl('bankcardcg')
                }
            } 
        },
        mounted(){
            this.init();
            this.getRealInfo();
        }
    }
</script>

<style lang="less" scoped>
   .me-person{
        width:.76rem;
        height:.8rem;
        background:url(../assets/images/z_icon1.png) no-repeat;
        background-size:100%;
    }
    .me-card{
        width:.88rem;
        height:.64rem;
        background:url(../assets/images/z_icon3.png) no-repeat;
        background-size:100%;
    }
</style>