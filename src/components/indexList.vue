<template>
    <div class="list">
        <ul>
            <li v-for="(value,key) in prList" v-if="JSON.stringify(value) !== '{}'">
                <router-link :to="{name: 'investdetail', params: {borrowType: getBorrowType(value), borrowId: value.borrowId, depositoryId: value.depositoryId||'0'}}">
                    <p class="title">{{value.highTitle}}</p>
                    <div data-wrap="layout">
                        <div data-item="col-5">
                            <span class="rate"><b>{{value.annualRate | rateVal}}</b>%</span>
                            <p>协议年化利率</p>
                        </div>
                        <div data-item="col-7">
                            <p class="periods">投资期限<b>{{value.loanPeriod}}</b>
                                <i v-if="value.loanPeriodtype==0">个月</i>
                                <i v-else-if="value.loanPeriodtype==1">日</i>
                            </p>
                            <p class="money">可投金额<b>{{value.remainingCapital}}</b><i>元</i></p>
                        </div>
                    </div>
                    <button class="me-u-btn" data-size=block data-color="grey" v-if="value.status=='6'">已满标</button>
                    <button class="me-u-btn" data-size=block data-color="grey" v-else-if="value.status=='7'">还款中</button>
                    <button class="me-u-btn" data-size=block data-color="grey" v-else-if="value.status=='9'">已完成</button>
                    <button class="me-u-btn" data-size=block data-color="orange" v-else>立即抢投</button> 
                </router-link>                          
            </li>
        </ul>
    </div>
</template>

<script>
export default {
   props: ["prList"],
   filters:{
       rateVal(value){
          var rateVal = value * 100;  
          return me.validate.money(rateVal+'',{decimal: true});
       }    
   },
   methods: {
    getBorrowType (value) {
        let borrowType = ''
        if (value == this.prList.borrow){
            borrowType = '1'
        }else if (value == this.prList.vipBorrow){
            borrowType = '2'
        }else if (value == this.prList.newBorrow){
            borrowType = '3'
         }else if (value == this.prList.youPlusBorrow){
            borrowType = '4'
        }
        return borrowType
    }
   }
}
</script>
<style lang="less"  scoped>
   .list{
       color:#666;
    li{
         background:#fff;
         margin:.4rem 0;
         padding:.7rem;
         font-size:.52rem;
        a{
            color:#666;
            .title{
                font-size:.6rem;
                color:#333;
                margin-bottom:.2rem;
            }
            .rate{
                font-size:.6rem;
                color:#fe6f06;
                b{
                    font-size:1.2rem;         
                }
            }
            .periods{
                margin-top:.5rem;
            }
            .money{
                margin-top:.12rem;
            }
            .periods b,.money b{
                margin-left:.3rem;
                color:#333;
                font-size:.68rem;
            }
         }
         button{
             margin-top:.7rem;
             font-size:.76rem;
             padding:0;
             height:1.56rem;
             line-height:1.56rem;
             overflow:hidden;
             border-radius:3px;
         }
     }
   }
</style>

