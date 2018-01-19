<template>
    <div>
        <div class="bank-logo" v-if="myData.useType==1">
            <img src="../assets/images/z_logo.png" alt=""/>
            <img src="../assets/images/z_jx.png" alt=""/>
        </div>
        <div class="u-input">
            <div class="width-90" data-wrap="layout">
                <i data-item="col-2">充值金额</i>
                <input type="tel" v-model.trim="myData.money" placeholder="输入充值金额" data-item="col-7"
                @keyup="hideError"  @focus="hideError" @blur="hideIcon"/>
                <span data-item="col-2" v-if="myData.useType==1" @click="goTo('limitForm')">限额说明</span>
                <span class="me-ion-close-circled" v-show="myData.moneyIcon" @click="del"></span>
            </div>
        </div>
        <div class="tip" v-if="myData.useType==1">
            <p class="width-90">充值限额:单笔{{myData.bankLimit.singleLimit | myMoney}}元,单日{{myData.bankLimit.dayLimit | myMoney}}元</p>
        </div>
        <div class="old-tip" v-else>
            <p class="width-90">您当前可用余额:&nbsp;&nbsp;<b>{{myData.availableAmount | my-filter}}元</b></p>
        </div>
        <div class="width-90">
            <p class="u-error">
                <span v-show="myData.moneyMsg">{{myData.moneyMsg}}</span>
            </p>         
            <button class="me-u-btn" data-size=block  data-color="orange" @click="recharge" v-if="myData.useType==1">立即充值</button>
            <button class="me-u-btn" data-size=block  data-color="orange" @click="oldRecharge" v-else>立即充值</button>
        </div>
        <div v-if="myData.useType==1">
            <div class="prompt">
                <p class="width-90">其他充值方式操作说明：</p>
                <div class="grey">
                    <div data-wrap="layout">
                        <p data-item="col-6" @click="goTo('alipayExplain')">
                            <img src="../assets/images/recharge/z_zicon.png" alt=""/>
                            支付宝转账
                            <span class="fr"></span>
                        </p>
                        <p data-item="col-5" @click="goTo('bankExplain')">
                            <img src="../assets/images/recharge/z_yicon.png" alt=""/>
                            银行转账
                        </p>
                    </div>
                </div>
                <div class="width-90">
                    温馨提示：<br/>
                    1.充值成功后,请在账户中心首页查看存管查用余额；<br/>
                    2.充值仅支持借记卡，不支持存折、信用卡充值；<br/>
                    3.平台充值无手续费，其余充值方式相关费用由第三方平台收取；<br/>
                    4.请注意您的银行卡充值限制，以免造成不便；<br/>
                    5.如果充值金额没有及时到账，请与客服<span>400-686-2877</span>联系。(线下充值客户请务必通知客服)<br/>
                    6.民信贷禁止信用卡套现,虚假交易等行为，一经发现将予以处罚；包括但不限于：限制收款,冻结账户,永久停止服务等。
                </div>
            </div>
        </div>
        <div class="prompt width-90" v-else>                  
            温馨提示：<br/>
            1.所有投标保证金将由第三方平台托管；<br/>
            2.线上,线下充值手续费全免，充值金额由第三方平台收取；<br/>
            3.请注意您的银行卡充值限制，以免造成不便；<br/>
            4.如果充值金额没有及时到账，请与客服联系(线下充值客户请务必通知客服)；<br/>
            5.民信贷禁止信用卡套现,虚假交易等行为，一经发现将予以处罚；包括但不限于：限制收款,冻结账户,永久停止服务等。
        </div>  
    </div>
</template>

<script>
export default {
   filters:{
        myMoney (v) {
            return v || "0.00"
        } 
   },
   props: ['myData','myDatas'],
   methods:{
        goTo(url){
             this.$router.push({name: url});
        },
        hideError(){
            this.$emit("hideError");
        },
        hideIcon(){
            this.$emit("hideIcon");
        },
        del(){
            this.$emit("del");
        },
        recharge(){
            this.$emit("recharge");
        },
        oldRecharge(){
            this.$emit("oldRecharge");
        }
   }
}
</script>
<style lang="less"  scoped>
  .me-u-btn[data-size=block]{
      padding:9px 22px;
  }
 .u-input{
     height:1.8rem;
     line-height:1.8rem;
     background:#fff;
     position:relative;
     i{
         font-size:.52rem;
     }
     input{
         height:100%;
         margin:.6rem 0 0 .5rem;
     }
     span{
         color:#ff6000;
     }
     .me-ion-close-circled{
        position: absolute;
        top: 0rem;
        right: .8rem;
        color: #8d8d92;
        font-size: .7rem;
     }
  }
  .u-error{
      margin-top:.5rem;
  }
  .tip{
      background:#f8f8f8;
      height:1.5rem;
      line-height:1.5rem;
      overflow:hidden;
      position:relative;
      span{
          position:absolute;
          top:-.5rem;
          left:20%;
          width:15px;
          height:7px;
      }
  }
  .old-tip{
      height:1.5rem;
      line-height:1.5rem;
      color:#666;
      b{
          color:#000;
          font-weight:bold;
      }
  }
  .me-u-btn{
      margin:.5rem 0;
  }
  .grey{
      background:#f5f5f5;
  }
  .prompt{
      color:#666;
      padding-bottom:1rem;
      span{
          color:#067dd9;
      }
      [data-wrap="layout"]{
          width:90% !important;
          margin:.5rem auto !important;
          height:1.8rem;
          line-height:1.8rem;
          font-size:.52rem;
          color:#333;
          margin:.4rem 0 .7rem 0;
          img{width:1.18rem;height:1.18rem;margin-right:.5rem;}
          span{
              height:100%;
              color:#e5e5e5;
              border-left:1px solid #e5e5e5;
              width:1px;
              height:1rem;
              margin-top:.35rem;
          }
          [data-item="col-5"]{
              text-align:right;
          }
      }
  }
</style>

