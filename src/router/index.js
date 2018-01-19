import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

//
import main from '@/view/main'

//登录\注册\找回登录密码\首页 \成功找回密码
import login from '@/view/login' 
import register from '@/view/register' 
import registerxieyi from '@/view/registerxieyi'
import pwdLogin from '@/view/pwdLogin' 
import index from '@/view/index' 
import pwdSud from '@/view/pwdSud' 
//投资
//投资列表\投资标详情\投资交易（购买）\投资成功\投资分享注册
import invest from '@/view/invest' 
import investdetail from '@/view/investdetail' 
import buy from '@/view/buy' 
import couponCanuse from '@/view/couponCanuse'
import couponNotCanuse from '@/view/couponNotCanuse'
import buyStatus from '@/view/buyStatus'
//import sudInvest from '@/view/sudInvest' 
//import regShare from '@/view/regShare'

//我的
//账户首页\待收总额\昨日收益\累计收益\可用余额
import ucenter from '@/view/ucenter'
import collect from '@/view/collect'
import yesterday from '@/view/yesterday'
import cumulative from '@/view/cumulative'
import available from '@/view/available'

//个人设置\实名\预留手机号\绑卡
import userSet from '@/view/userSet'
import realName from '@/view/realName'
import realNameSuccess from '@/view/realNameSuccess'
import reservedOld from '@/view/reservedOld'
import reserved from '@/view/reserved'
import bankcardOld from '@/view/bankcardOld'
import bankcard from '@/view/bankcard'
import bankcardcg from '@/view/bankcardcg'

//密码设置
import pwdMassage from '@/view/pwdMassage'
import pwdChange from '@/view/pwdChange'
import pwdSetOld from '@/view/pwdSetOld'
import pwdChangeLogin from '@/view/pwdChangeLogin'

//充值-
import recharge from '@/view/recharge'
import limitForm from '@/view/limitForm'
import alipayExplain from '@/view/alipayExplain'
import bankExplain from '@/view/bankExplain'

//投资管理-
import investManage from '@/view/investManage'
import investManageDetails from '@/view/investManageDetails'

//我的券\邀请好友\邀请记录
import coupon from '@/view/coupon'
import invite from '@/view/invite'
import inviteRecord from '@/view/inviteRecord'
import inviteSc from '@/view/inviteSc'
//下载
import download from '@/view/download'
import newGuide from '@/view/newGuide'
//存管开户协议
import agreementcg from '@/view/agreementcg'
import agreementjxcg from '@/view/agreementjxcg'

