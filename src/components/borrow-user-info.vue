<template>
  <iscroll-view ref='scrollView' class="scroll-view" :options="{scrollY: true, probeType: 1}"  :scrollerClass="{'scroller': true,click: iScrollClick, tap: true}"  @pullDown='pullDown'>
    <div class="cardlist" :style="{'min-height': winheight + 'px'}">
      <card v-if="user.description">
        <div class="cardTit" slot="header"><i><img :src="cicon05"></i>借款人描述</div>
        <div class="cardCont" slot="content">
          <p v-html="user.description.description"></p>
        </div>
      </card>
      <card v-if="user.borrowUserMsg">
        <div class="cardTit" slot="header"><i><img :src="cicon05"></i>借款人信息</div>
        <div class="cardCont" slot="content">
          <table class="infotable">
            <tbody>
              <tr>
                <td><label>用户名：</label></td>
                <td width="30%"><p>{{user.borrowUserMsg.name}}</p></td>
                <td><label>年龄：</label></td>
                <td width="30%"><p>{{user.borrowUserMsg.age||'--'}}</p></td>
              </tr>
              <tr>
                <td><label>真实姓名：</label></td>
                <td><p>{{user.borrowUserMsg.realName}}</p></td>
                <td><label>学历：</label></td>
                <td><p>{{user.borrowUserMsg.education||'--'}}</p></td>
              </tr>
              <tr>
                <td><label>婚姻：</label></td>
                <td><p>{{user.borrowUserMsg.maritalStatus||'--'}}</p></td>
                <td><label>公司行业：</label></td>
                <td><p>--</p></td>
              </tr>
              <tr>
                <td><label>有无购房：</label></td>
                <td><p>{{user.borrowUserMsg.house}}</p></td>
                <td><label>公司规模：</label></td>
                <td><p>500人以上</p></td>
              </tr>
              <tr>
                <td><label>有无房贷：</label></td>
                <td><p>{{user.borrowUserMsg.houseloan}}</p></td>
                <td><label>工作时间：</label></td>
                <td><p>3年以上</p></td>
              </tr>
              <tr>
                <td><label>有无购车：</label></td>
                <td><p>{{user.borrowUserMsg.car}}</p></td>
                <td><label>工作城市：</label></td>
                <td><p>{{user.borrowUserMsg.jobcity||'--'}}</p></td>
              </tr>
              <tr>
                <td><label>有无车贷：</label></td>
                <td><p>{{user.borrowUserMsg.carloan}}</p></td>
                <td><label>从事行业：</label></td>
                <td><p>{{user.borrowUserMsg.professionType||'--'}}</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
      <card v-if="user.loancar&&Object.keys(user.loancar).length">
        <div class="cardTit" slot="header"><i><img :src="cicon09"></i>抵押信息-车贷</div>
        <div class="cardCont" slot="content">
          <table class="infotable">
            <tbody>
              <tr>
                <td><label>车辆品牌：</label></td>
                <td><p>{{user.loancar.carBrand}}</p></td>
                <td><label>车辆型号：</label></td>
                <td><p>{{user.loancar.vehicleModel}}</p></td>
              </tr>
              <tr>
                <td><label>汽车首次购置时间：</label></td>
                <td><p>{{user.loancar.carCostDate}}</p></td>
                <td><label>机动车等级证书编号：</label></td>
                <td><p>{{user.loancar.carRankNumber}}</p></td>
              </tr>
              <tr>
                <td><label>发动机号：</label></td>
                <td><p>{{user.loancar.engineNumber}}</p></td>
                <td><label>车牌号码：</label></td>
                <td><p>{{user.loancar.carNumber}}</p></td>
              </tr>
              <tr>
                <td><label>购置价格：</label></td>
                <td><p>{{user.loancar.carCost}}</p></td>
                <td><label>是否进口车辆：</label></td>
                <td><p>{{user.loancar.isImported}}</p></td>
              </tr>
              <tr>
                <td><label>过户次数：</label></td>
                <td><p>{{user.loancar.transfer}}</p></td>
                <td><label>公里数：</label></td>
                <td><p>{{user.loancar.kilometers}}</p></td>
              </tr>
            </tbody>
           </table>
        </div>
      </card>
      <card v-if="user.loanhouse&&Object.keys(user.loanhouse).length">
        <div class="cardTit" slot="header"><i><img :src="cicon09"></i>抵押信息-房贷</div>
        <div class="cardCont" slot="content">
          <table class="infotable">
            <tbody>
              <tr>
                <td><label>产权人姓名：</label></td>
                <td><p>{{user.loanhouse.name}}</p></td>
                <td><label>房屋类型：</label></td>
                <td><p>{{user.loanhouse.houseType}}</p></td>
              </tr>
              <tr>
                <td><label>建成年份：</label></td>
                <td><p>{{user.loanhouse.buildYear}}</p></td>
                <td><label>房产性质：</label></td>
                <td><p>{{user.loanhouse.houseNature}}</p></td>
              </tr>
              <tr>
                <td><label>共有情况：</label></td>
                <td><p>{{user.loanhouse.commonSituation}}</p></td>
                <td><label>购入价值：</label></td>
                <td><p>{{user.loanhouse.houseAssetCost}}</p></td>
              </tr>
              <tr>
                <td><label>权力状况：</label></td>
                <td><p>{{user.loanhouse.rights}}</p></td>
                <td><label>建筑面积：</label></td>
                <td><p>{{user.loanhouse.houseCoveredArea}}</p></td>
              </tr>
              <tr>
                <td><label>是否抵押：</label></td>
                <td><p>{{user.loanhouse.houseIsMortgage}}</p></td>
                <td><label>房产获得方式：</label></td>
                <td><p>{{user.loanhouse.houseGetType}}</p></td>
              </tr>
              <tr>
                <td><label>购置时间：</label></td>
                <td><p>{{user.loanhouse.houseCostDate}}</p></td>
                <td><label>初评估价值：</label></td>
                <td><p>{{user.loanhouse.houseAmount}}</p></td>
              </tr>
              <tr>
                <td><label>房产用途：</label></td>
                <td><p>{{user.loanhouse.houseUse}}</p></td>
                <td><label>是否法院冻结：</label></td>
                <td><p>{{user.loanhouse.isFrozen}}</p></td>
              </tr>
              <tr>
                <td><label>房产地址：</label></td>
                <td colspan="3"><p>{{user.loanhouse.houseAddress}}</p></td>
              </tr>
              <tr>
                <td><label>房产证号：</label></td>
                <td colspan="3"><p>{{user.loanhouse.housePropertyNumber}}</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
      <card v-if="$store.getters.userId&&user.creditRecord&&Object.keys(user.creditRecord).length">
        <div class="cardTit" slot="header"><i><img :src="cicon08"></i>信用档案</div>
        <div class="cardCont" slot="content">
          <table v-if="borrowType==='1'">
            <tbody>
              <tr>
                <td width="30%"><label>申请借款(笔)：</label></td>
                <td width="20%"><p>{{user.creditRecord.countAll}}</p></td>
                <td width="30%"><label>借款总额(元)：</label></td>
                <td width="20%"><p>{{user.creditRecord.amount}}</p></td>
              </tr>
              <tr>
                <td><label>还款笔数(笔)：</label></td>
                <td><p>{{user.creditRecord.countFinish}}</p></td>
                <td><label>信用额度(元)：</label></td>
                <td><p>{{user.creditRecord.credit}}</p></td>
              </tr>
              <tr>
                <td><label>成功借款(笔)：</label></td>
                <td><p>{{user.creditRecord.countSuccess}}</p></td>
                <td><label>待还本息(元)：</label></td>
                <td><p>{{user.creditRecord.waitRepaymentAmount}}</p></td>
              </tr>
              <tr>
                <td><label>逾期次数(次)：</label></td>
                <td><p>{{user.creditRecord.countOverdual}}</p></td>
                <td><label>逾期金额(元)：</label></td>
                <td><p>{{user.creditRecord.sumOverdual}}</p></td>
              </tr>
            </tbody>
          </table>
          <table v-if="borrowType==='4'">
            <tbody>
              <tr>
                <td width="30%"><label>申请借款(笔)：</label></td>
                <td width="20%"><p>{{user.creditRecord.countAll}}</p></td>
                <td width="30%"><label>还款笔数(笔)：</label></td>
                <td width="20%"><p>{{user.creditRecord.countFinish}}</p></td>
              </tr>
              <tr>
                <td><label>逾期次数(次)：</label></td>
                <td><p>{{user.creditRecord.countOverdual}}</p></td>
                <td><label>成功借款(笔)：</label></td>
                <td><p>{{user.creditRecord.countSuccess}}</p></td>
              </tr>
              <tr>
                <td><label>逾期金额(元)：</label></td>
                <td><p>{{user.creditRecord.sumOverdual}}</p></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
      <card v-if="!$store.getters.userId&&user.authStatus&&Object.keys(user.authStatus).length">
        <div class="cardTit" slot="header"><i><img :src="cicon06"></i>借款人审核</div>
        <div class="cardCont" slot="content">
          <table class="">
            <tbody>
              <tr v-if="user.authStatus.realNameAuthStatus">
                <td>身份认证</td>
                <td>{{user.authStatus.realNameAuth}}</td>
                <td align="right"><span><img :src="cicon07" style="width:2.0rem" alt=""></span></td>
              </tr>
              <tr v-if="user.authStatus.phoneAuthStatus">
                <td>手机认证</td>
                <td>{{user.authStatus.phoneAuth}}</td>
                <td align="right"><span><img :src="cicon07" style="width:2.0rem" alt=""></span></td>
              </tr>
              <tr v-if="user.authStatus.jobAuthStatus">
                <td>工作认证</td>
                <td>{{user.authStatus.jobAuth}}</td>
                <td align="right"><span><img :src="cicon07" style="width:2.0rem" alt=""></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
      <card v-if="$store.getters.userId&&user.attachs&&user.attachs.length">
        <div class="cardTit" slot="header"><i><img :src="cicon06"></i>借款人审核</div>
        <div class="cardCont" slot="content">
          <div class="imgview">
            <imgs-inline class="imgInline" v-for="(item,index) in user.attachs" :key="index" :item="item"></imgs-inline>
          </div>
        </div>
      </card>
    </div>
  </iscroll-view>
