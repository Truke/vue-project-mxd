<template>
    <div class="bg">
        <input value="IOS 8.0以上版本" class="downloadBtn" type="button" @click="goIos"/>
        <input value="Android4.0以上版本" class="downloadBtn android" type="button" @click="goAndroid"/>
    </div>
</template>

<script>
    export default {
        data(){
            return { 
               
            }
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: false,
                    title: '下载',
                    headFlag: false
                });
            },
            goAndroid(){
                window.location.href = "http://sj.qq.com/myapp/detail.htm?apkName=com.zrminxindai"
            },
            goIos(){
                window.location.href= "http://itunes.apple.com/us/app/min-xin-dai/id1263410899?l=zh&ls=1&mt=8"
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped> 
    .bg{ 
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        background:url(../assets/images/download.jpg) no-repeat center;
        background-size:100%;
    }
    .downloadBtn{
        border:1px solid #ccc;
        width:6rem;
        height:1.8rem;
        font-size:0.38rem;
        border-radius:5px;
        background:none;
        position:absolute;
        left:50%;
        margin-left:-3rem;
        top:15rem;
        color:#fff;
        text-align:center;
    }
    .android{
        top:17.5rem;
    }
</style>