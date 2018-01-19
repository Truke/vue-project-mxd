<template>
    <div class="realName">
        <div class="success">
            <img src="../assets/images/z_bg.jpg" alt=""/>    
            <ul>
                <li data-wrap="layout">
                    <label data-item="col-3">真实姓名</label>
                    <span data-item="col-9">{{realData.name}}</span>
                </li>
                <li data-wrap="layout">
                    <label data-item="col-3">身份证号</label>
                    <span data-item="col-9">{{realData.idCard | newCard}}</span>
                </li>
                <li data-wrap="layout">
                    <label data-item="col-3">审核状态</label>
                    <span data-item="col-9">通过</span>
                </li>
            </ul>
        </div>     
    </div>
</template>

<script>
    export default {
        data(){
            return {
                realData:{
                   name:"",
                   idCard:""
                }   
            }
        },
        filters:{
            newCard (value) {
                return me.str.str2char(value,3,11,'*');
            } 
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: true,
                    title: '实名认证',
                    headFlag: true
                })
            },
           getRealInfo(){
                var $this = this;
                $this.$config.getData({
                    key:'findAccountMsg',
                    method:'post',
                    data:{
                        userId : me.cookie.getItem("userId") || ""
                    },
                    callback:function(data){
                        if(data.result == '1'){
                            var data = data.data;
                            if(data.result == "1"){
                                $this.realData.name = data.personalInfoVo.realname;
                                $this.realData.idCard = data.personalInfoVo.idCardNo;
                            }                        
                        }
                    }
                });
           }
        },
        mounted(){
            this.init();
            this.getRealInfo();
        }
    }
</script>

<style lang="less" scoped>
    .success{
        img{width:100%;height:100%;}
        ul{
            background:#fff;
            li{
                height:1.6rem;
                line-height:1.6rem; 
                padding:0 .5rem;
                border-bottom:1px solid #f3f3f3;
            }
            span{text-align:right;}
         }
    }
</style>