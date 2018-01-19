<template>
<iscroll-view  ref="scrollView" class="scroll-view" :options="{click:true, scrollY: true, mouseWheel: true, probeType: 1}"  :scrollerClass="{'scroller': true}" @pullUp="pullUp">
    <div class="list-con" v-for="(item,index) in listData" :key="index" >
        <ul data-wrap="layout" :class="{'red':item.userid==1}">
            <li data-item="col-4" class="hidden">
                <p>¥<b>{{item.amount}}</b></p>
            </li>
            <li data-item="col-8" >
                <div data-wrap="layout" class="clearfix">
                    <span data-item="col-4">{{item.real_name}}</span>
                    <label data-item="col-6">{{source}}</label>
                </div>
                <div>
                    <span>红包发放日期：</span>
                    <label>{{item.startdate}}</label>
                </div>
                <div>
                    <span >红包生效日期：</span>
                    <label >{{item.senddate}}</label>
                </div>
                <div>
                    <span >红包说明：</span>
                    <label >{{item.remark}}</label>
                </div>
            </li>
        </ul>
    </div>
    <div class="data-load-tips" >{{loadStatusConfig[loadStatus]}}</div>
</iscroll-view>    
</template>

<script>
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
   props: ["listData",'getPageData', 'total', 'offset',"page",'source'],
   watch: {
    listData (newVal, oldVal) {
      if (this.offset < this.total) {
        this.loadStatus = 'canLoad'
      } else {
        this.loadStatus = 'canNotLoad'
      }
    }
  },
   methods:{
        refresh () {
            this.$refs.scrollView.refresh()
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
.hidden{overflow:hidden}
.list-con{width:90%;margin:.5rem auto;
    background:#d85940 url(../assets/images/g-c-bg.png) no-repeat center bottom;
    background-size:100%;border-radius:3px;overflow:hidden;
    ul{
        width:100%;height:4.3rem;padding:0.6rem 0.5rem;
        li{height:3.04rem;overflow:hidden;
            p{line-height:3.04rem;font-size:0.75rem;color:#ffe2b1;display:inline-block;}
            p b{
                 font-size:1.2rem;
            }
             div{
                 color:#ebcd9a;line-height:0.8rem;
                 label[data-item="col-6"]{
                     padding-left:0.5rem;
                 }
             }
        }
    }
    

}
.list-con ul.red{
    background:url(../assets/images/g-c-icon01.png) no-repeat right bottom;
    background-size:2.8rem auto;
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
    text-align:center;
}
</style>

