<template>
    <div class="limit">
        <ul>
            <li v-for="(item,index) in bankData" :key="index">
                <!--<h2><img :src="'/static/images/bankLogo/'+item.code+'.png'"/>{{item.bankName}}</h2>-->
                <h2><img :src="item.pictureUrl"/>{{item.bankName}}</h2>
                <p>{{item.description}}</p>
            </li>
        </ul>
        <div class="tip">
            充值限额可参考上表，具体的额度以发卡银行为准。如果您在发卡银行设置的支付额度低于此表限额，以您的设置为准。
        </div>
    </div>
</template>

<script>
    export default {
        name:'limit',
        data(){
            return {
                bankData:[]
            }   
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '限额说明',
                    headFlag: true
                })
            },
            getBankList(){
                var $this = this;
                $this.$config.getData({
                    key:'findJindunBankList',
                    method:'post',
                    data:{
                        userId : me.cookie.getItem("userId") || "" 
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            var data = data.data;
                            if(data.result == "1"){
                                $this.bankData = data.bankList;
                            }
                        }
                    }
                });
            }
        },
        mounted(){
            this.init();
            this.getBankList();
        },
         //  created(){
        //     this.bankData.map(function(item,index){
        //         item.src = require("../assets/images/bankLogo/"+item.code+".png");
        //     })
        //  }
    }
</script>

<style lang="less" scoped>
    .limit{
        li{
            background:#fff;
            border-bottom:1px solid #e5e5e5;
            padding:.4rem;
            h2{
                font-size:.6rem;
                 img{
                     width:1.4rem;
                     height:1.4rem;
                     margin-right:.4rem;
                 }
            }
            p{color:#999;}
        }
        .tip{
            font-size:.52rem;
            color:#999;
            padding:.45rem;
        }
    }
</style>