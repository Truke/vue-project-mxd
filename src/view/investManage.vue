<template>
    <div class="investManage">
        <div class="couponNav">
            <!--<div data-wrap="layout" v-if="isVip==0">
                <span data-item="col-12" @click="showPage(0)" v-bind:class="{actives: isActiveNav == 0}">散标</span>
            </div>
            <div data-wrap="layout" v-if="isVip==1">
                <span data-item="col-3" data-offset="1" @click="showPage(0)" v-bind:class="{active: isActiveNav == 0}">散标</span>
                <span data-item="col-3" data-offset="4" @click="showPage(1)" v-bind:class="{active: isActiveNav == 1}">VIP专享</span>
            </div>-->
             <div data-wrap="layout">
                <span data-item="col-3" data-offset="1" @click="showPage(0)" v-bind:class="{active: isActiveNav == 0}">散标</span>
                <span data-item="col-3" data-offset="4" @click="showPage(1)" v-bind:class="{active: isActiveNav == 1}">专享管理</span>
            </div>
        </div>
        <div class="page" v-show="isActiveNav==0">
            <div class="tabTitle">
                <div class="titleCon width-90" data-wrap="layout">
                    <span data-item="col-4" @click="showList(0)" v-bind:class="{active:isActive == 0}">加入中</span>
                    <span data-item="col-4" @click="showList(1)" v-bind:class="{active:isActive == 1}">还款中</span>
                    <span data-item="col-4" @click="showList(2)" v-bind:class="{active:isActive == 2}">已回收</span>
                </div>
            </div>
            <div v-if="isActive==0">
                <investManageAdd :addList="addList" :totalRow="totalRow" :isActiveNav="isActiveNav" :isActive="0" :strokeColor="strokeColor" @goTo="goTo"></investManageAdd>
            </div>
            <div v-else-if="isActive==1">
                <investManagePay :payList="payList" :totalRow="totalRow" :isActiveNav="isActiveNav" :isActive="1" @goTo="goTo"></investManagePay>
            </div>
            <div v-else>
                <investManagePay :payList="payList" :totalRow="totalRow" :isActiveNav="isActiveNav" :isActive="2"  @goTo="goTo"></investManagePay>
            </div>
        </div>
        <div class="page" v-show="isActiveNav==1">
             <div class="tabTitle">
                <div class="titleCon width-90" data-wrap="layout">
                    <span data-item="col-4" @click="showLists(0)" v-bind:class="{active:isActives == 0}">加入中</span>
                    <span data-item="col-4" @click="showLists(1)" v-bind:class="{active:isActives == 1}">还款中</span>
                    <span data-item="col-4" @click="showLists(2)" v-bind:class="{active:isActives == 2}">已回收</span>
                </div>
            </div>
            <div v-if="isActives==0">
                <investManageAdd :addList="addList" :totalRow="totalRow" :isActiveNav="isActiveNav" isActives="0" :strokeColor="strokeColor" @goTo="goTo"></investManageAdd>
            </div>
            <div v-else-if="isActives==1">
                <investManagePay :payList="payList" :totalRow="totalRow" :isActiveNav="isActiveNav" isActives="1" @goTo="goTo"></investManagePay>
            </div>
            <div v-else>
                <investManagePay :payList="payList" :totalRow="totalRow" :isActiveNav="isActiveNav" isActives="2" @goTo="goTo"></investManagePay>
            </div>
        </div>     
    </div>
</template>

<script>
    import investManageAdd from '@/components/investManageAdd.vue'
    import investManagePay from '@/components/investManagePay.vue'
    export default {
        name:'investManage',
        data(){
            return {
               userId: me.cookie.getItem("userId") || "",
               isVip: me.cookie.getItem("isVip") || "",
               cache:{},
               totalRow:"",
               borrowStatus:"7",
               statusSign:"2",
               isActive:1,
               isActives:1,
               isActiveNav:0,
               addList:[],
               payList:[],
               strokeColor: '#fe6f06'
            }
        },
        components: {
            investManageAdd,
            investManagePay
         },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '投资管理',
                    headFlag: true
                })
            },
            getList(url,status){ 
                var $this = this;
                if(url == "investRecordListCg"){
                    var datas = {
                        userId:$this.userId,
                        borrowStatus:status,
                        pageNo:1,
                        pageSize:100
                    }
                }else{
                   var datas = {
                        userId:$this.userId,
                        planType:3,
                        statusSign:status,
                        pageNo:1,
                        pageSize:100
                    }
                }
                if($this.cache[$this.isActiveNav+''+ status]){
                    $this.payList = $this.cache[$this.isActiveNav+''+ status].payList;
                    $this.addList = $this.cache[$this.isActiveNav+''+ status].addList;
                    $this.totalRow = $this.cache[$this.isActiveNav+''+ status].totalRow;
                }else{
                    $this.$config.getData({
                        key:url,
                        method:'post',
                        data:datas,
                        callback:function(data){
                            if(data.result == '1') {
                                $this.addList = data.data.list;
                                $this.payList = data.data.list;
                                $this.totalRow = $this.isActiveNav == 0 ? data.data.totalRow : data.data.totalCount;
                                if(!$this.cache[$this.isActiveNav+''+ status]){
                                    $this.cache[$this.isActiveNav+''+ status] = {
                                        addList : data.data.list,
                                        payList : data.data.list,
                                        totalRow : $this.totalRow
                                    }
                                }
                            }
                        }
                    });
                }
            },
            showPage(choice) {         
                this.isActiveNav = choice;
                if(choice == 0){
                    this.getList('investRecordListCg', this.borrowStatus);
                }else{
                    this.getList('getUserInvestTrack', this.statusSign);
                }       
            },
            showList(choice) {
                this.isActive = choice; 
                if(choice == 0){
                    this.borrowStatus = "2,6";
                }else if(choice == 1){
                    this.borrowStatus = "7";
                }else{
                    this.borrowStatus = "9";
                }
                this.getList('investRecordListCg',this.borrowStatus);
            },
            showLists(choice) {
                this.isActives = choice;
                if(choice == 0){
                    this.statusSign = "1";
                }else if(choice == 1){
                    this.statusSign = "2";
                }else{
                    this.statusSign = "3";
                }
                this.getList('getUserInvestTrack',this.statusSign);
            },
            goTo(url){
                this.$root.goUrl(url);
            }
        },
        mounted(){
           this.init();      
           var from = me.localStorage.getItem("from");
           var showFlag = me.localStorage.getItem("investManageFlag"); 
           if(from == 2){
              this.isActiveNav = 1;
              this.isActives = (showFlag && showFlag.isActives) || 1;  
           }else{
              this.isActiveNav = 0;
              this.isActive = (showFlag && showFlag.isActive) || 1;  
           }
           this.getList(this.isActiveNav == 0 ?'investRecordListCg' : 'getUserInvestTrack',this.isActiveNav == 0 ? (this.isActive == 1 ? '7' : '9') : (this.isActives == 1 ? '2' : '3'));    
        }
    }
</script>

<style lang="less" scoped>
    .actives{
        border-bottom:0;
        color:#fe6f06;
    }
    .page{
        padding-bottom:2rem;
    }
    .tabTitle{
        background:#eee;
        margin-bottom:0;
    }
</style>