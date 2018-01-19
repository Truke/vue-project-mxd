<template>
    <div>
        <template v-if="isActiveNav==0">
            <p class="my-page s-t-center" v-if="totalRow>0">共有<b class="s-org">{{totalRow}}</b>个记录</p>
            <div class="width-95" v-if="totalRow>0">
                <div class="list" v-for="(item,index) in addList" :key="index">
                    <p class="title">{{item.borrowTitle}}</p>
                    <div data-wrap="layout">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.investAmount | my-filter}}</li>
                            <li><span>协议年化利率:</span>{{item.annualRate | rateVal}}%</li>
                            <li><span>总期数:</span>{{item.loanPeriod}}
                                <i v-if="item.loanPeriodType=='0'">个月</i>
                                <i v-if="item.loanPeriodType=='1'">日</i>
                            </li>
                            <li><span>利息:</span><b class="s-org">计算中</b></li>
                        </ul>
                        <div data-item="col-3">      
                            <x-circle :percent="item.investPercentInt" :stroke-width="5" :trail-width="5" :stroke-color="strokeColor" trail-color="#dcdcdc">
                                <span :style="{color: strokeColor}">{{item.investPercentInt}}%</span>
                            </x-circle>
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
                <div class="list" v-for="(item,index) in addList" :key="index">
                    <p class="title">{{item.borrowSetName}}</p>
                    <div data-wrap="layout">
                        <ul data-item="col-9">
                            <li><span>总投资金额:</span>&yen;{{item.amount | my-filter}}</li>
                            <li><span>协议年化利率:</span>{{item.borrowSetAnnualRate | rateVal}}%</li>
                            <li><span>总期数:</span>{{item.borrowSetLoanPeriod | newVal}}个月</li>
                            <li><span>利息:</span><b class="s-org">计算中</b></li>
                        </ul>
                        <div data-item="col-3">      
                            <x-circle :percent="item.investPercentInt" :stroke-width="5" :trail-width="5" :stroke-color="strokeColor" trail-color="#dcdcdc">
                                <span :style="{color: strokeColor}">{{item.investPercentInt}}%</span>
                            </x-circle>
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
    import { XCircle, Range, Icon } from 'vux'
    export default {
        props: ['addList','totalRow','isActiveNav','strokeColor'],
        filters:{
            rateVal(value){
                var rateVal = value * 100;  
                return me.validate.money(rateVal+'',{decimal: true});
            },     
            newVal(value){
                return value || "0"
            }    
        },
        components: {
            XCircle,
            Range,
            Icon
        },
         methods:{
            goTo(url){
                this.$emit("goTo",url);
            }
        }
    }
</script>

<style lang="less" scoped>
.width-95{
    width:95%;
    margin:0 auto;
}
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
    }
}
button[data-size=block]{
    position:fixed;
    bottom:0;
    border-radius:0;
}
</style>