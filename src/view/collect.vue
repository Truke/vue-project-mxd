<template>
    <div class="collect">
        <div class="ucenter-bg">
           <div class="u-c-upper width-90">
               <p>待收总额（元）</p>
               <b>{{unincomeAmount | my-filter}}</b>
           </div>
        </div>
        <div class="u-c-middle">
            <ul class="list">
                <li data-wrap="layout">
                    <span data-item="col-6">
                        待收收益
                        <b>{{unIncomeInterest | my-filter}}</b>
                    </span>
                    <label data-item="col-6">
                        待收本金
                        <b>{{unincomeCapital | my-filter}}</b>
                    </label>
                </li>
                <li data-wrap="layout">
                    <span data-item="col-6">
                        冻结金额
                        <b>{{freezeAmount | my-filter}}</b>
                    </span>
                    <label data-item="col-6">
                        可用金额
                        <b>{{availableAmount | my-filter}}</b>
                    </label>
                </li>
                <li data-wrap="layout">
                    <span data-item="col-6">
                        存管账户冻结金额
                        <b>{{freezeAmountcg | my-filter}}</b>
                    </span>
                    <label data-item="col-6">
                        存管账户可用金额
                        <b>{{availableAmountcg | my-filter}}</b>
                    </label>
                </li>
            </ul>
            <ul class="listMargin">
                <li data-wrap="layout">
                    <span data-item="col-6">累计收益</span>
                    <label data-item="col-6">
                        {{incomeInterest | my-filter}}
                    </label>    
                </li>
                <li data-wrap="layout">
                    <span data-item="col-6">邀请好友奖励</span>
                    <label data-item="col-6">
                        {{incomeByFriend | my-filter}}
                    </label>    
                </li>
            </ul>    
        </div>   

    </div>
</template>

<script>
    export default {
        name:'collect',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                unincomeAmount:"0.00",
                unIncomeInterest:"0.00",
                unincomeCapital:"0.00",
                freezeAmount:"0.00",//旧账户
                availableAmount:"0.00",
                freezeAmountcg:"0.00",//存管
                availableAmountcg:"0.00",
                incomeInterest:'0.00',
                incomeByFriend:'0.00',
            }
        },
        methods:{
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '待收总额',
                    headFlag: true
                })
            },
            //获取页面数据
            getDataInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccount",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data
                                if(data){
                                    that.unincomeAmount = data.unincomeAmount;
                                    that.unIncomeInterest = data.unIncomeInterest;
                                    that.incomeInterest = data.incomeAllAmount;
                                    that.unincomeCapital = data.unincomeCapital;
                                    that.freezeAmount = data.freezeAmount;
                                    that.availableAmount = data.availableAmount;
                                    that.freezeAmountcg = data.freezeAmountcg;
                                    that.availableAmountcg = data.availableAmountcg;
                                    that.incomeByFriend = data.incomeByFriend; 
                                }
                            }
                        }
                    }); 
                }
                
            },
        },
        mounted(){
           this.activated();
           this.getDataInit();
        }
    }
</script>

<style lang="less" scoped>
.u-c-upper{
    border-bottom:1px solid #e5e5e5;
}
.u-c-middle{
    .list{background:#fff;
        li{ 
            padding:0.72rem 1.24rem;border-bottom:1px solid #e5e5e5;
            color:#999;
            span{
                border-right:1px solid #c9c9c9;
            }
            label{
                text-align:right;
            }
            b{
                display:block;color:#051b28;
                font-size:.6rem;
            }
        }
    }
    .listMargin{
        li{ height:1.96rem;line-height:1.96rem;background:#fff;
            padding:0 1.24rem;
            border-bottom:1px solid #e5e5e5;
            border-top:1px solid #e5e5e5;
            color:#999;
            margin:0.4rem 0;
            span{
                color:#999;
            }
            label{
                text-align:right;
                font-size:.6rem;
                color:#051b28;
            }
        }
    }
}
</style>