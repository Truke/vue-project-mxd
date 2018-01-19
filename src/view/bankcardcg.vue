<template>
    <div class="bankcard">
        <div class="bankcardMain">
            <div class="bank-logo">
                <img src="../assets/images/z_logo.png" alt=""/>
                <img src="../assets/images/z_jx.png" alt=""/>
            </div>
            <div class="bank-tips">
                    <span>支持绑定的银行卡仅限：</span>
                    中、农、工、建、中信、民生、光大、广发、兴业、平安、招商
            </div>
            <div class="my-form width-90">
                <div class="u-input" data-type="icon" data-wrap="layout">
                    <i class="me-person me-ion" >卡号</i>
                    <input class="pl20" type="tel" v-model.trim="bankcardId" placeholder="请输入银行卡号"
                        @keyup="errorState('bankcardId')" maxlength="20"
                        @input="inputCard"
                    />
                </div>
                <p class="u-error">
                    <span v-show="msg.bankcardId">{{msg.bankcardId}}</span>
                </p>
                <div class="u-select" data-wrap="layout">
                    <i data-item="col-2">银行</i>
                    <span data-item="col-9" @click="getbankList">
                        <label :class='{red:red}'>{{selected || checkbank&&'请选择' || !checkbank&&'点击选择银行'}}</label>
                        <select v-model="selected"  @change="errorState('selected',$event)">
                            <option v-for="(item,index) in bankList" :key="index" :selected="selected==item.bankName">
                                {{item.bankName}}
                            </option>
                        </select>
                    </span>
                </div>
                <p class="u-error">
                    <span v-show="msg.selected">{{msg.selected}}</span>
                </p>
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion">手机号</i>
                    <input type="tel" class="pl20" :disabled='statusPhone' v-model.trim="userName" maxlength="11" placeholder="请输入银行预留手机号"
                     @keyup="errorState('userName')"  />
                </div>
                <p class="u-error">
                    <span v-show="msg.userName">{{msg.userName}}</span>
                </p>
                <div class="u-input clearfix" data-type="icon" >
                    <i class="me-code me-ion">验证码</i>
                    <send-code :code.sync ='codeMess' :phone ='userName' maxPerSecond ='120'></send-code>
                </div>
                <p class="u-error"><span v-show="msg.codeMess">{{msg.codeMess}}</span></p>
                <button  v-if="type=='urlcg'" class="me-u-btn" data-size=block  data-color="orange" @click="submit()">绑定银行卡</button>
                <button  v-else class="me-u-btn" data-size=block  data-color="orange" @click="submit()">立即开户</button>
                <div v-if="type!='urlcg'">
                    <div  class="reg_foot" data-wrap="checkbox" data-orange>
                        <input type="checkbox" id="mr0" @change="checkClick" v-model="checked"> 
                        <label for="mr0">阅读并同意
                            <a href="#/agreementcg">《用户授权协议》</a>
                        </label>
                        <p><a href="#/agreementjxcg">《江西银行网络交易资金账户服务第三方协议》</a></p>
                    </div>
                    <p class="u-error"><span v-show="checkMsg">{{checkMsg}}</span></p>
                </div>
            </div>
        </div>
        <div class="tip">
            <img src="../assets/images/index/z_tip.png" alt=""/>
            <span>民信贷风险备用金全程保障</span>
        </div>
    </div>
