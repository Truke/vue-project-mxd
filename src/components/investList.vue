<template>
  <section class="list">
      <h2 class="clearfix"><strong class="l">{{item.bidName}}</strong></h2>
      <article class="list-m clearfix">
        <div class="fl">
          <span class="s-org"><b>{{item.yearsIncome}}</b>%</span>
          <label class="s_t_center">协议年化利率</label>
        </div>
        <div class="fl">
          <p>
              <span v-if="item.cycleType === '0'" class="s-t-center">{{item.periods}}个月</span>
              <span v-else-if="item.cycleType ==='1'" class="s-t-center">{{item.periods}}天</span>
              <span v-else-if="item.cycleType ==='2'" class="s-t-center">{{item.periods}}固定到期日</span>
              <span v-else-if="item.cycleType ==='3'" class="s-t-center">{{item.periods}}年</span>
          </p>
          <label class="s-t-center"><strong></strong>期限</label>
        </div>
        <div class="fl">
          <span class="s-t-right">{{item.haveMoney}}</span>
          <label class="s-t-right">可投金额</label>
          <!-- <p v-if="item.cycleType === '0'" v-else-if="item.bidState ==='1'">
            <label class="s-t-right">还款中</label>
          </p>  -->
        </div>
      </article> 
      <div class="warp progress" >
          <p class="pr fl"><em  ref="progress"></em></p>
          <span class="fr">{{item.progress}}%</span>
      </div> 
  </section>

</template>
<style lang="less"  scoped>
.s-org{color:#fe7a19;}
.list{margin-bottom:.6rem;background:#fff;padding:.6rem;
      h2{
        font-size:.6rem;color:#333;
      }
      .list-m{
          div{
            width:33%;
          }
          span,label{
            display:block;padding-top:0.5rem;
          }
          span{
            font-size:.6rem;
            b{font-size:0.8rem;}
          }  
          label{
            font-size:.58rem;color:#999;
          }
      }
      .progress{padding-bottom:0.3rem;padding-top:0.5rem;
        p{width:85%;background:#f0f0f0;border-radius:2px;height:4px;
          em{position:absolute;left:0px;top:0px;width:0%;border-radius:2px;height:4px;display:inline-block;background:#508ceb; 
            transition:width linear;
          }
        }
        span{display:inline-block;position:relative;top:-10px;color:#7394e9;font-size:0.5rem;}
      }

}
</style>
<script>
export default {
 props:['item','index'],
 methods: {
   //进度条
    progressInit(){
      let i = 0
      let max = this.item.progress
      let timer = setInterval(()=>{
        i++
        this.$refs.progress.style.width = i + '%'
        if(i>max){
          clearInterval(timer)
        }
      }, 20)
    }
 },
 mounted () {
   this.progressInit()
 }

}  
</script>

