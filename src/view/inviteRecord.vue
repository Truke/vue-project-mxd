<template>
    <div class="inviteRecord">
        <div class="ucenter-bg">
           <div class="recordTop" data-wrap="layout">
               <div data-item="col-6">
                    <b class="s-t-center s-org">{{totalRow}}人</b>
                    <p class="s-99">邀请直接好友</p>
               </div>
               <div data-item="col-6">
                    <b class="s-t-center s-org">{{total|my-filter}}</b>
                    <p class="s-99">贡献收益(元)</p>
               </div>
           </div>    
        </div>
        <div class="in-r-middle">
            <table>
                <tr>
                    <th width="25%">我的好友</th>
                    <th width="25%">到期时间</th>
                    <th width="25%">投资笔数</th>
                    <th width="25%">创造收益</th>
                </tr>
                <tr v-if="items.length > 0" v-for="(item,index) in items" :key="index">
                    <td>{{item.name | newName}}</td>
                    <td>{{item.deadline | atatime}}</td>
                    <td>{{item.investNumber}}</td>
                    <td>{{item.income |my-filter}}</td>
                </tr>   
            </table>
            <div class="noData" v-if="items.length==0">
                    暂无数据
            </div>  
        </div>   
    </div>
</template>

<script>
    export default {
        name:'inviteRecord',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                totalMoney:"0.00",
                totalRow:0,
                total:0.00,
                items:[]
            }
        },
        filters:{
            newName (v){
                return  v.replace(/\s/g,"") ||  "--"
            },
            atatime (v){
                return  v.replace(/\s/g,"").substr(0, 10)  || "--"
            }
        },
        methods:{
            getDateInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findPhoneFriend",
                        method:'post',
                        data:{
                            userId:that.userId,
                            pageNo:1,
                            pageSize:10
                        },
                        callback:function(data){
                            if(data.result == '1') { 
                                that.totalRow = data.data.totalRow;
                                that.total = data.data.total;
                                if(data.data.list.length > 0 ){
                                    that.items = data.data.list;
                                }
                            }
                        }
                    }); 
                }               
            },
            activated(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '直接邀请记录',
                    headFlag: true
                })
            }
        },
        mounted(){
           this.activated();
           this.getDateInit();
        },
       
    }
</script>

<style lang="less" scoped>
.ucenter-bg{
    background:#38373d;
    background:-moz-linear-gradient(top,#38373d,#4b4a50);
    background:-webkit-gradient(top,#38373d,#4b4a50); 
    background:-o-linear-gradient(top,#38373d,#4b4a50); 
    .recordTop{
        padding:1rem 0;
        text-align:center;
        b{
            font-size:.8rem;
        }
        p{
            text-align:center;
        }

    }
}
.in-r-middle{
    background:#fff;
    table{
        width:100%;
        th{border-bottom:1px dashed #f2f2f2;font-weight:normal}
        td,th{line-height:1.8rem;text-align:center}
    }
}
</style>