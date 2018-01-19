<template>
    <div class="userSet">
        <x-header
          style="background-color: #fe6f07;"
          :left-options="leftOptions"
          title="个人设置"
          @on-click-back="clickBack">
        </x-header>
        <ul class="ulset" >
            <li >
                <div href="#" data-wrap="layout">
                    <span data-item="col-6">
                        姓名
                    </span>
                    <label data-item="col-6">
                        {{realName | newName}}
                    </label>
                </div>
            </li>
            <li >
                <div href="#" data-wrap="layout">
                    <span data-item="col-6">
                        电子账户
                    </span>
                    <label class="imgIcon" v-if="flageCard"  @click="goUrl('realName')" data-item="col-6">
                        未开户
                    </label>
                    <label  v-else data-item="col-6">
                        {{cardNum}}
                    </label>
                </div>    
            </li>
            <li>
                <div href="#" data-wrap="layout">
                    <span data-item="col-6">
                        实名认证
                    </span>
                    <label v-if="realNameState==1" class="imgIcon" data-item="col-6" @click="goUrl('realNameSuccess')">
                        已认证
                    </label>
                    <label class="imgIcon" @click="goUrl('realName')"  v-else data-item="col-6">
                        未实名
                    </label>
                </div>    
            </li>
            <li >
                <div data-wrap="layout">
                    <span data-item="col-6" >
                        银行预留手机号
                    </span>
                    <label class="imgIcon" v-if="flagePhone" @click="goUrl('realName')"  data-item="col-6">
                        未认证
                    </label>
                    <label class="imgIcon" v-else data-item="col-6" @click="goUrl('reservedOld')">
                        {{reservedPhoneNo}}
                    </label>
                </div>    
            </li>
        </ul>    
        <ul class="ulset" >
            <li @click="goUrl('bankcard')">
                <div data-wrap="layout">
                    <span data-item="col-6">
                        银行卡管理
                    </span>
                    <label class="imgIcon"  data-item="col-6">
                    </label>
                </div>
            </li>
            <li  @click="goUrl('pwdMassage')">
                <div data-wrap="layout">
                    <span data-item="col-6">
                        密码管理
                    </span>
                        <label class="imgIcon"  data-item="col-6">
                    </label>
                </div>
            </li>                
        </ul>
        <ul class="ulset" >
            <li >
                <div data-wrap="layout">
                    <span data-item="col-6">
                        自动债转签约
                    </span>
                    <label class="imgIcon" v-if="flageStatus"  @click="autoSignClick" data-item="col-6">
                        未签约
                    </label>
                    <label  v-else data-item="col-6">
                        已签约
                    </label>
                </div>
            </li>
                        
        </ul>
        <div class="width-90 foot">
            <button class="me-u-btn" data-size = block  data-color="orange" @click="logoutUser">退出登录</button>
        </div>      
    </div>    
</template>

