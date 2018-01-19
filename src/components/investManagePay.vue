<template>
    <div>
        <template v-if="isActiveNav==0">
            <p class="my-page s-t-center" v-if="totalRow>0">共有<b class="s-org">{{totalRow}}</b>个记录</p>
            <div class="width-95" v-if="totalRow>0">
                <div class="list" v-for="(item,index) in payList" :key="index">
                    <p class="title">{{item.borrowTitle}}</p>
                    <div data-wrap="layout" @click="goTo('investManageDetails',item)">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.investAmount | my-filter}}</li>
                            <li v-if="isActive==1"><span>待收本息:</span>&yen;{{item.unIncomeAmount | my-filter}}</li>
                            <li v-if="isActive==2"><span>到期日期:</span>{{item.repaymentedTime}}</li>
                            <li><span>总期数:</span>{{item.loanPeriod}}
                                <i v-if="item.loanPeriodType=='0'">个月</i>
                                <i v-if="item.loanPeriodType=='1'">日</i>
                            </li>           
                        </ul>
                        <div data-item="col-3"> 
                            <div v-if="isActive==1">
                                <p class="s-t-center">应收利息</p>
                                <b class="s-t-center">&yen;{{item.totalAmount-item.investAmount | my-filter}}</b>
                            </div>
                            <div v-if="isActive==2">
                                <p class="s-t-center">已收利息</p>
                                <b class="s-t-center">&yen;{{item.totalAmount-item.investAmount | my-filter}}</b>
                            </div>               
                        </div>
                    </div>
                </div> 
            </div>
             <div class="width-95 s-t-center" v-else-if="totalRow===0">
                暂无数据
            </div>
            <div class="my-button" @click="goTo('invest')">继续投资</div>
        </template>
        <template v-if="isActiveNav==1">   
            <p class="my-page s-t-center" v-if="totalRow>0">共有<b class="s-org">{{totalRow}}</b>个记录</p>
            <div class="width-95" v-if="totalRow>0">
                <div class="list" v-for="(item,index) in payList" :key="index">
                    <p class="title">{{item.borrowSetName}}</p>
                    <div data-wrap="layout" @click="goTo('investManageDetails',item)">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.amount | my-filter}}</li>
                            <li><span>到期日期:</span>{{item.deadline | atatime}}</li>
                            <li><span>总期数:</span>{{item.borrowSetLoanPeriod | newVal}}个月</li>           
                        </ul>
                        <div data-item="col-3"> 
                            <p class="s-t-center" v-if="isActives==1">应收利息</p>
                            <p class="s-t-center" v-if="isActives==2">预期收益</p>
                            <b class="s-t-center">&yen;{{item.expectedIncome | my-filter}}</b>          
                        </div>
                    </div>
                </div> 
            </div>
            <div class="width-95 s-t-center" v-else-if="totalRow===0">
                暂无数据
            </div>
            <div class="my-button" @click="goTo('invest')">继续投资</div>
        </template>
    </div>
</template>
<script>  
    import datetime from '@/lib/dateTimeFormatter'   
    export default {
        data(){
            return {
                item:{},
                flagData:{}
            }
        },
        props: ['payList','totalRow','isActive','isActives','isActiveNav'],
        filters:{
            newVal(value){
                return value || "0"
            },
            atatime (v) {
                return datetime(Number(v),2)
            }   
        },
        methods:{
            goTo(url,item){
                this.$emit("goTo",url);
                if(item){
                    me.localStorage.setItem("investManageData", item);
                    this.flagData.isActiveNav = this.isActiveNav;
                    this.flagData.isActive = this.isActive;
                    this.flagData.isActives = this.isActives;
                    me.localStorage.setItem("investManageFlag", this.flagData);
                }
            },
        }
    }
</script>

<style lang="less" scoped>
.my-page{
    padding-bottom:.3rem;
}
.list{
     margin-bottom:.3rem;
    .title{
        height:1.2rem;
        line-height:1.2rem;
        background:#fff5ed;
        padding:0 .5rem;
        font-size:.56rem;
    }
    span{
        width:45%;
        color:#9e9e9f;
        display:inline-block;
    }
    div[data-wrap="layout"]{
        background:#fff;
        padding:.5rem;
        border-radius:0 0 .15rem .15rem;
    }
    div[data-item="col-3"]{
        width:22%;
        p{background:#fff5ed; margin-top:.5rem;}
        b{background:#fe6f06; color:#fff;display:block; 
            font-size:.52rem;
        }
    }
}
</style>