</template>

<script>
import { Card } from 'vux'
import ImgsInline from '@/components/imgs-inline'
export default {
  props: ['pullDown', 'tabIndex', 'borrowId', 'borrowType', 'depositoryId'],
  data () {
    return {
      winheight: window.innerHeight - 100,
      user: {},
      cicon05: require('../assets/images/c-icon_05.png'),
      cicon06: require('../assets/images/c-icon_06.png'),
      cicon07: require('../assets/images/c-icon_07.png'),
      cicon08: require('../assets/images/c-icon_08.png'),
      cicon09: require('../assets/images/c-icon_09.png'),
    }
  },
  components: {
    Card,
    ImgsInline,
  },
  updated () {
    this.refresh()
  },
  watch: {
    tabIndex (val) {
      if (val === 1) {
        this.refresh()
      }
    }
  },
  computed: {
    iScrollClick () {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
        return 'false'
      } 
      if (/Chrome/i.test(navigator.userAgent)) {
        return (/Android/i.test(navigator.userAgent))
      }
      if (/Silk/i.test(navigator.userAgent)) {
        return 'false'
      }
      if (/Android/i.test(navigator.userAgent)) {
        let s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3)
        return parseFloat(s[0]+s[3]) < 44 ? 'false' : 'true'
      }
    }
  },
  methods: {
    refresh () {
      this.$refs.scrollView.refresh()
    },
    getUserInfo () {
      this.$config.getData({
        key: 'getBorrowUserInfo',
        method: 'post',
        data: {
          borrowId: this.borrowId
        },
        callback: (data) => {
          if (data.result === 1) {
            this.user = data.data
          }
        }
      })
    },
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    this.$nextTick(() => {
      this.refresh()
    })
  }
}
</script>

<style lang="less">
.imgview{
  font-size: 0;
  .imgInline{
    display: inline-block;
    vertical-align: middle;
    width: 49%;
    background-color: #fff;
    &:nth-child(2n+1){
      margin-right: 2%;
    }
    .imgWrap{
      padding: .3rem .3rem 0;
      img{
        &:not(:first-child){
          display: none;
        }
      }
    }
    h6{
      font-size: .52rem;
      padding: 0 .3rem;
      text-align: center;
    }
  }
}
</style>