<script>
    import { formpost } from '@/lib/utils'
    import { mapGetters, mapActions } from 'vuex'
    import { XHeader } from 'vux'
    export default {
        name:'userSet',
        data(){
            return {
                userId:me.cookie.getItem("userId"),
                realName:"",
                cardNum:"",
                reservedPhoneNo:"",
                realNameState:'',
                flageCard:false,
                flagePhone:false,
                flageStatus:false,
            }
        },
        components: {
            XHeader,
        },
        computed: {
            ...mapGetters(['isRealNameAuth', 'isOpenedAccount', 'isOnCard']),
            leftOptions () {
              return {
                showBack: !0,
                backText: '',
                preventGoBack: !0
              }
            }
        },
        filters:{
            newName (v){
                return  v.replace(/\s/g,"") ||  "--"
            }
        },
        methods:{
            ...mapActions(['account', 'logout', 'findAccountCartMsgAPI']),
            goUrl:function(url){
                this.$root.goUrl(url);
            },
            init () {
                this.$store.dispatch('setPageHead', {
                    show: false,
                    title: '个人设置',
                    headFlag: false
                })
            },
            clickBack () {
              this.$router.replace({name: 'ucenter'})
            },
            //获取页面数据
            getDataInit:function(){
                var that = this;
                if(me.cookie.getItem("userId")){
                    that.$config.getData({
                        key:"findAccountMsg",
                        method:'post',
                        data:{
                            userId:this.userId,
                        },
                        callback:function(data){
                            if(data.result === 1 && data.data.result === 1) { 
                                var data = data.data.personalInfoVo;
                                if(data){
                                    that.realName = data.realname;
                                    that.realNameState = data.realNameState;
                                    if(data.cardNbr){
                                        that.cardNum = data.cardNbr;
                                    }else{
                                        that.flageCard = true;
                                    }
                                    if(data.reservedPhoneNo){
                                        that.reservedPhoneNo = me.str.str2char(data.reservedPhoneNo);
                                    }else{
                                        that.flagePhone = true;
                                    }
                                    if(data.bondTransSignStatus==0||data.bondTransSignStatus==null){
                                        that.flageStatus = true;
                                        that.findAccountCartMsgAPI()
                                    }
                                    that.account({
                                        realName: data.realname,
                                        IDcard: data.idCardNo,
                                        isRealNameAuth: data.realNameState,
                                        // isOnCard: data.bankcardState,
                                        bondTransSignStatus: (data.bondTransSignStatus === '0' || data.bondTransSignStatus === null) ? 0 : 1
                                    })
                                }
                            }
                        }
                    }); 
                }
            },
            packageJinDunDate () {
                return new Promise((resolve, reject) => {
                    this.$config.getData({
                        key: 'packageJinDunDate',
                        method: 'post',
                        data: {
                            userId: this.userId,
                            retUrl: this.$config.signcallback,
                        },
                        callback: (data) => {
                            resolve(data)
                        }
                    })
                })
            },
            signValidite () {
                if (this.isOpenedAccount === 0) {
                    this.$vux.confirm.show({
                        title: '请先进行开户！',
                        confirmText: '立即开户',
                        onConfirm: () => {
                            this.$router.push({name: 'realName'})
                        },
                    })
                } else if (this.isOnCard === 0) {
                    this.$vux.confirm.show({
                        title: '请先完成绑卡！',
                        confirmText: '立即绑卡',
                        onConfirm: () => {
                          this.$router.push({name: 'bankcardcg'})
                        },
                      })
                } else if (this.isTransPwd === 0) {
                    this.$vux.confirm.show({
                        title: '请先设置存管账户交易密码！',
                        confirmText: '立即设置',
                        onConfirm: () => {
                          this.$router.push({name: 'pwdChange', params: {type: 'changeSetTrans'}})
                        },
                      })
                } else {
                    return true
                }
                return false
            },
            async autoSignClick () {
                if (this.signValidite()) {
                    this.$vux.loading.show()
                    let { data, errorMsg, result } = await this.packageJinDunDate()
                    this.$vux.loading.hide()
                    if (result === 1) {
                        if (data.result === 'success') {
                            this.$vux.loading.show({
                                text: '跳转中'
                            })
                            formpost(data.TARGET_URL, data.parameters).then(() => {
                            }).catch(() => {
                                this.$vux.loading.hide()
                            })
                        } else {
                            this.$vux.toast.show({
                                type: 'cancel',
                                width: 'auto',
                                text: data.msg
                            })
                        }
                    } else {
                        this.$vux.toast.show({
                          type: 'cancel',
                          width: 'auto',
                          text: errorMsg
                        })
                    }
                }
            },
            logoutUser () {
                this.logout()
                me.cookie.removeItem("userId");
                me.cookie.removeItem("isVip");
                me.cookie.removeItem("phone");
                me.localStorage.clear();
                window.location.reload();
                this.$router.push({name:'/'})
            }
        },
        mounted(){
           this.init();
           this.getDataInit();
        }
    }
</script>

<style lang="less" scoped>
.userSet{
    .ulset{
        margin-bottom:0.5rem;background:#fff;
        li{padding-left:5%;
            label{
                text-align:right;height:1.7rem; overflow:hidden;
            }
            label.imgIcon{
                background:#fff url(../assets/images/g-bankcard-icon01.png) no-repeat right center;
                background-size:0.26rem auto;padding-right:.4rem;
            }
            div{width:100%;padding-right:5%;
                border-bottom:1px solid #e5e5e5;
                height:1.76rem;line-height:1.76rem;
            }
            
        }
        
        
    }
    .foot{
        padding-top:1rem;
    }
    .me-u-btn[data-size=block] {
        font-size: .76rem;
        padding: 0;
        height: 1.76rem;
        line-height: 1.76rem;
        margin-top: .32rem;
        border-radius: 3px;
    }
}
</style>