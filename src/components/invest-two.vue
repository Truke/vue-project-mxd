<template>
  <div class="page1">
    <div class="tabbox">
      <tab :line-width=2 active-color='#f74c31' :custom-bar-width="getBarWidth" v-model="tabIndex">
        <tab-item class="vux-center" @on-item-click="tabIndexType=0">基本详情</tab-item>
        <tab-item class="vux-center" v-if="borrowType==='1'||borrowType==='4'" @on-item-click="tabIndexType=1">借款人信息</tab-item>
        <tab-item class="vux-center" @on-item-click="tabIndexType=2;page=0;offset=0;total=0;">投资记录</tab-item>
      </tab>
    </div>
    <div class="tabcont" v-show="tabIndex==0">
      <iscroll-view ref='scrollView0' class="scroll-view"  @pullDown='pullTwoDown' :options="{scrollY: true}"  :scrollerClass="{'scroller': true}">
        <div class="cardlist" :style="{'min-height': winheight + 'px'}">
          <card>
            <div class="cardTit" slot="header"><i><img :src="cicon01" alt=""></i>项目介绍</div>
            <div class="cardCont" slot="content">
              <p v-html="base.introduce"></p>
            </div>
          </card>
          <card>
            <div class="cardTit" slot="header"><i><img :src="cicon02" alt=""></i>投资范围</div>
            <div class="cardCont" slot="content">
              <p v-html="base.investscope"></p>
            </div>
          </card>
          <card>
            <div class="cardTit" slot="header"><i><img :src="cicon03" alt=""></i>赎回方式</div>
            <div class="cardCont" slot="content">
              <p v-html="base.redeemtype"></p>
            </div>
          </card>
          <card v-if="base.agreementList && base.agreementList[0]">
            <div class="cardTit" slot="header"><i><img :src="cicon04" alt=""></i>服务协议</div>
            <div class="cardCont" slot="content">
              <p><a class="link" ref="showRuleHref" :data-href="base.agreementList[0].url">{{base.agreementList[0].name}}</a></p>
            </div>
          </card>
        </div>
      </iscroll-view>
    </div>
    <div class="tabcont" v-if="borrowType==='1'||borrowType==='4'"  v-show="tabIndexType==1">
      <borrow-user-info :pullDown="pullTwoDown" :tabIndex="tabIndexType" :borrowId="borrowId" :borrowType="borrowType" :depositoryId="depositoryId"></borrow-user-info>
    </div>
    <div class="tabcont" v-show="tabIndexType==2">
      <div class="detailInvestRecord">
        <div class="dirTitle">
          <span class="num">序号</span>
          <span class="ren">投资人</span>
          <span class="mt">投资金额(元)/投资时间</span>
        </div>
        <div class="dirCont">
          <detail-invest-record :rowsData="investRecordList" :getPageData="getPageData" :total="total" :offset="offset" :pullDown="pullTwoDown" :tabIndex="tabIndexType"></detail-invest-record>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Card, XDialog, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
