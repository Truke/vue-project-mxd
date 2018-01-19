<template>
    <div class="alipayExplain">
        <p class="width-90">
            您可以使用您的银行卡，通过支付宝转账的方式将资金充值到您的江西银行存管账户，账户信息如下： 
        </p>
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td class="s-t-right">收款人姓名</td>
                <td class="s-t-left s-org">{{bankData.realName}}</td>
            </tr>
             <tr>
                <td class="s-t-right">收款人卡号</td>
                <td class="s-t-left clearfix">
                    <input class="s-org fl" id="inputText" readonly="readonly" v-model="bankData.cardNbr">
                    <button class="me-u-btn fr" data-color=orange  @click="copy()">复制</button>
                </td>
            </tr>
             <tr>
                <td class="s-t-right">收款人开户行</td>
                <td class="s-t-left s-org">江西银行</td>
            </tr>
        </table>
        <div class="width-90">
            <p class="my-con">
                温馨提示：<br/>
                支付宝转账完毕，请务必在民信贷账户首页中手动刷新余额；支付宝PC有服务费，推荐支付宝APP，限额内免服务费。<br/>
            </p>
            <div class="bg1"></div> 
            <div class="bg2"></div>
            <div class="bg3"></div>   
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name:'alipayExplain',
        data(){
            return { 
                bankData:{}
            }
        },
        methods:{
            ...mapActions(['findAccountCartMsgAPI']),
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '支付宝转账说明',
                    headFlag: true
                });
            },
            copy(){
                var inputText = document.getElementById('inputText');
                var currentFocus = document.activeElement;
                inputText.focus();
                inputText.setSelectionRange(0, inputText.value.length);
                document.execCommand('copy', true);
                currentFocus.focus();
                me.errorTips({'text':'复制成功',from:'25%',to:'25%'}); 
            },
            getBankInfo(){
                var $this = this;
                this.findAccountCartMsgAPI().then((data) => {
                    if(data.result == '1'){
                        var data = data.data;
                        if(data.result == "1"){
                            $this.bankData = data;
                            var v = $this.bankData.cardNbr;
                            $this.bankData.cardNbr= v.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");  
                        }
                    }
                });
            },
        },
        mounted(){
            me.require(['errTips']);
            this.init();
            this.getBankInfo();
        }
    }
</script>

<style lang="less" scoped>
    .alipayExplain{
        background:#fff;
        padding:.5rem 0 1rem 0;
        table{
            width:100%;
            background:#f2f2f2;
            margin:.5rem 0;
            td{
                padding:.3rem;
                border:1px solid #fff;
                border-left:none;
                border-bottom:none;
                .me-u-btn{
                    padding:0;
                    font-size:.48rem;
                    width:1.5rem;
                    height:1rem;
                    margin-right:.2rem;
                }
                input{background:#f2f2f2;margin-top:.3rem; width:70%;}
            }
            td.s-t-right{
                width:25%;
            }
        }
        img{width:100%;height:100%;}
        .bg1{ 
            height:14.5rem;
            background:url(../assets/images/recharge/z_img1.jpg) no-repeat;
            background-size:100%;
        }
        .bg2{ 
            height:12.5rem;
            background:url(../assets/images/recharge/z_img2.jpg) no-repeat;
            background-size:100%;
        }
        .bg3{ 
            height:16rem;
            background:url(../assets/images/recharge/z_img3.jpg) no-repeat;
            background-size:100%;
        }
        .my-con{margin-bottom:1rem;}
    } 
</style>