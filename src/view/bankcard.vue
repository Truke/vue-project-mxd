<template>
    <div class="bankcard">
        <div class="width-90">
            <!--民信贷账户-->
            <h2>民信贷旧账户</h2>
            <bankcard-state :getdata="getdata" :urlmxd="urlmxd" >
            </bankcard-state>    
            <p class="s-tips" v-if="getdata.result==1&&(getdata.status==null||getdata.status==1)">
                为保证您的资金安全，民信贷仅会由您已经绑定的银行卡中完成充值操作，提现请前往请前往pc或app端操作。
            </p>
            <!--银行存管账户-->
            <h2>银行存管账户</h2>
            <bankcard-state :getdata="getdatacg" :urlcg="urlcg" :urlcgr="urlcgr">
            </bankcard-state>
            <p class="s-tips" v-if="getdata.result==1&&(getdata.status==null||getdata.status==1)">
                温馨提示：存管账户仅可在无债权关系且账户余额为0的情况下完成解绑，如需解绑，请前往pc或app端操作。
            </p>
        </div>   
    </div>
</template>

<script>
    export default {
        name:'bankcard',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                getdata:{
                },
                getdatacg:{
                },
                urlmxd:false,
                urlcg:false,
                urlcgr:false,
            }
        },
        methods:{
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '我的银行卡',
                    headFlag: true
                })
           },
           //获取页面数据
            getDataInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"userBankBefore",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result == 1) { 
                                var data = data.data
                                that.getdata=data.mxd;
                                that.getdatacg=data.cg;
                                //民信贷绑卡未绑卡
                                if(data.mxd.result == 0){
                                    that.urlmxd = true;
                                }
                                //存管账户
                                if(data.cg.result == 1){//是否开户
                                    //是否解绑0是解绑过的
                                   if(data.cg.status==1){
                                        that.getdata.bankName = data.mxd.name;
                                   }else{
                                        that.urlcg = true;
                                   }
                                }else{ 
                                    that.urlcgr = true;
                                }
                            }else{
                                me.errorTips({'text':data.errorMsg,from:'25%',to:'25%'});
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
        
    }
</script>

<style lang="less" scoped>

</style>