Vue.use(Router)
const router = new Router({
  routes: [
    /*登录\注册\找回登录密码\首页 - 路径配置*/
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/registerxieyi',
      name: 'registerxieyi',
      component: registerxieyi
    },
    {
      path: '/pwdLogin',
      name: 'pwdLogin',
      component: pwdLogin,
    },
    {
      path: '/pwdSud',
      name: 'pwdSud',
      component: pwdSud,
    },
    {
      path: '/',
      component: main,
      children: [
        {
          path: '',
          name: 'index',
          component: index
        },
        {
          path: 'invest',
          name: 'invest',
          component: invest,
          meta: { keepAlive: true },
        },
        {
          path: 'ucenter',
          name: 'ucenter',
          component: ucenter,
          meta: { requiresAuth: true }
        }
      ]
    },
    /*投资列表\投资标详情\投资交易（购买）\投资成功\投资分享注册-路径配置*/
    {
      path: '/invest/detail/:borrowType/:borrowId/:depositoryId',
      name: 'investdetail',
      component: investdetail
    },
    {
      path: '/buy/:borrowType/:borrowId/:depositoryId',
      name: 'buy',
      component: buy,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/buy/:borrowType/:borrowId/:depositoryId/:money/couponCanuse',
          name: 'couponCanuse',
          component: couponCanuse,
          meta: { requiresAuth: true }
        },
        {
          path: '/buy/:borrowType/:borrowId/:depositoryId/:money/couponNotCanuse',
          name: 'couponNotCanuse',
          component: couponNotCanuse,
          meta: { requiresAuth: true }
        },
      ]
    },
    {
      path: '/buy/:borrowType/:borrowId/:depositoryId/buyStatus',
      name: 'buyStatus',
      component: buyStatus,
      meta: { requiresAuth: true }
    },

   //账户首页\待收总额\昨日收益\累计收益\可用余额
    {
      path: '/collect',
      name: 'collect',
      component: collect,
      meta: { requiresAuth: true }
    },
    {
      path: '/yesterday',
      name: 'yesterday',
      component: yesterday,
      meta: { requiresAuth: true }
    },
    {
      path: '/cumulative',
      name: 'cumulative',
      component: cumulative,
      meta: { requiresAuth: true }
    },
    {
      path: '/available',
      name: 'available',
      component: available,
      meta: { requiresAuth: true }
    },
    //个人设置\实名\预留手机号\密码管理\未银行卡\绑卡旧账户\存管、绑卡完成
     {
      path: '/userSet',
      name: 'userSet',
      component: userSet,
      meta: { requiresAuth: true }
    },

     {
      path: '/realName',
      name: 'realName',
      component: realName,
      meta: { requiresAuth: true }
    },
    {
      path: '/realNameSuccess',
      name: 'realNameSuccess',
      component: realNameSuccess,
      meta: { requiresAuth: true }
    },
    {
      path: '/reservedOld',
      name: 'reservedOld',
      component: reservedOld,
      meta: { requiresAuth: true },
    },
    {
      path: '/reserved',
      name: 'reserved',
      component: reserved,
      meta: { requiresAuth: true }
    },
    {
      path: '/bankcardOld',
      name: 'bankcardOld',
      component: bankcardOld,
      meta: { requiresAuth: true }
    },
    {
      path: '/bankcardcg',
      name: 'bankcardcg',
      component: bankcardcg,
      meta: { requiresAuth: true }
    },
    {
      path: '/bankcard',
      name: 'bankcard',
      component: bankcard,
      meta: { requiresAuth: true }
    },
    //密码管理
    {
      path: '/pwdMassage',
      name: 'pwdMassage',
      component: pwdMassage,
      meta: { requiresAuth: true }
    },
    {
      path: '/pwdMassage/pwdChange/:type',
      name: 'pwdChange',
      component: pwdChange,
      meta: { requiresAuth: true }
    },{
      path: '/pwdMassage/pwdChange/:type/pwdChangeLogin',
      name: 'pwdChangeLogin',
      component: pwdChangeLogin,
      meta: { requiresAuth: true }
    },
    {
      path: '/pwdMassage/pwdChange/:type/pwdSetOld',
      name: 'pwdSetOld',
      component: pwdSetOld,
      meta: { requiresAuth: true }
    },

     //充值
    {
      path: '/recharge/:type/:back',
      name: 'recharge',
      component: recharge,
      meta: { requiresAuth: true }
    },
    {
      path: '/limitForm',
      name: 'limitForm',
      component: limitForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/alipayExplain',
      name: 'alipayExplain',
      component: alipayExplain,
      meta: { requiresAuth: true }
    },
    {
      path: '/bankExplain',
      name: 'bankExplain',
      component: bankExplain,
      meta: { requiresAuth: true }
    }, 
    //投资管理
    {
      path: '/investManage',
      name: 'investManage',
      component: investManage,
      meta: { requiresAuth: true }
    },
    {
      path: '/investManageDetails',
      name: 'investManageDetails',
      component: investManageDetails,
      meta: { requiresAuth: true }
    },
    //我的券\邀请好友
    {
      path: '/coupon',
      name: 'coupon',
      component: coupon,
      meta: { requiresAuth: true }
    },
    //存管协议
    {
      path: '/agreementjxcg',
      name: 'agreementjxcg',
      component: agreementjxcg,
    },
    {
      path: '/agreementcg',
      name: 'agreementcg',
      component: agreementcg,
    },
    //下载
    {
      path: '/download',
      name: 'download',
      component: download
    },
    {
      path: '/invite',
      name: 'invite',
      component: invite,
      meta: { requiresAuth: true }
    },
    {
      path: '/inviteRecord',
      name: 'inviteRecord',
      component: inviteRecord,
      meta: { requiresAuth: true }
    },
    {
      path: '/inviteSc',
      name: 'inviteSc',
      component: inviteSc,
      meta: { requiresAuth: true }
    },
    {
      path: '/newGuide',
      name: 'newGuide',
      component: newGuide
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// // 路由钩子：每个路由开始前处理
router.beforeEach((to, from, next) => {
  if (!document.cookie.includes('userId')) {
    store.dispatch('logout')
  }
  // 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.userId) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

// // 路由钩子：每个路由结束后处理
// router.afterEach(route => {
//   // window.scrollTo(0, 0)
//   store.dispatch('setPageProgress', 100)
// })

export default router
