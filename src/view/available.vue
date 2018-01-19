<template>
    <div class="available">
        <div class="ucenter-bg">
           <div class="u-c-upper width-90">
               <p>可用金额（元）</p>
               <b>{{availableAmount}}</b>
           </div>
            <ul class="list" >
                <li data-wrap="layout">
                    <span data-item="col-6">本月累计投资</span>
                    <label class="s-org" data-item="col-6">
                       {{monthInvestAmount}}
                    </label>
                </li>
            </ul>   
        </div>
        <div class="u-a-middle" >
              <div  v-for="(value,key,index) in config" :key="index">
                  <h3>{{key}}月</h3>
                  <div>
                    <ul class="list">
                        <li data-wrap="layout" v-for="(item,index) in value" :key="index">
                            <span data-item="col-6">
                                {{item.title}}
                                <i class="s-99" v-if="flagTime">{{item.createTime | atatime}}</i>
                                <i class="s-99" v-else>{{item.createTime  }}</i>
                            </span>
                            <label data-item="col-6">
                                <b :class="{'s-org':item.incomeSign==true,'s-green':item.incomeSign==false}">{{item.amount}}</b>
                            </label>
                        </li>
                    </ul>
                  </div>   
              </div>   
        </div>

    </div>
</template>
<script>
    import datetime from '@/lib/dateTimeFormatter'
    export default {
        name:'available',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                availableAmount:"0.00",
                monthInvestAmount:"0.00",
                nowTime:"",
                totalRow:'',
                flagTime:false,
                config:{
                }
            }
        },
        filters:{
            atatime (v) {
                return datetime(Number(v))
            } 
        },
        methods:{
            getDataInit:function(type){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:type,
                        method:'post',
                        data:{
                            userId:this.userId,
                            pageNo:1,
                            pageSize:2000,
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                var data = data.data;
                                if(data){
                                    that.availableAmount = data.availableAmount;
                                    that.monthInvestAmount = data.monthInvestAmount;
                                    that.nowTime = datetime(Number(data.nowTime)).substr(0, 7);
                                    getListArray(data.list)
                                    //数据处理
                                    function getListArray(list) {
                                        var config = {}
                                        list.map(function (item) {
                                            if(that.$route.query.type=="v"){
                                                var flag = datetime(Number(item.createTime)).substr(0, 7);
                                                that.flagTime = true;
                                            }else{
                                                var flag = item.createTime.substr(0, 7);
                                            }
                                            if (JSON.stringify(config) == "{}") {
                                                config[flag] = [item];
                                                return false;
                                            }
                                            for (var i in config) {
                                                if (flag == i) {
                                                    config[i].push(item)
                                                } else {
                                                    config[flag] = [item];
                                                }
                                            }
                                        });
                                        for( var i in config){
                                            if(i == that.nowTime){
                                                config["本"] = config[i];
                                                delete config[i]
                                            }
                                        }
                                        that.config = config
                                        
                                    }   
                                }
                            }
                        }
                    }); 
                }
            },
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '可用金额',
                    headFlag: true
                })
            }            
        },
        mounted(){
           this.activated();
           if(this.$route.query.type=="cg"){
               this.type = "availableLogcg"
               this.getDataInit(this.type);
             
           }else if(this.$route.query.type=="v"){
               this.type = "availableLog"
               this.getDataInit(this.type)
           }

        }
    }
</script>

<style lang="less" scoped>
.available{
    position: absolute;
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
}
.u-c-upper{
    border-bottom:1px solid #e5e5e5;
}
.list{
    li{ min-height:1.6rem;line-height:1.6rem;background:#fff;
        padding:0 5%;
        label{
            text-align:right;
            font-size:.6rem;
        }
    }
}
.u-a-middle{
    flex: 1;
    overflow: auto;
    h3{
        height:1.46rem;line-height:1.46rem;padding:0 5%;
        background:#eef3f9;font-weight:normal;font-size:.48rem;
    }
    .list{
        border-top:1px solid #e5e5e5;
        li{
            padding:.4rem 5%;line-height:.8rem;border-bottom:1px solid #e5e5e5;
            i{display:block;font-size:.44rem;}
        }
    }
}


</style>