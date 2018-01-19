<template>
    <div class="coupon">
        <div class="couponNav" >
            <div class="w-70" data-wrap="layout">
                <span data-item="col-6" @click="showPage(0)" v-bind:class="{active: isActiveNav == 0}">我的券</span>
                <span data-item="col-6" @click="showPage(1)" v-bind:class="{active: isActiveNav == 1}">现金奖励红包</span>
            </div>
        </div>
        <div class="page01" v-show="isActiveNav==0">
            <div class="tabTitle">
                <div class="width-90 titleCon" data-wrap="layout">
                    <span data-item="col-4" @click="showList(0)" v-bind:class="{active: isActive == 0}">未使用</span>
                    <span data-item="col-4" @click="showList(1)" v-bind:class="{active: isActive == 1}">已使用</span>
                    <span data-item="col-4" @click="showList(2)" v-bind:class="{active: isActive == 2}">已过期</span>
                </div>
            </div>
            <!-- <h2 v-if="isActive==0&&!config[isActive].items.length==0">加息券</h2> -->
            <div class="container">
                <my-coupon  v-if="config[isActive].items.length > 0"
                        :isActive="isActive"
                        :listData="config[isActive].items"  
                        :total="config[isActive].total" 
                        :offset="config[isActive].offset" 
                        :page="config[isActive].page"
                        :urlData="config[isActive].urlData"
                        :title ="config[isActive].title"
                        :getPageData="getDataInit"
                >
                </my-coupon>
                <div class="noData" v-if="config[isActive].items.length==0">
                    暂无数据
                </div>
            </div>
       </div>
        <div class="page02 width-90"  v-show="isActiveNav==1">
            <my-coupon-red v-if="itemsRed.length > 0" :listData="itemsRed" :getPageData="getDataInitRed" :source='source' :total="redTotal" :offset="redOffset" :page="redPage">
            </my-coupon-red> 
            <div class="noData" v-if="itemsRed.length==0">
                    暂无数据
            </div>   
        </div>    
    </div>
</template>

<script>
    export default {
        name:'coupon',
        data(){
            let loadStatus = ''
            return {
                userId:me.cookie.getItem("userId"),
                isActive:0,
                isActiveNav:0,
                type:0,
                config: [
                    {   title:'立即使用',
                        total: 0,
                        offset: 0,
                        page:0,
                        items:[],
                    },
                   {    title:'已使用',
                        total: 0,
                        offset: 0,
                        page:0,
                        items:[],
                    },
                    {
                        title:'已过期',
                        total: 0,
                        offset: 0,
                        page:0,
                        items:[],
                    }
                ],
                redTotal: 0,
                redOffset: 0,
                redPage:0,
                source:"e账户",
                itemsRed:[],
                checkItem: null,
            }
        },
        methods:{
            showList(choice) {
                this.isActive = choice;
                this.config[choice].page=0
                this.config[choice].total=0
                this.config[choice].offset=0
                this.getDataInit();
            },
            showPage(choice) {
                this.isActiveNav = choice;
                if(this.isActiveNav==1){
                    this.itemsRed = []
                    this.redTotal = 0
                    this.redOffset = 0
                    this.redPage = 0
                    this.getDataInitRed();
                }
                if(this.isActiveNav==0){
                    this.showList(0)
                }
            },
            getDataInitRed(){
                var that = this;
                this.redPage = this.redPage + 1
                that.$config.getData({
                    key: 'queryRedEnvellope',
                    method: 'post',
                    data: {
                        userId:that.userId,
                        pageNo:that.redPage,
                        pageSize:5,
                    },
                    callback:function(data){
                        if(data.result == 1){
                            if (that.redPage === 1) {
                                that.itemsRed = data.data.listRedenvelope || []
                                that.redTotal = data.data.totalCount
                                that.redOffset = that.itemsRed.length
                            } else {
                                that.itemsRed = that.itemsRed.concat(data.data.listRedenvelope || [])
                                that.redOffset += data.data.listRedenvelope.length
                            }
                        }
                    }
                })
            },
            getDataInit () {
                var that = this;
                that.config[that.isActive].page = that.config[that.isActive].page + 1
                that.$config.getData({
                    key: 'findAllCouponTicketNew',
                    method: 'post',
                    data: {
                        userId:that.userId,
                        type:that.type,
                        status:that.isActive + 1,
                        pageNo:that.config[that.isActive].page,
                        pageSize:5,
                    },
                    callback:function(data){
                        if(data.result == 1){
                            let cur = that.config[that.isActive]
                            if (cur.page === 1) {
                                cur.items = data.data.list || []
                                cur.total = data.data.totalCount
                                cur.offset = cur.items.length
                            } else {
                                cur.items = cur.items.concat(data.data.list || [])
                                cur.offset += data.data.list.length
                            }
                        }
                    }
                })
            },
            // checkElem (item) {
            //     if (this.$route.query.redirect) {
            //         this.checkItem = item 
            //         this.$router.replace({path: this.$route.query.redirect})
            //     }
            // },
            activated () {
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '我的券',
                    headFlag: true
                })
            }
            
        },
        mounted(){
           this.activated();
           this.getDataInit();
        }
    }
</script>

<style lang="less" scoped>
.page01{
    display: flex;
    flex-direction: column;
    position: absolute;
    top:2rem;
    bottom:0;
    width: 100%;
    h2{ width:100%;
        background:#fff;
        top:0;
        left:0;
        line-height:1.3rem;font-size:0.58rem;padding-left:5%;
        z-index:999;
    }
}
.tabTitle{background:#eee;
    .titleCon{border:1px solid #007aff;
        span{border-right:1px solid #007aff;color:#007aff}
        span.active{background:#007aff;color:#fff}
        span:last-child{border-right:0}
    }

}
.container{
    position:relative;flex:1;
}
.page02{
    display:flex;
    flex-direction: column;
    position: absolute;
    top:2rem;
    bottom:0;
    width: 100%;
}
</style>