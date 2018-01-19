<template>
    <div class="bankcardState">
        <div class="bindcont bgtip"  v-if="getdata.result==0||(getdata.result==1&&getdata.status==0)">
            <div class="bind-border" data-wrap="layout">
                <span class="g-s-d3" data-item="col-6">
                    +尚未绑卡
                </span>
                <span  class="s-t-right" data-item="col-6" @click="goUrl">
                    <label v-if='urlmxd'>去绑卡</label>
                    <label v-if='urlcg'>去绑卡</label>
                    <label v-if='urlcgr'>去开户</label>
                </span>
            </div>
        </div>
        <div class="bindcont" v-if="getdata.result==1&&(getdata.status==null||getdata.status==1)">
            <div class="bind-border" :style="{borderBottomColor:getdata.bankColor}">
                <div class="bankImg clearfix">
                    <img class="fl" :src="getdata.bankImageUrl"/>
                    <dl class="fl">
                        <dt v-if='getdata.name'>{{getdata.name}}</dt>
                        <dt v-else-if='getdata.bankName' >{{getdata.bankName}}</dt>
                        <dd>{{getdata.cardNo | atatime}}</dd>
                    </dl>    
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
       userId:me.cookie.getItem("userId"),
     }
   },
   props: ['getdata','urlmxd','urlcg','urlcgr'],
   filters:{
        atatime (v) {
            return me.str.str2char(v,0,(v.length-4),'*')
        } 
    },
   methods:{
       goUrl:function(){
           if(this.urlmxd){
               this.$root.goUrl('bankcardOld')
           }
           if(this.urlcg){
               this.$router.push({name:'bankcardcg',query:{type:'urlcg'}})
           }if(this.urlcgr){
               this.$root.goUrl('realName')
           }
       },
   }
}
</script>
<style lang="less"  scoped>
.bankcardState{
   .bindcont{
        border:1px solid #e6e6e6;
        border-radius:5px;overflow:hidden;
        background:#fff;
        .bind-border{height:3.06rem;
            padding:0.6rem 1.3rem 0.6rem 0.8rem;
            border-bottom:2px solid #d3d3d3;
        }
        .bankImg{
            img{
                width:1.08rem;padding-top:.3rem;
            }
            dl{display:inline-block;padding-left:.5rem;
                dd{
                   font-size:.6rem;
                }
            }
        }
    }
    .bgtip{
        background:#fff url(../assets/images/g-bankcard-icon01.png) no-repeat 94% 0.85rem;
        background-size:0.26rem auto;
    }

}
</style>

