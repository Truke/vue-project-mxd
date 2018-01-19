/**
 * 用户模块
 */
import * as types from '../mutation-types'
import { getData } from '@/lib/config.js'

// initial state
const state = {
  userId: '',//用户userid
  phone: '',//用户手机号
  isVip: '',//0 普通用户 1 vip
  realName: '',//真实姓名
  IDcard: '',//身份证号
  isRealNameAuth: '',//是否实名认证
  isOpenedAccount: '',//是否完成存管开户
  isOnCard: '',//存管账户是否绑卡
  isTransPwd: '',//是否设置存管账户交易密码
  isOldOnCard: '',//旧账户是否绑卡
  isOldTransPwd: '',//是否设置了旧账户交易密码
  bondTransSignStatus: '',//是否开启了自动债转签约
}

// getters
const getters = {
  userId: state => state.userId,
  phone: state => state.phone,
  isVip: state => state.isVip,
  realName: state => state.realName,
  IDcard: state => state.IDcard,
  isRealNameAuth: state => state.isRealNameAuth,
  isOpenedAccount: state => state.isOpenedAccount,
  isOnCard: state => state.isOnCard,
  isTransPwd: state => state.isTransPwd,
  isOldOnCard: state => state.isOldOnCard,
  isOldTransPwd: state => state.isOldTransPwd,
  bondTransSignStatus: state => state.bondTransSignStatus,
}

// actions
const actions = {
  account ({ commit, state }, account) {
    return new Promise((resolve, reject) => {
      commit(types.SET_ACCOUNT, account)
      resolve()
    })
  },
  findAccountCartMsgAPI ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getData({
        key: 'findAccountCartMsg',
        method: 'post',
        data: {
          userId: state.userId
        },
        callback: (data) => {
          if (data.result === 1) {
            commit(types.SET_ACCOUNT, {
              isOpenedAccount: data.data.isOpenedAccount,
              isOnCard: data.data.isOnCard,
              isTransPwd: data.data.isTransPwd,
              bondTransSignStatus: (!data.data.bondTransSignStatus ? 0 : 1)
            })
          }
          resolve(data)
        }
      })
    })
  },
  findOnlyOneCardInfoAPI ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getData({
        key: 'findOnlyOneCardInfo',
        method: 'post',
        data: {
          userId: state.userId
        },
        callback: (data) => {
          if (data.result === 1) {
            commit(types.SET_ACCOUNT, {
              isOldOnCard: data.data.result
            })
          }
          resolve(data)
        }
      })
    })
  },
  checkPayPasswordAPI ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getData({
        key: 'checkPayPassword',
        method: 'post',
        data: {
          userId: state.userId
        },
        callback: (data) => {
          if (data.result === 1) {
            commit(types.SET_ACCOUNT, {
              isOldTransPwd: data.data.result === '0' ? 0 : 1
            })
          }
          resolve(data)
        }
      })
    })
  },
  logout ({ commit, state }) {
    commit(types.RESET_STATE)
  }
}

// mutations
const mutations = {
  [types.SET_ACCOUNT] (state, data) {
    Object.assign(state, data)
  },
  [types.RESET_STATE] (state) {
    state.userId = ''
    state.phone = ''
    state.isVip = ''
    state.realName = ''
    state.IDcard = ''
    state.isRealNameAuth = ''
    state.isOpenedAccount = ''
    state.isOnCard = ''
    state.isTransPwd = ''
    state.isOldOnCard = ''
    state.isOldTransPwd = ''
    state.bondTransSignStatus = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}