<template>
    <div class="yesterday">
        <div class="ucenter-bg">
           <div class="u-c-upper width-90">
               <p>昨日收益（元）</p>
               <b>{{yestdayIncome | my-filter}}</b>
           </div>
        </div>
        <div class="u-y-middle" >
            <ul class="list" v-if="show">
                <li data-wrap="layout"  v-for="(item,index) in items" :key="index">
                    <span data-item="col-6">{{item.title}}</span>
                    <label data-item="col-6">
                        &yen;{{item.value}}
                    </label>    
                </li>
            </ul> 
            <div v-else class="noDate">
                <p>
                    你的收益空空
                </p>
                快让小民帮你赚钱吧！
            </div>     
        </div>

    </div>
</template>

<script>
    export default {
        name:'yesterday',
        data(){
            return {
                show:true,
                userId:me.cookie.getItem("userId"),
                yestdayIncome:"",
                items:[]
            }
        },
        methods:{
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '昨日收益',
                    headFlag: true
                })
            },
            //获取页面数据
            getDataInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccount",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data
                                if(data){
                                    that.yestdayIncome = data.yestdayIncome;
                                }
                            }
                        }
                    }); 
                }
                
            },
            getlist:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"getYestday",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data;
                                if(data.length){
                                    that.show = true;
                                    that.items= data;
                                }else{
                                    that.show = false;
                                }
                            }
                        }
                    }); 
                }
            }
        },
        mounted(){
           this.activated();
           this.getDataInit();
           this.getlist();
        }
        
    }
</script>

<style lang="less" scoped>
.u-y-middle{
    .list{
         background:#fff;
         border-bottom:1px solid #e5e5e5;
         border-top:1px solid #e5e5e5;
        li{ height:1.76rem;line-height:1.76rem;
            margin-left:5%;
            padding-right:5%;
            border-bottom:1px solid #e5e5e5;
            font-size:.52rem;
            label{
                text-align:right;
            }
        }
        li:last-child{border-bottom:0}
    }
    .noDate{
        background:url(../assets/images/g-y-icon01.png) no-repeat center 4.8rem;
        padding-top:8.8rem;text-align:center;
    }
}
</style>