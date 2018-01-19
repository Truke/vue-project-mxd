<template>
    <div class="header" :style="{
           'background-image':this.$route.name=='ucenter'?'linear-gradient(to right, #ffb035 0%, #fe6f06 80%)':'',
           'background-color':this.$route.name=='inviteRecord'?'#38373d':''
       }">
       <p>
           <span class="back" v-show="headData.headFlag" @click="onClickBack"></span>
           {{headData.title}}
       </p>    
    </div>     
</template>

<script>
export default {
  data () {
    return {
     }
   },
   props: ["headData"],
   methods:{
    onClickBack () {
        if (this.headData.preventGoBack) {
            this.$emit('on-click-back')
        } else {
            this.$router ? this.$router.back() : window.history.back()
        }
    }
   }
}
</script>
<style lang="less" scoped>
   .list{
       color:#666;
    li{
         background:#fff;
         margin:.4rem 0;
         padding:.7rem;
         font-size:.52rem;
        a{
            color:#666;
            .title{
                font-size:.6rem;
                color:#333;
                margin-bottom:.7rem;
            }
            .rate{
                font-size:.6rem;
                color:#fe6f06;
                b{
                    font-size:1.2rem;         
                }
            }
            .periods b,.money b{
                margin-left:.3rem;
                color:#333;
                font-size:.68rem;
            }
         }
         button{
             margin-top:.7rem;
             font-size:.76rem;
         }
     }
   }
</style>

