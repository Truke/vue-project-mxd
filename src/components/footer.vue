<template>
    <div class="footer">
        <ul>
            <li v-for="(item,index) in footerList" :key="index">
                <dl @click="goTo(item.icon_url,index)">
                    <dt><img :src="cur===index?item.pic_url_sel:item.pic_url" alt=""></dt>
                    <dd :style="{color:cur===index?'#fe6f07':''}">{{item.title}}</dd>
                </dl>
            </li>  
        </ul>
    </div>
</template>

<script>
    export default{
         data () {
            return {
                cur: 0,
                footerList:[
                    {pic_url:require('@/assets/images/ficon1.png'),pic_url_sel:require('@/assets/images/ficon4.png'),icon_url:'/',title:'首页'},
                    {pic_url:require('@/assets/images/ficon2.png'),pic_url_sel:require('@/assets/images/ficon5.png'),icon_url:'invest',title:'投资'},
                    {pic_url:require('@/assets/images/ficon3.png'),pic_url_sel:require('@/assets/images/ficon6.png'),icon_url:'ucenter',title:'我的'},
                ],
            }
        },
        watch: {
            '$route' (route) {
                this.refresh(route)
            }
        },
        methods:{
            refresh (route) {
                this.cur = ['index', 'invest', 'ucenter'].indexOf(route.name)
            },
            goTo(url,index){
                this.cur = index
                this.$emit("goTo",url);
            }
        },
        mounted () {
            this.refresh(this.$route)
        }
    }

</script>

<style lang="less" scoped>
.footer{
        width:100%;
        height:2rem;
        text-align: center;
        background:#f6f7f7;
        color:#5d5d5b;
        padding-top:.15rem;
        ul{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: space-around;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            li dl{
                color: #5f646e;
                text-align: center;
                img{
                    display: inline-block;
                    width: .84rem;
                    height:.86rem;
                }
                dd{
                    height:1rem;
                    line-height:1rem;
                    overflow:hidden;
                    font-size:.4rem;
                }
            }
        }
    }
    .fixed{
        position: fixed;
        bottom:0;
        z-index: 999;
    }
    </style>