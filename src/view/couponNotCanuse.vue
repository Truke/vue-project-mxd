<template>
  <div class="more_detail_page">
    <x-header class="idheader" style="background-color: #fe6f07" :left-options="leftOptions" title="不可使用的券">
    </x-header>
    <div class="wrapper">
      <h2>当前投资金额：{{money}}元</h2>
      <div class="weui-cells_checkbox" style="background-color: transparent;">
        <label class="weui-cell weui-check__label" :for="'s'+index" v-for="item,index in nouselist" :key="index" @click="clickIndex=index" :style="{'padding-bottom':clickIndex==index?'1.2rem':'0.2rem'}">
          <div class="weui-cell__bd">
            <div class="couponCell">
              <div class="coupondt">
                <template v-if="item.type===1">
                  <p><small>￥</small><big>{{item.amount}}</big></p>
                  <p>现金券</p>
                </template>
                <template v-if="item.type===2">
                  <p><big>{{item.amount | rate}}</big><small> %</small></p>
                  <p>加息券</p>
                </template>
              </div>
              <div class="cline"></div>
              <div class="coupondd">
                <p>投资{{item.investAmountString}}可用</p>
                <p>使用范围：{{item.useRange}}</p>
                <p>投资期限：{{item.borrowPeriodSuffix}}</p>
                <p>有效期至：{{item.endTime | data}}</p>
              </div>
              
            </div>
            <div class="cError" :class="{'active':clickIndex===index}">
              <i class="me-ion-o-lightbulb-outline"></i>
               {{item.useMsg}}
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { XHeader, Group, Cell } from 'vux'
import BigDecimal from '@/lib/bigDecimal'
import datetime from '@/lib/dateTimeFormatter'
export default {
  data () {
    return {
      money: this.$route.params.money,
      nouselist: [],
      nousetotalCount: '',
      uselist: [],
      usetotalCount: '',
      activeTicket: null,
      clickIndex: null,
    }
  },
  computed: {
    ...mapGetters(['userId', 'borrowId', 'borrowType', 'depositoryId']),
    leftOptions () {
      return {
        showBack: !0,
        backText: '',
      }
    },
  },
  components: {
    XHeader,
    Group,
    Cell,
  },
  filters: {
    rate (v) {
      return BigDecimal.accMul(v || '', 100)
    },
    data (d) {
      return datetime(d, 2)
    }
  },
  methods: {
    ...mapActions(['borrowinfo']),
    findAllCanUseCouponTicket () {
      this.$config.getData({
        key: 'findAllCanUseCouponTicket',
        method: 'post',
        data: {
          userId: this.userId,
          amount: this.money || 0,
          borrowId: this.borrowId,
          isSpecialBorrow: (this.borrowType === '1' || this.borrowType === '4') ? 0 : 1
        },
        callback: (data) => {
          if (data.result === 1) {
            this.nouselist = data.data.nouselist
            this.nousetotalCount = data.data.nousetotalCount
            this.uselist = data.data.uselist
            this.usetotalCount = data.data.usetotalCount
          }
        }
      })
    },
  },
  created () {
    this.findAllCanUseCouponTicket()
  },  
}
</script>

<style lang="less" scoped>
.more_detail_page{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
  z-index: 1;
  overflow-y: auto;
}
.idheader{
  width:100%;position:absolute;top:0;transition: background-color .5s;
  z-index: 1;
}
.wrapper{
  position: absolute;
  top:1.9rem;
  width: 100%;
  bottom: 0;
  overflow: auto;
}
h2{
  font-weight: normal;
  text-align: center;
  font-size: .7rem;
  padding-top: .6rem;
}
.weui-check__label{
  padding: .2rem .4rem .2rem 0;
  transition: all .5s;
  &:before {
    border:none;
  }
}
.weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before{
  color: #fe6f07;
}
.couponCell {
  position: relative;
  font-size: 0;
  display: table;
  padding-left: .4rem;
  width: 100%;
  .coupondt,
  .cline,
  .coupondd{
    background-color: #fff;
    padding: .4rem 0;
    display:table-cell;
    vertical-align: middle; 
    p{
      font-size: 0.52rem;
    }
  }
  .coupondt{
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 5px 0 0 5px;
    width: 30%;
    color: #999;
    text-align: center;
    p{
      font-size: 0.62rem;
      small{
        font-size: .42rem;
      }
      big{
        font-size: 1rem;
        font-weight: 700;
        font-family: arial;
      }
    }
  }
  .coupondd{
    border: 1px solid #ddd;
    border-radius: 0 5px 5px 0;
    border-left: none;
    padding-left: .4rem;
    padding-right: .3rem;
    width:70%;
    line-height: .7rem;
    color: #999;
  }
  .cline{
    border-left: 1px dashed #ddd;
    position: absolute;
    height: 70%;
    top:50%;
    transform: translateY(-50%);
    &:before,
    &:after{
      content: '';
      display:block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #eee;
      border:1px solid #ddd;
      position: absolute;
      margin-left: -6px;
    }
    &:before{
      top:-30%;
    }
    &:after{
      bottom:-30%;
    }
  }
}
.cError {
  font-size: .42rem;
  color: #fe6f07;
  position: absolute;
  padding: 0 .4rem 0;
  line-height: 1rem;
  width: 90%;
  left:50%;
  margin-left: -45%;
  border: 1px solid #ddd;
  border-top: none;
  background-color: #FFF;
  z-index: -1;
  transition: transform .5s;
  transform: translateY(-200%);
  &.active{
    transform: translateY(0);
  }
  i {
    font-size: .65rem;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
