<template>
    <div class="wrapper">
        <template v-if="flag.isActiveNav==0">
            <div class="width-95">
                <div class="list">
                    <p class="title">{{item.borrowTitle}}</p>
                    <div data-wrap="layout">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.investAmount | my-filter}}</li>
                            <li v-if="flag.isActive==1"><span>待收本息:</span>&yen;{{item.unIncomeAmount | my-filter}}</li>
                            <li v-else-if="flag.isActive==2"><span>到期日期:</span>{{item.repaymentedTime}}</li>
                            <li><span>总期数:</span>{{item.loanPeriod}}
                                <i v-if="item.loanPeriodType=='0'">个月</i>
                                <i v-else-if="item.loanPeriodType=='1'">日</i>
                            </li>
                        </ul>
                        <div data-item="col-3">
                            <p class="s-t-center">{{flag.isActive==1 ? "应收利息" : "已收利息"}}</p>
                            <b class="s-t-center">&yen;{{item.totalAmount-item.investAmount | my-filter}}</b>
                        </div>
                    </div>
                </div> 
            </div>
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td>期数</td>
                    <td>应收款时间</td>
                    <td>待收本金</td>
                    <td>待收利息</td>
                    <td>状态</td>
                </tr>
                <tr v-for="(item,index) in list" :key="index">
                    <td>{{item.issueNo}}</td>
                    <td>{{item.deadline}}</td>
                    <td>&yen;{{item.unincomeCapital | my-filter}}</td>
                    <td>&yen;{{item.unincomeInterest | my-filter}}</td>
                    <td>
                        <span v-if="item.status == 0">未还清</span>
                        <span v-else-if="item.status == 1">已还清</span>
                        <span v-else-if="item.status == 2">逾期未还清</span>
                        <span v-else-if="item.status == 3">逾期已还清</span>
                    </td>
                </tr>
            </table>
        </template>
        <template v-if="flag.isActiveNav==1">
            <div class="width-95">
                <div class="list">
                    <p class="title">{{item.borrowSetName}}</p>
                    <div data-wrap="layout">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.amount | my-filter}}</li>
                            <li><span>到期日期:</span>{{item.deadline | atatime}}</li>
                            <li><span>总期数:</span>{{item.borrowSetLoanPeriod | newVal}}个月</li>
                        </ul>
                        <div data-item="col-3">
                            <p class="s-t-center">{{flag.isActives==1 ? "应收利息" : "预期收益"}}</p>
                            <b class="s-t-center">&yen;{{item.expectedIncome | my-filter}}</b> 
                        </div>
                    </div>
                </div> 
            </div>
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td>期数</td>
                    <td>借款标题</td>
                    <td>出借金额</td>
                    <td>待收金额</td>
                </tr>
                <tr v-for="(item,index) in list" :key="index">
                    <td>{{item.borrowId}}</td>
                    <td>{{item.borrowTitle}}</td>
                    <td>&yen;{{item.investAmount | my-filter}}</td>
                    <td v-if="flag.isActives == 1">
                        &yen;{{item.unincomeAmount | my-filter}}
                    </td>
                    <td v-else-if="flag.isActives == 2">
                        {{item.unincomeAmount}}
                    </td>
                </tr>
            </table>
        </template>
    </div>
</template>

<script>
    import datetime from '@/lib/dateTimeFormatter'   
    export default {
        data(){
            return {
                userId: me.cookie.getItem("userId") || "",
                item:{},
                list:{},
                flag:{}
            }
        },
        filters:{
            newVal(value){
                return value || "0"
            },
            atatime (v) {
                return datetime(Number(v),2)
            }      
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '投资管理详情',
                    headFlag: true
                })
            },
            getInfo(){
               var $this = this;
               $this.$config.getData({
                    key:"incomeRecordListCg",
                    method:'post',
                    data:{
                        userId:$this.userId,
                        investId:$this.item.investId,
                        depositoryFlag:$this.item.depositoryFlag,
                        pageNo:1,
                        pageSize:100
                    },
                    callback:function(data){
                        if(data.result == '1') {   
                            $this.list = data.data.list;
                        }
                    }
                });  
            },
            getVipInfo(){
               var $this = this;
               $this.$config.getData({
                    key:"getInvestedBorrowSetDetail",
                    method:'post',
                    data:{
                        userId:$this.userId,
                        setInvestId:$this.item.setInvestId
                    },
                    callback:function(data){
                        if(data.result == '1') {   
                            $this.list = data.data.list;
                        }
                    }
                });  
            }
        },
        mounted(){
            this.item = me.localStorage.getItem("investManageData");
            this.flag = me.localStorage.getItem("investManageFlag");
            this.init();
            if(this.flag.isActiveNav==0){
                me.localStorage.setItem("from", 1);
                this.getInfo();
            }else{
                me.localStorage.setItem("from", 2);
                this.getVipInfo();
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrapper{
        position:absolute;
        top:0;
        height:100%;
        width:100%;
        overflow:auto;
    }
    .list{
        margin:.3rem 0;
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
   table{
    width:100%;
    background:#fff;
    text-align:center;
    td{
        padding:.3rem;
        border-bottom:1px solid #e8e8e8;
    }
}
</style>