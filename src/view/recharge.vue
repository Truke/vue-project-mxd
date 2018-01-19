<template>
    <div class="recharge">
        <x-header
          style="background-color: #fe6f07;"
          :left-options="leftOptions"
          title="充值"
          @on-click-back="clickBack">
        </x-header>
        <div class="tabTitle">
            <div class="titleCon width-90" data-wrap="layout">
                <span data-item="col-6" @click="showList(0)" v-bind:class="{active: myData.isActive == 0}">我要充值</span>
                <span data-item="col-6" @click="showList(1)" v-bind:class="{active: myData.isActive == 1}">充值记录</span>
            </div>
        </div>
        <div v-if="myData.isActive=='0'">
            <recharges :myData="myData"
                @checkMoney="checkMoney"
                @hideError="hideError"
                @hideIcon="hideIcon"
                @del="del"
                @recharge="recharge"
                @oldRecharge="oldRecharge"
                @goTo="goTo">
            </recharges>
        </div>
        <div v-else>
           <rechargeList :useType="myData.useType" 
                :sumAmount= "myData.sumAmount" 
                :sumAmountCg = "myData.sumAmountCg"
                :myList="listData" 
                :myLists="oldListData" 
                @goTo="goTo">
           </rechargeList>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { XHeader } from 'vux'
    import recharges from '@/components/recharges.vue'
    import rechargeList from '@/components/rechargeList.vue'
    export default {
        name:'recharge',
        data(){
            return {
               myData:{
                  userId: me.cookie.getItem("userId") || "",
                  useType : "1",
                  money:"",
                  availableAmount:'',
                  sumAmount:"",
                  sumAmountCg:"",
                  isActive: 0,
                  moneyMsg:'',
                  moneyFlag:false,
                  moneyIcon:false, 
                  bankLimit:{},  
               }, 
               cardNo:"",
               listData:[],
               oldListData:[]
            }
        },
        components: {
            XHeader,
            recharges,
            rechargeList
         },
         computed: {
            leftOptions () {
              return {
                showBack: !0,
                backText: '',
                preventGoBack: !0
              }
            }
         },
        methods:{
            ...mapActions(['findAccountCartMsgAPI']),
            init(){
                this.$store.dispatch('setPageHead', {
                    show: false,
                    title: '充值',
                    headFlag: false
                })
            },
            clickBack () {
              this.$router.replace({name: 'ucenter'})
            },
            showList(choice){
                this.myData.isActive = choice;
            },
            getRealInfo(){ //判断老用户是否实名
                var $this = this;
                $this.$config.getData({
                    key:'findAuth',
                    method:'post',
                    data:{
                        userId : $this.myData.userId,
                        authTypeId : "2"
                    },
                    callback:function(data){
                        if(data.result == '1') {
                            if(data.data.status == "9"){
                                $this.getBankInfo();
                            }else{
                                $this.$vux.confirm.show({
                                    title: '您的账号还未进行实名认证，为保证您的财产请实名认证进行充值',
                                    confirmText: '确定',
                                    hideOnBlur: false,
                                    onCancel:()=>{
                                        $this.$router.push({name: 'ucenter'})
                                    },
                                    onConfirm:()=>{
                                        $this.$router.push({name: 'bankcardOld'})
                                    },
                                });
                            }                      
                        }
                    }
                });
            },
            getBankInfo(){ //判断老用户是否绑卡
                var $this = this;
                $this.$config.getData({
                    key:'findOnlyOneCardInfo',
                    method:'post',
                    data:{
                        userId : $this.myData.userId,
                        request : ""
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            if(data.data.result == "1"){  
                                $this.getMoney();
                            }else{
                                $this.$vux.confirm.show({
                                    title: '为了保护您的资金安全,民信贷手机上线同卡进出，请重新绑定银行卡',
                                    confirmText: '立即绑卡',
                                    hideOnBlur: false,
                                    onCancel:()=>{
                                        $this.$router.push({name: 'ucenter'})
                                    },
                                    onConfirm:()=>{
                                        $this.$router.push({name: 'bankcardOld'})
                                    },
                                });
                            }                    
                        }
                    }
                });
            },
            getMoney(){ //获取老用户可用余额
                var $this = this;
                $this.$config.getData({
                    key:'findAccountold',
                    method:'post',
                    data:{
                        userId : $this.myData.userId
                    },
                    callback:function(data){
                        if(data.result == '0'){
                            $this.myData.availableAmount = data.data.availableAmount;      
                        }
                    }
                });
            },
            getSumMoney(){ //获取老用户充值总额
                var $this = this;
                $this.$config.getData({
                    key:'sumRecharge',
                    method:'post',
                    data:{
                        userId : $this.myData.userId
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            $this.myData.sumAmount = data.data.sumAmount;
                        }
                    }
                });
            },
            getListOld(){ //获取老用户充值记录
                var $this = this;
                $this.$config.getData({
                    key:'rechargeList',
                    method:'post',
                    data:{
                        userId : $this.myData.userId,
                        pageNo : 1,
                        pageSize : 100
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            $this.oldListData = data.data.list;
                        }
                    }
                });
            },
            getBankInfoCg(){ //获取存管银行卡信息
                this.findAccountCartMsgAPI().then((data) => {
                    if(data.result == '1'){
                        var data = data.data;
                        if(data.result == "1"){
                            this.cardNo = data.cardNo;
                            this.getBankLimitCg(); 
                        }
                    }
                })
            },
            getBankLimitCg(){ //根据存管银行卡信息获取该银行限额
                var $this = this;
                $this.$config.getData({
                    key:'findBankMsgByCard',
                    method:'post',
                    data:{
                        cardNo : $this.cardNo
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            var data = data.data;
                            if(data.result == "1"){
                                $this.myData.bankLimit = data.bank;
                            }
                        }
                    }
                });
            },
            getListCg(){ //获取存管充值记录列表
                var $this = this;
                $this.$config.getData({
                    key:'rechargeListcg',
                    method:'post',
                    data:{
                        userId : $this.myData.userId,
                        pageNo : 1,
                        pageSize : 100
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            $this.listData = data.data.list;
                            $this.myData.sumAmountCg = data.data.sumAmount;
                        }
                    }
                });
            },
            checkMoney(){
                if(!this.myData.money){
                    this.myData.moneyMsg = '充值金额不能为空!';
                    this.myData.moneyFlag = false;
                }else if(this.myData.money < 0){
                    this.myData.moneyMsg = '充值金额不能小于0元!';
                    this.myData.moneyFlag = false;
                }else if(this.myData.money < 1){
                    this.myData.moneyMsg = '起投金额不能小于1元!';
                    this.myData.moneyFlag = false;
                }else if(!/^\d+$/.test(this.myData.money)){
                    this.myData.moneyMsg = '充值金额只能为整数!';
                    this.myData.moneyFlag = false;
                }else if(this.myData.money.length > 9){
                    this.myData.moneyMsg = '充值金额不能超过交易限额!';
                    this.myData.moneyFlag = false;
                }else{
                    this.myData.moneyMsg = '';
                    this.myData.moneyFlag = true;
                }			
		    },
            hideError(){
                this.myData.moneyMsg = '';
                if(this.myData.money){
                    this.myData.moneyIcon = true;
                }
            },
            hideIcon(){
                setTimeout(()=>{
                    this.myData.moneyIcon = false;
                }, 0);
            },
            del(){
                this.myData.money = '';
            },
            async recharge(){ //存管江西银行
                this.checkMoney();    
                if(this.myData.moneyFlag){
                    var $this = this, redirect = $this.$route.query.redirect;
                    $this.$vux.loading.show();
                    var transactionUrl = $this.$config.refreshurl;
                    if(redirect){
                        transactionUrl += decodeURIComponent(redirect);
                    }else{
                        transactionUrl += "/recharge/cg/1";
                    }
                    $this.$config.getData({
                        key:'appToRechargeNew',
                        method:'post',
                        data:{
                            userId : $this.myData.userId,
                            amount : $this.myData.money,
                            source : 3,
                            transactionUrl : transactionUrl
                        },
                        callback:function(data){
                            $this.$vux.loading.hide();
                            if(data.result == '1'){
                                if(data.data.result == "success"){
                                    var result = data.data.jdRechargeRes,
                                        str = result.parameters,
                                        url = result.actionUrl,
                                        params = "",
                                        arr = str.split('&'),
                                        op = "";
                                    for(var i = 0;i < arr.length; i++){
                                        var key = arr[i].split('=')[0],
                                            val = decodeURIComponent(arr[i].split('=')[1]);
                                        params += op+"\""+key+"\":\""+val+"\""; 
                                        op = ",";
                                    }
                                    params = "{"+params+"}";                                       
                                    var data = $.parseJSON(params);
                                    me.post_yb(url,data);
                                }else{
                                    me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
                                }
                            }
                        }
                    }); 
                }      
            },
            oldRecharge(){ //老用户连连支付
                this.checkMoney();    
                if(this.myData.moneyFlag){
                    var $this = this , redirect = $this.$route.query.redirect;
                    var notifyUrl = $this.$config.refreshurl;
                    if(redirect){
                        notifyUrl += decodeURIComponent(redirect);
                    }else{
                        notifyUrl += "/recharge/old/1";
                    }
                    $this.$config.getData({
                        key:'applyRecharge',
                        method:'post',
                        data:{
                            userId : $this.myData.userId,
                            amount : ($this.myData.money)*100,
                            source : 3,
                            notifyUrl : notifyUrl
                        },
                        callback:function(data){
                            if(data.result == '1'){
                                window.location.href = data.data.payurl;
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'}); 
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
            if(this.$route.params.type =="cg"){
              this.myData.useType = "1";
              this.getBankInfoCg();
              this.getListCg();
            }else if(this.$route.params.type =="old"){
              this.myData.useType = "2";
              this.getRealInfo();  
              this.getSumMoney();
              this.getListOld();
            }
            this.$route.params.back == "1" ? this.myData.isActive = 1 : this.myData.isActive = 0;
        }
    }
</script>
