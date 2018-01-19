<template>
  <div class="wrapper">
    <div class="yovipbox">
      <input id="yovip3" value="3" type="radio" name="yovip" :checked="yovipactive==='3'" @change="onChangeYovip('3')">
      <label for="yovip3">新手专区</label>
      <input id="yovip1" value="1" type="radio" name="yovip" :checked="yovipactive==='1'" @change="onChangeYovip('1')">
      <label for="yovip1">优选标</label>
      <input id="yovip4" value="4" type="radio" name="yovip" :checked="yovipactive==='4'" @change="onChangeYovip('4')">
      <label for="yovip4">优+系列</label>
      <template v-if="userId&&isVip==='1'">
        <input id="yovip2" value="2" type="radio" name="yovip" :checked="yovipactive==='2'" @change="onChangeYovip('2')">
        <label for="yovip2">VIP专享</label>
      </template>
    </div>
    <masker v-show="showS" color="000" :opacity="0.3" :fullscreen="true" @click.native="showS=false"></masker>
    <div class="selector">
      <flexbox class="selector">
        <flexbox-item v-for="item,index in config" :key="index" :class="{ active:index==indexs&&showS}" @click.native="showModel(index)">{{item.data[item.cur].text||item.data[item.cur].value}} <x-icon type="ios-arrow-down" size="12"></x-icon></flexbox-item>
        <transition>
          <div class="selectorArea" v-if="showS">
            <group class="segroup">
              <radio v-if="showS" :selected-label-style="{color: '#ff9900'}" :options="config[indexs].data" :value="config[indexs].cur" @on-change="changeSelector"></radio>
            </group>
          </div>
        </transition>
      </flexbox>
    </div>
    <div class="listarea">
      <invest-cards :yovipactive="yovipactive" :rowsData="rowsData" :getPageData="getPageData" :page="page" :total="total" :offset="offset"></invest-cards>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InvestCards from '@/components/invest-cards.vue'