import BorrowUserInfo from '@/components/borrow-user-info'
import DetailInvestRecord from '@/components/detailInvestRecord'
export default {
  props: ['info', 'pullDown', 'cur'],
  data () {
    return {
      winheight: window.innerHeight - 100,
      tabconfig: (this.$route.params.borrowType==='1' || this.$route.params.borrowType==='4') ? [{
        text: '基本详情'
      }, {
        text: '借款人信息'
      }, {
        text: '投资记录'
      }] : [{
        text: '基本详情'
      }, {
        text: '投资记录'
      }],
      base: {},
      ruleContent: '',
      getBarWidth: (index) => {
        if (this.tabconfig[index]) {
          return this.tabconfig[index].text.length * .6 + 'rem'
        }
      },
      tabIndex: 0,
      tabIndexType: 0,
      cicon01: require('../assets/images/c-icon_01.png'),
      cicon02: require('../assets/images/c-icon_02.png'),
      cicon03: require('../assets/images/c-icon_03.png'),
      cicon04: require('../assets/images/c-icon_04.png'),
      attachs: [],
      investRecordList: [],
      total: 0,
      page: 0,
      offset: 0,
    }
  },
  directives: {
    TransferDom
  },
  computed: {
    ...mapGetters(['borrowId', 'borrowType', 'depositoryId']),
    computedDatas () {
      let d = {}
      d[(this.borrowType === '1' || this.borrowType === '4') ? 'borrowId' : 'borrowSetId'] = this.borrowId
      return d
    },
  },
  components: {
    Tab, 
    TabItem, 
    Card,
    BorrowUserInfo,
    DetailInvestRecord,
    XDialog,
  },
  methods: {
    getBasicDetail () {
      this.$config.getData({
        key: 'getBasicDetailState',
        method: 'post',
        data: {
          borrowType: this.borrowType,
          borrowId: this.borrowId
        },
        callback: (data) => {
          if (data.result === 1) {
            this.base = data.data
            this.$nextTick(() => {
              if (this.$refs.showRuleHref) {
                this.$refs.showRuleHref.addEventListener('touchstart', (e) => {
                  let href = e.target.dataset.href
                  if (/^http?/g.test(href)) {
                    window.location = href
                  } else {
                    window.location = 'http://' + href
                  }
                })
              }
            })
          }
        }
      })
    },
    pullTwoDown (iscroll) {
      if (iscroll.distY > 100) {
        this.pullDown()
      }
    },
    getPageData () {
      this.page = this.page + 1
      this.$config.getData({
        key: (this.borrowType === '1' || this.borrowType === '4') ? 'findBorrowInvestVoList' : 'getSetInvestList',
        method: 'post',
        data: Object.assign(this.computedDatas, {
          pageNo: this.page,
          pageSize: 10
        }),
        callback: (data) => {
          if (data.result === 1) {
            if (this.page === 1) {
              this.investRecordList = data.data.list || []
              this.total = data.data.totalCount
            } else {
              this.investRecordList = this.investRecordList.concat(data.data.list || [])
            }
            this.offset  += data.data.list.length
          }
        }
      })
    },
  },
  watch: {
    cur (val) {
      if (val === 1) {
        this.$nextTick(() => {
          this.$refs.scrollView0.refresh()
        })
      }
    },
    tabIndex (val) {
      if (val === 0) {
        this.$refs['scrollView' + val].refresh()
      }
    }
  },
  mounted () {
    this.getBasicDetail()
    // this.getPageData()
  }
}
</script>
<style lang="less" scoped>
.scroll-view{
  width:100%;
  touch-action:none;
  position: absolute;
  left:0;
  top:0;
  right: 0;
  bottom:0;
  overflow:hidden;
}
</style>
<style lang="less">
.page1{
  display: flex;
  flex-direction: column;
  position: absolute;
  top:0;
  bottom:0;
  width: 100%;
  .tabbox{
    background-color: #fff;
    .vux-tab .vux-tab-item{
      background: none;
      font-size: .6rem;
    }
  }
  .tabcont{
    position: absolute;
    top:44px;
    bottom:0;
    left:0;
    right:0;
    overflow: auto;
    .cardlist{
      padding-bottom: .5rem;
      .weui-panel{
        background-color: transparent;
        &:before,
        &:after{
          border:none;
        }
        &:first-child{
          margin-top: .4rem;
        }
        &:last-child{
          margin-bottom: .4rem;
        }
      }
    }
    .cardTit{
      line-height: 1.6rem;
      padding: 0 .5rem;
      font-size: 0.56rem;
      color: #333;
      background-color: #fff;
      i{
        display: inline-block;
        vertical-align: middle;
        width: .6rem;
        margin-right: 0.3rem;
        img {
          width: 100%;
          display: block;
        }
      }
    }
    .cardCont{
      padding: .5rem .5rem 0;
      font-size: 0.52rem;
      line-height: 1.2rem;
      color: #666;
      .link{
        color: #3184f5;
      }
      table{
        width: 100%;
        td{
          label{
            color: #999;
            display: block;
          }
          p{
            color: #333;
          }
        }
        &.infotable{
          tr{
            td:nth-child(2n+1) {
              /* line-height: 0; */
            }
          }
        }
      }
    }
  }
  .detailInvestRecord{
    display: flex;
    flex-direction: column;
    position: absolute;
    top:0;
    bottom: 0;
    width: 100%;
    .dirTitle{
      font-size: 0;
      padding: 0 .5rem;
      line-height: 1.8rem;
      background-color: #eee;
      span{
        display: inline-block;
        vertical-align: middle;
        font-size: 0.56rem;
        width: 25%;
        color: #999;
        &:last-child{
          width:50%;
          text-align: right;
        }
      }
    }
    .dirCont{
      flex: 1;
      position: relative;
    }
  }
}
</style>