</template>
<script>
    import { formpost } from '@/lib/utils'
    import { mapGetters, mapActions } from 'vuex'
    import SendCode from '@/components/sendCode'
    export default {
        name:'bankcardcg',
        data(){
            let realData = me.localStorage.getItem("realData")||{}
            return {
                userId:me.cookie.getItem("userId"),
                name:realData.name,
                type:this.$route.query.type,
                userName:'',
                codeMess: '',
                bankcardId:"",
                bankcode:'',
                checkMsg:'',
                checked:true,
                cardId:realData.idCard,
                selected:"点击选择银行",
                bankActive:null,
                checkbank: false,
                status:false,
                statusPhone:false,
                bankList:[],
                msg:{userName:"",codeMess:"",bankcardId:"",selected:""},
                result:{telFlag:false,codeFlag:false,bankcardFlag:false,selectFlag:false},
                obligatePhoneNo:'',//银行预留手机号
            }
        },
        components: {
            SendCode,
        },
        computed: {
            ...mapGetters(['phone']),
            red: function() {
                return this.checkbank && !this.bankActive
            }
        },
        watch: {
            codeMess (n,o){
                this.$nextTick(() => {
                    this.codeMessCheck()
                })
            }
        },
        methods:{
            ...mapActions(['account']),
            checkName:function(){
                var tel =  /^1(([3|5|7|8][\d]{9})|(47|45)[\d]{8})$/;
                if(this.statusPhone){
                    this.result.telFlag=true;
                }else{
                    if(this.userName==""){
                    this.msg.userName="手机号不能为空";
                    this.result.telFlag=false;
                    }else if (this.$config.phonetest && this.userName.substr(0,4) == '1110' && this.userName.length == 11) {
                        this.msg.userName = '';
                        this.result.telFlag=true;
                    }else if(tel.test(this.userName)){
                        this.msg.userName="";
                        this.result.telFlag=true;
                    }else{
                        this.msg.userName="手机号码格式不正确";
                        this.result.telFlag=false;
                    }
                }
                
            },
            codeMessCheck:function(){
                var code= /^\d+$/g;
                if(this.codeMess.length==0){
                    this.msg.codeMess="验证码不能为空";
                    this.result.codeFlag=false;
                }else if(code.test(this.codeMess)){
                    this.msg.codeMess="";
                    this.result.codeFlag=true;
                }else{
                    this.msg.codeMess="验证码格式不正确";
                    this.result.codeFlag=false;
                }
            },
            checkBankcard:function(){
                if(this.bankcardId==""){
                    this.msg.bankcardId="银行卡不能为空";
                    this.result.bankcardFlag=false;
                }else if(me.validate.bankCard(this.bankcardId)){
                    this.msg.bankcardId="";
                    this.result.bankcardFlag=true;
                }else{
                    this.msg.bankcardId="银行卡格式不正确";
                    this.result.bankcardFlag=false;
                }
            },
            checkSelected:function(){
               if(!this.bankActive){
                    this.msg.selected="请选择银行卡";
                    this.result.selectFlag=false;
                }else{
                    this.msg.selected="";
                    this.result.selectFlag=true;
                }
            },
            errorState:function(type){
                if(type=="userName"){
                    if(this.userName){
                        this.msg.userName="";
                    }
                }else if(type=="bankcardId"){
                    if(this.bankcardId){
                        this.msg.bankcardId=""; 
                    }
                }else{
                    if(this.selected){
                        this.msg.selected="";
                    }
                    this.bankActive = this.bankList[event.target.selectedIndex]
                }
            },
            inputCard:function(){
                if(this.bankcardId.length>=6){
                    this.checkbankList();
                }else if(this.bankcardId.length<6){
                    this.bankActive = null;
                    this.checkbank&&(this.selected = "请选择")
                }
            },
            checkClick:function(){
                if(this.checked==false){
                    this.checkMsg="请阅读并同意协议"
                }else{
                    this.checkMsg=""
                }
            },
            submit:function(){
                this.checkName()
                this.codeMessCheck()
                this.checkBankcard()
                if(this.result.telFlag&&this.result.codeFlag&&this.result.bankcardFlag&&this.result.selectFlag)
                {   if(this.type=="urlcg"){
                        this.chaCode();
                    }else{
                        this.checkSelected()
                        if(this.checked){
                            this.getDataInit(()=>{
                                this.chaCode();
                            });
                        }
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
                        mobilePhone:that.phone,
                        content:that.codeMess,
                    },
                    callback:function(data){
                        if(data.result == 1) { 
                            if(data.data.result ==1){
                                if(that.type=="urlcg"){
                                    that.bankcardSend();//去绑卡
                                }else{
                                    that.openBankcard();//去开户
                                }
                            }else{
                                me.errorTips({'text':data.data.Msg,from:'25%',to:'25%'});
                            }
                           
                        }else{
                            me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                        }
                    }
                }); 
            },
            //输入六位获取银行
            checkbankList:function(){
                var that = this;
                that.$config.getData({
                    key:"findBankMsgByCard",
                    method:'post',
                    data:{
                        cardNo:that.bankcardId
                    },
                    callback:function(data){
                        if (!that.checkbank){
                            that.checkbank = true
                        }
                        if(data.result == 1) { 
                            if(Object.keys(data.data).length){
                                that.selected = data.data.bank.bankName;
                                that.bankActive = data.data.bank;
                                that.msg.selected="";
                                that.result.selectFlag=true;
                            }else{
                                that.bankActive = null;
                            }
                        }else{
                            me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                        }
                    }
                }); 
            },
            //银行列表
            getbankList:function(){
                var that = this;
                that.$config.getData({
                    key:"findJindunBankList",
                    method:'post',
                    data:{
                        cardNo:that.bankcardId
                    },
                    callback:function(data){
                        if(data.result == 1) { 
                            var data = data.data;
                            if(data.result == 1){
                                that.bankList=data.bankList;
                            }
                        }else{
                            me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                        }
                    }
                }); 
            },
            //检查实名是次数
            getDataInit:function(callback){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"checkStatusAndCount",
                        method:'post',
                        data:{
                            userId:this.userId,
                            authTypeId:2,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                var data = data.data;
                                if(data.authCount > 3){
                                    that.$vux.confirm.show({
                                        title: '您已实名认证超过3次，请联系客服：400 044 3888(工作日9:10-18:00)',
                                        confirmText: '呼叫',
                                        hideOnBlur: true,
                                        onCancel:()=>{
                                            
                                        },
                                        onConfirm:()=>{
                                            window.location.href="tel:400 044 3888";
                                        },
                                    });
                                }else {
                                    if (typeof callback === 'function') {
                                        callback()
                                    }
                                }
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                } 
            },
            //发送绑卡信息
            bankcardSend:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"bankcardcg",
                        method:'post',
                        data:{
                            userId:that.userId,
                            obligatePhoneNo:that.userName,
                            cardNo:that.bankcardId,
                            bankName:that.bankActive.bankName,
                            bankCode:that.bankActive.bankCode,
                        },
                        callback:function(data){
                            if(data.result == 1 && data.data) { 
                                if(data.data.result==1){
                                    that.account({
                                        isOpenedAccount: 1,
                                        isOnCard: 1
                                    })
                                    setTimeout(() => {
                                        that.$root.goUrl("/bankcard")
                                    }, 1000)
                                }else{
                                    me.errorTips({'text':data.data.msg,from:'25%',to:'25%'});
                                }
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                } 
            },
            //设置交易密码
            setTransPwd () {
                return new Promise((resolve, reject) => {
                    this.$config.getData({
                    key: 'setTransPwdH5',
                    method: 'post',
                    data: {
                        userId: this.userId,
                        successUrl: this.$config.refreshurl + '/userSet',
                        failureUrl: this.$config.refreshurl + '/userSet'
                    },
                    callback: (data) => {
                        resolve(data)
                    }
                    })
                })
            },
            async getSetTransPwdUrl () {
                let { data, errorMsg, result } = await this.setTransPwd()
                if (result === 1) {
                  if (data.result === 'success') {
                    this.$vux.loading.show({
                      text: '跳转中'
                    })
                    formpost(data.TARGET_URL, data.parameters).then(() => {
                    }).catch(() => {
                      this.$vux.loading.hide()
                    })
                  } else {
                    this.$vux.toast.show({
                      type: 'cancel',
                      width: 'auto',
                      text: data.msg
                    })
                  }
                } else {
                  this.$vux.toast.show({
                    type: 'cancel',
                    width: 'auto',
                    text: errorMsg
                  })
                }
            },
            //去开户
            openBankcard:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"openAccount",
                        method:'post',
                        data:{
                            userId:that.userId,
                            realName:that.name,
                            idCard:that.cardId,
                            obligatePhoneNo:that.userName,
                            cardNo:that.bankcardId,
                            clientType:2,
                            bankName:that.bankActive.bankName,
                            bankCode:that.bankActive.bankCode,
                        },
                        callback:function(data){
                            if(data.result == 1 && data.data) { 
                                if(data.data.result==1){
                                    that.account({
                                        isOpenedAccount: 1,
                                        isOnCard: 1,
                                        realName: that.name,
                                        IDcard: that.cardId,
                                        isRealNameAuth: 1,
                                    })
                                    me.errorTips({'text':"开户成功",from:'25%',to:'25%'});
                                    that.getSetTransPwdUrl()
                                }else{
                                    me.errorTips({'text':data.data.msg,from:'25%',to:'25%'});
                                }
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                } 
            },
            //判断认证状态
            getDataState:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"checkStatusAndCount",
                        method:'post',
                        data:{
                            userId:this.userId,
                            authTypeId:1,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                var data = data.data;
                                if( data.authStatus== 1){
                                    that.getDataPhone();
                                }
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                } 
            },
            //获取手机号预留手机号
            getDataPhone:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccountMsg",
                        method:'post',
                        data:{
                            userId:that.userId,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                var data = data.data.personalInfoVo;
                                if(data.reservedPhoneNo){
                                    that.userName = data.reservedPhoneNo;
                                    that.statusPhone = true;
                                }else{
                                    that.statusPhone = false;
                                }                                
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                } 
            },
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '存管账户绑卡',
                    headFlag: true
                })
            },
        },
        mounted(){
            this.activated();
            this.getDataState();//判断认证状态
            me.require(['errTips']);
        },
        created(){
            this.getbankList();
        }
    }
</script>

<style lang="less" scoped>
.bankcardMain{
    .bank-tips{
        line-height:0.8rem;font-size:0.48rem;color:#797979;padding:.3rem .8rem;
        background:#fff;margin-bottom:0.8rem;
        span{color:#fe6f07}
    }
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
    .u-select{
        width: 100%;
        height: 1.76rem;
        line-height: 1.76rem;
        position: relative;
        background: #fff;
        border:1px solid #dbdbdb;
        font-size: 0.6rem;
        padding-left:0.4rem;overflow:hidden;
        span,select{
            display:block;height:100%;background:#fff;
            position:relative;
            color:#333;
            label.red{
                color:#ff0000;
            }
        }
        select{position:absolute;left:0px;top:0px;
            width:100%;height: 1.70rem;line-height:1.59rem;
            border:0;outline:0;background:#fff;opacity:0;
        }
        
    }
    .s-tips.red{color:#ff0000;padding-top:0}
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
.reg_foot{padding:0.35rem 0 0 4px;
    a{color:#fe6f07}
    p{padding-left:15px;}
}
</style>