import { Flexbox, FlexboxItem, Masker, Group, Radio } from 'vux'
export default {
  data () {
    return {
      yovipactive: '1',
      yovipConfig: {},
      indexs: 0,
      showS: false,
      config: [
          {
              cur:0,
              data:[{
                  value:'全部产品',
                  key: '0',
                  code: '0'
              }]
          },{
              cur:0,
              data:[{
                  value: '不限',
                  text:'利率',
                  key: '0',
                  code: '0'
              },{
                  value: '5%以上',
                  key: '1',
                  code: '1'
              },{
                  value: '10%以上',
                  key: '2',
                  code: '2'
              }]
          },{
              cur:0,
              data:[{
                  value: '不限',
                  text:'期限',
                  key: '0',
                  code: '0'
              }, {
                  value: '短期',
                  key: '1',
                  code: '1'
              }, {
                  value: '3-6个月',
                  key: '2',
                  code: '2'
              }, {
                  value: '7-9个月',
                  key: '3',
                  code: '3'
              }, {
                value: '10-12个月',
                key: '4',
                code: '4'
              }, {
                value: '13个月以上',
                key: '5',
                code: '5'
              }]
          },{
              cur:0,
              data:[{
                 value: '不限',
                 text:'还款方式',
                  key: '0',
                  code: '0'
              }, {
                  value: '等额本息',
                  key: '1',
                  code: '1'
              }, {
                  value: '先息后本',
                  key: '2',
                  code: '2'
              }, {
                  value: '到期本息',
                  key: '3',
                  code: '3'
              }]
          }  
      ],
      rowsData: [],
      page: 0,
      total: 0,
      offset: 0,
    }
  },
  components: {
    Flexbox,
    FlexboxItem,
    Masker,
    Group,
    Radio,
    InvestCards,
  },
  computed: {
    ...mapGetters(['userId', 'isVip']),
  },
  methods: {
    activated () {
      this.$store.dispatch('setPageHead', {
        show: true,
        title: '投资',
        headFlag: false
      })
    },
    initData () {
      this.page = 0
      this.total = 0
      this.offset =0
      this.getPageData()
    },
    getCondition (type, callback) {
      this.$config.getData({
        key: 'findConditionList',
        method: 'post',
        data: {
          type: type
        },
        callback: (data) => {
          if (data.result === 1) {
            if (data.data.result === '1') {
              callback.call(null, data)
            }
          }
        }
      })
    },
    setCondition () {
      this.getCondition(0, (data) => {
        this.yovipConfig['1'] = this.reWriteKey(data.data.list)
        this.config[0].data = this.reWriteKey(data.data.list)
      })
      //优+
      this.getCondition(3, (data) => {
        this.yovipConfig['4'] = this.reWriteKey(data.data.list)
        // this.config[0].data = this.reWriteKey(data.data.list)
      })
      //新手
      this.getCondition(4, (data) => {
        this.yovipConfig['3'] = this.reWriteKey(data.data.list)
        // this.config[0].data = this.reWriteKey(data.data.list)
      })
      if (this.isVip === '1') {
        this.getCondition(1, (data) => {
          this.yovipConfig['2'] = this.reWriteKey(data.data.list)
        })
      }
    },
    reWriteKey (array) {
      let result = []
      for (let i = 0; i < array.length; i++) {
        let tmp = array[i]
        tmp.value = array[i].name
        tmp.key = i
        result.push(tmp)
      }
      return result
    },
    onChangeYovip (val) {
      this.yovipactive = val
      this.config[0].cur = 0
      this.config[0].data = this.yovipConfig[val]
      this.page = 0
      this.getPageData()
    },
    showModel (i) {
      this.indexs = i
      this.$nextTick(() => {
        this.showS = true
      })
    },
    changeSelector (val, label) {
      this.config[this.indexs].cur = val
      this.page = 0
      this.total = 0
      this.offset = 0
      this.showS = false
      this.getPageData()
    },
    getPageData (t) {
      if (t === 'refresh') {
        this.page = 0
      }
      if (this.page === 0) {
        this.$vux.loading.show()
      }
      this.page = this.page + 1
      this.$config.getData({
        key: 'findBorrowListPag',
        method: 'post',
        data: {
          // order: this.yovipactive === '1' ? 'invert_percent' : '',
          borrowType: this.yovipactive === '3' ? '2' : this.yovipactive,
          bType: this.config[0].data[this.config[0].cur].code,
          rate: this.config[1].data[this.config[1].cur].code,
          loanPeriod: this.config[2].data[this.config[2].cur].code,
          backway: this.config[3].data[this.config[3].cur].code,
          pageNo: this.page,
          pageSize: 10,
          userId: this.userId,
          isVip: this.yovipactive === '3' ? 2 : (this.userId === '' ? 0 : (this.isVip === '0' ? 1 : 2)),
        },
        callback: (data) => {
          this.$vux.loading.hide()
          if (data.result === 1) {
            if ((this.yovipactive === '1' && data.data.reslut === 1) 
            || (this.yovipactive === '2' && data.data.result === 1)
            || (this.yovipactive === '3' && data.data.result === 1)
            || (this.yovipactive === '4' && data.data.reslut === 1)) {
              if (this.page === 1) {
                this.rowsData = data.data.list || []
                this.total = data.data.totalCount
              } else {
                this.rowsData = this.rowsData.concat(data.data.list || [])
              }
              this.offset  += data.data.list.length
            }
          }
        }
      })
    }
  },
  created () {
    this.initData()
    this.setCondition()
  },
  activated () {
    this.activated()
    if (this.$route.query.from === 'index') {
      this.yovipactive = '1'
      this.initData()
      this.setCondition()
    }
  }
}
</script>
<style lang="less">
  .segroup{
    .vux-no-group-title{
      margin-top: 0;
    }
    label{
      font-size: .52rem;
    }
    .weui-cells_radio .weui-check:checked + .weui-icon-checked{
      &:before{
        color: #fe6f07;
      }
    }
  }
</style>
<style lang="less" scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  position: absolute;
  top:0;
  bottom:0;
  width: 100%;
  .yovipbox{
    height: 1.6rem;
    background-color: #fff;
    text-align: center;
    h2{
      line-height: 1.6rem;
      font-size: .62rem;
      color: #757575;
      font-weight: normal;
    }
    input{
      display: none;
    }
    label{
      display: inline-block;
      margin-top: .2rem;
      line-height: 1rem;
      width: 3rem;
      color: #999;
      font-size: .52rem;
      border: 1px solid;
    }
    input:checked + label{
      color: #fe6f07;
    }
  }
  .selector{
    height: 1.6rem;
    background-color: #eee;
    text-align: center;
    position: relative;
    z-index: 10002;
    .active{
      color: #fe6f07;
      .vux-x-icon{
        fill: #fe6f07;
      }
    }
    .vux-x-icon{
      fill: #999;
      display: inline-block;
      vertical-align: middle;
    }
    .selectorArea{
      position: absolute;
      z-index: 1;
      top: 1.6rem;
      left: 0;
      width: 100%;
      max-height: 10rem;
      overflow: auto;
      background-color: #fff;
      text-align: left;
    }
  }
  .listarea{
    position: relative;
    flex:1;
  }
}
</style>