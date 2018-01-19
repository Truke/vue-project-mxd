// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'
import config from './lib/config.js'
import 'vue-fullpage/vue-fullpage.css'
import VueFullpage from 'vue-fullpage'

Vue.use(VueFullpage)

Vue.prototype.$config = config;
// 引入项目的模块组件
import indexList from './components/indexList'

import myHeader from './components/myHeader'

import footer from './components/footer'

import myCoupon from './components/myCoupon'
import myCouponRed from './components/myCouponRed'
import bankcardState from './components/bankcardState'
//注册模板
Vue.component('index-list', indexList)
Vue.component('my-header', myHeader)
Vue.component('my-footer', footer)
Vue.component('my-coupon', myCoupon)
Vue.component('my-coupon-red', myCouponRed)
Vue.component('bankcard-state', bankcardState)
Vue.filter('my-filter', function (value) {
    return me.validate.money(value+'',{decimal: true});
});
Vue.use(IScrollView, IScroll)
Vue.config.productionTip = false

/**/
import { ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  methods: {
    goUrl: function(url,data){
      if (this.$router) {
        if(data){
            this.$router.push({ path: url, query: data});
        }else{
            this.$router.push(url);
        }
      }
    }
  }
})

