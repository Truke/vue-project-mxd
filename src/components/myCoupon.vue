<template>
<iscroll-view  ref="scrollView" class="scroll-view" :options="{probeType: 1}"  :scrollerClass="{'scroller': true}" @pullUp="pullUp">
    <div class="contBorder">
        <div class="v-cont" v-for="(item,index) in listData" :key="index">
            <div class="list" data-wrap="layout">
                <div data-item="col-1" data-wrap="radio"  data-orange v-show="isActive==0&&$route.query.redirect">
                    <input type="radio" :id="index" @change="checkElem(item)" name="checkradio"> 
                    <label :for="index"></label>
                </div>
                <div data-item="col-3" >
                    <div class="checked" :class="Bgcolor">
                        <span v-if ="item.type==1">
                            &yen;<b >{{item.amount}}</b>
                        </span>
                        <span v-if="item.type==2">
                            <b >{{item.amount | rate}}</b>%
                        </span>
                        {{title}}
                    </div>
                </div>
                <ul data-item="col-9">
                    <li>投资金额：{{item.investAmountString}}</li>
                    <li>过期期限：{{item.startTime | atatime}}至{{item.endTime | atatime}}</li>
                    <li>投资期限：{{item.borrowPeriodSuffix}}</li>
                    <li>使用范围：<a>{{item.useRange | deleteData}}</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="data-load-tips" >{{loadStatusConfig[loadStatus]}}</div>
</iscroll-view>    
</template>

<script>
import BigDecimal from '@/lib/bigDecimal'
import datetime from '@/lib/dateTimeFormatter'
export default {
  updated () {
    this.refresh()
  },  
  data () {
    let loadStatus = ''
        if (this.offset < this.total) {
            loadStatus = 'canLoad'
        } else {
            loadStatus = 'canNotLoad'
        }
    return {
        loadStatus: loadStatus,
        loadStatusConfig: {
            canLoad: '上拉加载更多',
            canNotLoad: '没有更多数据~',
            loading: '加载中...'
        }
    }
   },
   props: ["listData",'getPageData', 'total', 'offset',"page","urlData","isActive","title"],//"checkElem",
   watch: {
    listData (newVal, oldVal) { 
      if (this.offset < this.total) {
        this.loadStatus = 'canLoad'
      } else {
        this.loadStatus = 'canNotLoad'
      }
    }
  },
  filters:{
        rate (v) {
          return BigDecimal.accMul(v || '', 100)
        },
        atatime (v) {
            return datetime(Number(v)).substr(0,10)
        },
        deleteData(v){
            return v.replace(/\||\/|\\/g,"")
        }
    },
  computed:{
        Bgcolor(){
            return ['yellow', 'yellow', 'gray'][this.isActive]
        }
    },
   methods:{
        refresh () {
            this.$refs.scrollView && this.$refs.scrollView.refresh()
        },
        pullUp () {
            if (this.offset < this.total) {
                this.loadStatus = 'loading'
                this.getPageData()
            } else {
                this.loadStatus = 'canNotLoad'
            }
        },       
   }
}
</script>
<style lang="less"  scoped>
.contBorder{
    background:#fff;
    border-bottom:1px solid #e6e5e8;
    .v-cont{
        border-top:1px solid #e6e5e8;padding-left:2%;
        .list{
        .checked{
            position:relative;color:#fff;margin:0.2rem 0;
            width:100%;text-align:center;height:3.6rem;
            span{   
                    padding-top:.5rem;display:block;font-size:0.68rem;
                    b{font-size:1rem;}
                }
            }
            .checked.yellow{
                background:url(../assets/images/g_yellow_bg.png) no-repeat right center;
                background-size:auto 4rem;
            }
            .checked.gray{
                background:url(../assets/images/g_gray_bg.png) no-repeat right center;
                background-size:auto 4rem;
            }
            ul{
                padding-left:.3rem;padding-top:.5rem;
            }
        }
    }
}
div[data-wrap="radio"]{
   margin-top:1.25rem;
}
.scroll-view{
  width:100%;
  touch-action:none;
  position: absolute;
  left:0;
  top:0;
  right: 0;
  bottom:0;
  overflow:hidden;
  z-index:998;
}
.data-load-tips{
    text-align:center;padding-top:.5rem;
}
</style>

