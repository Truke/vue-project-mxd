<template>
    <div class="bankcard">
        <div class="width-90">
            <div class="my-form">
                <h2>请绑定本人的储蓄卡，目前只支持绑定一张卡。</h2>
                <p class="s-tips red">请填写本人真实信息，核实后将不可更改</p>
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion">持卡人</i>
                    <input class="pl20" type="text" :disabled='status' v-model.trim="userName"  placeholder="请输入姓名"
                        @keyup="errorState('userName')"
                    />
                    </div>
                <p class="u-error">
                    <span v-show="msg.userName">{{msg.userName}}</span>
                </p>
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion">身份证号</i>
                    <input class="pl20" type="text"  :disabled='status' placeholder="请输入身份证号" maxlength="18"
                        v-model.trim="cardId" @keyup="errorState('cardId')"
                    />
                </div>
                <p class="u-error">
                    <span v-show="msg.cardId">{{msg.cardId}}</span>
                </p>
                <div class="u-input" data-type="icon">
                    <i class="me-person me-ion">卡号</i>
                    <input class="pl20" type="tel" v-model.trim="bankcardId" placeholder="请输入银行卡号"
                        @keyup="errorState('bankcardId')" maxlength="20"
                        @input="inputCard"
                    />
                </div>
                <p class="u-error">
                    <span v-show="msg.bankcardId">{{msg.bankcardId}}</span>
                </p>
                <div class="u-select" data-wrap="layout">
                    <i data-item="col-3">选择银行</i>
                    <span data-item="col-9" @click="getbankList">
                        <label :class='{red:red}'>{{selected || checkbank&&'请选择' || !checkbank&&'点击选择银行'}}</label>
                        <select class="pl20" v-model="selected"  @change="errorState('selected',$event)">
                            <option v-for="(item,index) in bankList" :key="index"  :selected="selected==item.name">
                                {{item.name}}
                            </option>
                        </select>
                    </span>
                </div>
                <p class="u-error">
                    <span v-show="msg.selected">{{msg.selected}}</span>
                </p>
                <button class="me-u-btn" data-size=block  data-color="orange" @click="submit()">提交</button>
            </div>
        </div>
        <div class="tip">
            <img src="../assets/images/index/z_tip.png" alt=""/>
            <span>民信贷风险备用金全程保障</span>
        </div>         
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name:'bankcard',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                userName:"",
                cardId:"",
                bankcardId:"",
                selected:"点击选择银行",
                syscodeId:"",
                bankActive:null,
                checkbank: false,
                status:false,
                showFlage:true,
                bankList:[],
                msg:{userName:"",cardId:"",bankcardId:"",selected:""},
                result:{nameFlag:false,cardIdFlag:false,bankcardFlag:false,selectFlag:false}
            }
        },
        computed: {
            red: function() {
                return this.checkbank && !this.bankActive
            }
        },
        methods:{
            ...mapActions(['account']),
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '旧账户绑卡',
                    headFlag: true
                })
            },
            checkName:function(){
                if(this.userName==""){
                    this.msg.userName="姓名不能为空";
                    this.result.nameFlag=false;
                }else{
                    this.nameFlag="";
                    this.result.nameFlag=true;
                }
            },
            checkCardId:function(){
                if(this.cardId==""){
                    this.msg.cardId="身份证号不能为空";
                    this.result.cardIdFlag=false;
                }else if(me.validate.IDCard(this.cardId)){
                    this.msg.cardId="";
                    this.result.cardIdFlag=true;
                }else{
                    this.msg.cardId="身份证号码格式不正确";
                    this.result.cardIdFlag=false;
                }
            },
            checkBankcard:function(){
                if(this.bankcardId==""){
                    this.msg.bankcardId="银行卡号不能为空";
                    this.result.bankcardFlag=false;
                }else if(me.validate.bankCard(this.bankcardId)){
                    this.msg.bankcardId="";
                    this.result.bankcardFlag=true;
                }else{
                    this.msg.bankcardId="银行卡号格式不正确";
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
            errorState:function(type,event){
                if(type=="userName"){
                    if(this.userName){
                        this.msg.userName="";
                    }
                }else if(type=="cardId"){
                    if(this.cardId){
                       this.msg.cardId="";
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
            submit:function(){
                if(this.status==false){//先实名认证然后接口
                    this.checkName()
                    this.checkCardId()
                    if(this.result.nameFlag&&this.result.cardIdFlag){
                        
                        this.addRealnameAuth(()=>{
                            this.checkBankcard()
                            this.checkSelected()
                            if(this.result.nameFlag&&this.result.cardIdFlag&&this.result.bankcardFlag&&this.result.selectFlag){
                                this.getDataInit(()=>{
                                    this.bankcardSend();
                                });
                            }
                        });
                    }
                }else{
                    this.checkBankcard()
                    this.checkSelected()
                    if(this.result.bankcardFlag&&this.result.selectFlag){
                        this.bankcardSend();
                    }
                }
            },
            //输入六位获取银行
            checkbankList:function(){
                var that = this;
                that.$config.getData({
                    key:"findBankMsgByCardNo",
                    method:'post',
                    data:{
                        backCardNo:that.bankcardId
                    },
                    callback:function(data){
                        if (!that.checkbank){
                            that.checkbank = true
                        }
                        if(data.result == 1) { 
                            if(Object.keys(data.data).length){
                                that.selected = data.data.bankName;
                                that.bankActive = data.data;
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
                    key:"findBankNameListOfYeePay",
                    method:'post',
                    data:{
                        type:"bank"
                    },
                    callback:function(data){
                        if(data.result == 1) { 
                            var data = data.data;
                            that.bankList=data.list;
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
                        key:"checkStatusAndCount",
                        method:'post',
                        data:{
                            userId:that.userId,
                            authTypeId:2,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                var data = data.data;
                                if (data.authStatus == 0){
                                    that.status = false;
                                    that.result.nameFlag=false;
                                    that.result.cardIdFlag=false;
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
                                    }
                                    return;
                                }else if( data.authStatus== 1){
                                    that.cardId = me.str.str2char(data.cardNo,3,(data.cardNo.length-4),'*');
                                    that.userName = me.str.str2char(data.userName,1,(data.userName.length-1),'*');
                                    that.status = true;
                                    that.result.nameFlag=true;
                                    that.result.cardIdFlag=true;
                                }
                                if (typeof callback === 'function') {
                                    callback()
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
                        key:"bankcardold",
                        method:'post',
                        data:{
                            userId:this.userId,
                            syscodeId:that.bankActive.bankCode||that.bankActive.id,
                            cardNo:that.bankcardId,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                me.errorTips({'text':data.data.msg,from:'25%',to:'25%'});
                                if(data.data.result==1){
                                    that.account({
                                        isOldOnCard: 1
                                    })
                                    setTimeout(() => {
                                        that.$router.push({name: 'pwdChange', params: {'type': 'changeOldTrans'}})
                                    }, 1000)
                                    
                                }
                            } 
                        }
                    }); 
                } 
            },
            //实名认证
            addRealnameAuth:function(callback){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"addRealnameAuth",
                        method:'post',
                        data:{
                            userId:this.userId,
                            realname:that.userName,
                            idCard:that.cardId,
                            otherInfo:JSON.stringify({
                                    "idCard":{"name":"inId","chinese":"\u8bc1\u4ef6\u53f7","value":that.cardId},
                                    "realName":{"name":"inName","chinese":"\u59d3\u540d","value":that.userName},
                                    "valid":{"name":"valid","chinese":"\u6709\u6548\u671f","value":"2099-01-01"},"type":0
                            }),
                            clientType:4,
                            promation:6001,
                            source:4,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                
                            } else {
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                            }
                            if(data.data.result==1 || data.data.result == 2){
                                me.errorTips({'text':data.data.msg,from:'25%',to:'25%'});
                                that.account({realName: that.userName,IDcard: that.cardId, isRealNameAuth: 1})
                                that.status = true;
                                that.result.nameFlag=true;
                                that.result.cardIdFlag=true;
                                callback && callback();
                            }else{
                                me.errorTips({'text':data.data.msg,from:'25%',to:'25%'});
                            }
                        }
                    }); 
                }
            }
        },
        mounted(){
            this.activated();
            this.getDataInit();
            me.require(['errTips']);
        },
        created(){
            this.getbankList();
        }
    }
</script>

<style lang="less" scoped>
.bankcard{
    .my-form .u-input{
        border:1px solid #dbdbdb;
        input.pl20{
            background:#fff;
            padding-left:3.6rem;
            width: 100%;height: 100%;font-size: 0.6rem;
        }
    }
    .my-form .u-input i.me-ion{
        color:#000;font-size:0.58rem;line-height:0.8rem;
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
        }
        span{
            background:url(../assets/images/g-bankcard-icon01.png) no-repeat 95% center;
            background-size:0.26rem auto;
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
}
</style>