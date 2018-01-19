<template>
    <div class="newGuide">
        <div class="fullpage-container">
            <div class="fullpage-wp" v-fullpage="opts">
                <div class="page-1 page">
                    <p class="part-1" v-animate="{value: 'zoomInDown',delay: 0}">
                        <img src="../assets/images/newGuide/t1.png" alt="">              
                    </p>
                    <p class="part-2" v-animate="{value: 'bounceInLeft', delay: 600}">
                        <img src="../assets/images/newGuide/img1.png" alt="">
                    </p>
                    <p class="part-3" v-animate="{value: 'bounceInRight', delay: 1200}">
                        <img src="../assets/images/newGuide/img2.png" alt="">
                    </p>
                     <p class="part-4 arrow">
                        <img src="../assets/images/newGuide/arrow.png" alt="">
                    </p>
                </div>
                <div class="page-2 page">
                    <p class="part-1" v-animate="{value: 'zoomInDown',delay: 0}">
                        <img src="../assets/images/newGuide/t2.png" alt="">
                    </p>
                    <p class="part-2" v-animate="{value: 'rollIn', delay: 500}">
                        <img src="../assets/images/newGuide/img3.png" alt="">
                    </p>
                    <p class="part-3" v-animate="{value: 'bounceInUp', delay: 1000}">
                        <img src="../assets/images/newGuide/img4.png" alt="">
                    </p>      
                    <p class="part-5" v-animate="{value: 'fadeIn', delay: 1500}">
                        <i>*</i>旧账户充值帮助请在帮助中心查看详细流程或拨打客服电话400-044-3888
                    </p>
                    <p class="part-4 arrow">
                        <img src="../assets/images/newGuide/arrow.png" alt="">
                    </p>
                </div>
                <div class="page-3 page">
                    <p class="part-1" v-animate="{value: 'zoomInDown',delay: 0}">
                        <img src="../assets/images/newGuide/t3.png" alt="">              
                    </p>
                    <p class="part-2" v-animate="{value: 'bounceInDown', delay: 500}">
                        <img src="../assets/images/newGuide/img5.png" alt="">
                    </p>
                    <p class="part-3" v-animate="{value: 'zoomIn', delay: 1000}">
                        <img src="../assets/images/newGuide/img6.png" alt="">
                    </p>
                    <p class="part-5"  v-animate="{value: 'fadeIn', delay:1500}">
                        <i>*</i>您投资的标，在融资满额后，复审通过，会生成借款协议，并开始计息，投资完成
                    </p>
                     <p class="part-4 arrow">
                        <img src="../assets/images/newGuide/arrow.png" alt="">
                    </p>
                </div>
                <div class="page-4 page">
                    <p class="part-1" v-animate="{value: 'zoomInDown',delay: 0}">
                        <img src="../assets/images/newGuide/t4.png" alt="">              
                    </p>
                    <p class="part-2" v-animate="{value: 'rotateIn', delay: 600}">
                        <img src="../assets/images/newGuide/img7.png" alt="">
                    </p>
                    <p class="part-3" v-animate="{value: 'fadeIn', delay: 1200}">
                        <img src="../assets/images/newGuide/img8.png" alt="">
                    </p>
                    <p class="part-4" v-animate="{value: 'bounceInUp', delay: 1300}">
                        <img src="../assets/images/newGuide/btn.png" alt="" @click="goTo">
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'newGuide',
        data(){
            return {
                 opts: {
                    start: 0,
                    dir: 'v',
                    loop: false,
                    duration: 300         
                 }
            }
        },
        methods:{
            init(){
                this.$store.dispatch('setPageHead', {
                    show: false,
                    title: '新手引导',
                    headFlag: false
                });
            },
            goTo(){
                this.$root.goUrl("invest");
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    .fullpage-container{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow:hidden;
    }
    .arrow{
        -webkit-animate:arrow 2s infinite;
        animation:arrow 2s infinite;
    }
    @-webkit-keyframes arrow{
        0% {
            -webkit-transform: translate(0, -10px);
            opacity: 0;
        }
        50% {
            -webkit-transform: translate(0, 0);
		    opacity: 1;
        }
        100% {
           -webkit-transform: translate(0, 10px);
            opacity: 0;
        }
    }
     @keyframes arrow{
        0% {
            -webkit-transform: translate(0, -10px);
            opacity: 0;
        }
        50% {
            -webkit-transform: translate(0, 0);
		    opacity: 1;
        }
        100% {
           -webkit-transform: translate(0, 10px);
            opacity: 0;
        }
    }
    .page{
        color:#999;
        display:block;
        text-align:center;  
        background:url(../assets/images/newGuide/z-bg.jpg) repeat #fff; 
        .part-1 img{width:7.7rem;height:2.04rem; margin:.5rem 0;}
        .part-2,.part-3{
            img{width:13.64rem; min-height:5rem; margin-bottom:.5rem;}
        }
        &.page-4 .part-4{
            img{width:5.96rem;height:1.94rem;margin-bottom:1rem;}
        }
        .part-5{ width:80%; margin:0 auto;
            i{color:#ee582d;}
        }
    }
</style>