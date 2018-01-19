<template>
  <div class="more_detail_page">
    <x-header class="idheader" style="background-color: #fe6f07" :left-options="leftOptions" title="可使用的券" @on-click-back="onClickBack">
      <a v-if="usetotalCount>0" slot="right" @click="onSelected">确定</a>
    </x-header>
    <div class="wrapper">
      <group>
        <cell :title="'不可使用的券（'+nousetotalCount+'）'" :is-link="true" :link="{name: 'couponNotCanuse'}"></cell>
      </group>
      <h2>当前投资金额：{{money}}元</h2>
      <div class="weui-cells_checkbox" style="background-color: transparent;">
        <label class="weui-cell weui-check__label" :for="'s'+index" v-for="item,index in uselist" :key="index">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check" name="canusequan" :id="'s'+index" :checked="selectTicket&&item.id===selectTicket.id?'checked':''"  @change="onChange(item,index,$event)">
            <i class="weui-icon-checked"></i>
          </div>
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
      lastest: null,
    }
  },
  computed: {
    ...mapGetters(['userId', 'selectTicket', 'borrowId', 'borrowType', 'depositoryId']),
    leftOptions () {
      return {
        showBack: !0,
        backText: '',
        preventGoBack: true,
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
    onChange (item, index, event) {
      let e = event || window.event
      let dom = e.target || e.srcElement
      this.activeTicket = dom.checked ? item : null
      this.lastest = item
      let checkList = document.querySelectorAll('input[type=checkbox]')
      Array.prototype.slice.call(checkList).map((it,i) => {
        it.checked = i === index ? it.checked : false
      })
    },
    onSelected () {
      this.setSelected()
    },
    setSelected (item) {
      this.borrowinfo({
        selectTicket: item || this.activeTicket
      }).then(() => {
        this.$router.replace({name: 'buy', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
      })
    },
    onClickBack () {
      if (this.usetotalCount > 0 && this.lastest !== null && this.activeTicket !== this.selectTicket) {
        this.$vux.confirm.show({
          title: '',
          content: '您已' + (this.lastest === this.activeTicket ? '选中' : '取消') + (this.lastest.type === 1 ? (this.lastest.amount + '元现金券') : (BigDecimal.accMul(this.lastest.amount ,100) + '%加息券')) + '，是否使用？',
          onCancel: () => {
            this.$router.replace({name: 'buy', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
          },
          onConfirm: () => {
            this.setSelected(this.lastest)
          }
        })
      } else {
        this.$router.replace({name: 'buy', params: {borrowType: this.borrowType, borrowId: this.borrowId, depositoryId: this.depositoryId}})
      }
    },
  },
  created () {
    this.findAllCanUseCouponTicket()
  },
  mounted () {
    this.activeTicket = this.selectTicket
  }
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
  padding-top: .3rem;
}
.weui-check__label{
  padding: .2rem .4rem .2rem 0;
  &:before {
    border:none;
  }
}
label > * { pointer-events: none; }
.weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before{
  color: #fe6f07;
}
.couponCell {
  overflow: hidden;
  position: relative;
  display: table;
  width: 100%;
  font-size: 0;
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
    color: #fe6f07;
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
    p:last-child{
      color: #fe6f07;
    }
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
</style>
