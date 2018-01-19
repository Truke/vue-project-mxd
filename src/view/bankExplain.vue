<template>
    <div class="bankExplain">
        <p class="width-90">
            您的江西银行存管账户信息： 
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
                <td class="s-t-left s-org">江西银行股份有限公司总行营业部</td>
            </tr>
        </table>
        <div class="width-90">
            <p class="my-con">
                温馨提示：<br/>
                线下转账完毕，请务必在民信贷账户首页中手动刷新余额。
            </p>
           <div class="bg"></div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name:'bankExplain',
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
                    title: '银行转账说明',
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
            }
        },
        mounted(){
            me.require(['errTips']);
            this.init();
            this.getBankInfo();
        }
    }
</script>

<style lang="less" scoped>
    .bankExplain{
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
                input{background:#f2f2f2; margin-top:.3rem; width:70%;}
            }
            td.s-t-right{
                width:25%;
            }
        }
        .bg{
            height:15rem;
            background:url(../assets/images/recharge/z_img4.jpg) no-repeat;
            background-size:100%;
         }
        .my-con{margin-bottom:1rem;}
    } 
</style>