<template>
    <div class="record">
        <p class="title" v-if="useType==1 && myList.length">
            <i class="me-ion-o-checkmark"></i>成功充值
            <b class="s-org">&yen;{{sumAmountCg | my-filter}}元</b>
        </p>
        <p class="title" v-else-if="useType==2 && myLists.length">
            <i class="me-ion-o-checkmark"></i>成功充值
            <b class="s-org">&yen;{{sumAmount | my-filter}}元</b>
        </p>
         <p class="title" v-else>
            <i class="me-ion-o-checkmark"></i>成功充值
            <b class="s-org">&yen;0.00元</b>
        </p>
        <ul v-if="useType==1">
            <li v-for="(item,index) in myList">
                <p class="clearfix"><span class="fl">{{item.assetTypeDes}}</span><span class="s-org fr">&yen;{{item.amount | my-filter}}元</span></p>
                <p class="clearfix">
                    <span class="fl">{{item.createTime | atatime}}</span>
                    <span class="fr" v-if="item.status==0">失败</span>
                    <span class="fr" v-else-if="item.status==1">成功</span>
                </p>
            </li>
        </ul>
        <ul v-else>
            <li v-for="(item,index) in myLists">
                <p class="clearfix"><span class="fl">{{item.rechargeWay}}</span><span class="s-org fr">&yen;{{item.rechargeAmount | my-filter}}元</span></p>
                <p class="clearfix">
                    <span class="fl">{{item.createTime}}</span>
                    <span class="fr" v-if="item.status==0">申请中</span>
                    <span class="fr" v-else-if="item.status>=1 && item.status<=7">审核中</span>
                    <span class="fr" v-else-if="item.status==8">审核未过</span>
                    <span class="fr" v-else-if="item.status==9">完成</span>
                </p>
            </li>
        </ul>
        <div class="my-button" @click="goTo('invest')">继续投资</div>
    </div>
</template>

<script>
import datetime from '@/lib/dateTimeFormatter'
export default {
   filters:{
        atatime (v) {
            return datetime(Number(v))
        } 
   },
   props: ['useType','sumAmount','sumAmountCg','myList','myLists'],
   methods:{
        goTo(url){
            this.$router.push({name: url})
        }
   }
}
</script>
<style lang="less"  scoped>
 .record{
      padding-bottom:2rem;
     .title{
         height:2rem;
         line-height:1.8rem;
         font-size:.6rem;
         text-align:center;
         i{
             color:#7bd52b;
             font-size:.75rem;
             margin-right:.2rem;
         }
         b{
            margin-left:.2rem;
         }
     }
     ul li{
         background:#fff;
         padding:.2rem .5rem;
         margin-bottom:.3rem;
     }
     button{
         position:fixed;
         bottom:0;
         margin:0;
         border-radius:0;
     }
   }
</style>

