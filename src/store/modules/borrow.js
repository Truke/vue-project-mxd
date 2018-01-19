/**
 * 用户模块
 */
import * as types from '../mutation-types'
import { getData } from '@/lib/config.js'

// active state
const state = {
  borrowTitle: '',
  amount: '',
  moneyInputValue: '',//标详情页输入金额
  accountExplain: '',//提示信息
  annualRate: '',
  borrowId: '',
  borrowType: '',
  depositoryId: '',
  investAccount: '',
  loanPeriod: '',
  repaymentType: '',
  loanPeriodType: '',
  investMsg: '',
  investimgUrl: '',
  selectTicket: '',
  minAmount: '',//起投金额
}

// getters
const getters = {
  borrowTitle: state => state.borrowTitle,
  amount: state => state.amount,
  moneyInputValue: state => state.moneyInputValue,
  accountExplain: state => state.accountExplain,
  annualRate: state => state.annualRate,
  borrowId: state => state.borrowId,
  borrowType: state => state.borrowType,
  depositoryId: state => state.depositoryId,
  investAccount: state => state.investAccount,
  loanPeriod: state => state.loanPeriod,
  repaymentType: state => state.repaymentType,
  loanPeriodType: state => state.loanPeriodType,
  investMsg: state => state.investMsg,
  investimgUrl: state => state.investimgUrl,
  selectTicket: state => state.selectTicket,
  minAmount: state => state.minAmount,
}

// actions
const actions = {
  borrowinfo ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      commit(types.SET_BORROW_INFO, data)
      resolve()
    })
  },
  getBorrowIdInfoAPI ({ commit, state }) {
    let d = {}
    d[(state.borrowType === '1' || state.borrowType === '4') ? 'borrowId' : 'borrowSetId'] = state.borrowId
    let e = Object.assign( d, state.depositoryId === '0' ? {} : { depositoryId: state.depositoryId })
    return new Promise((resolve, reject) => {
      getData({
        key: (state.borrowType === '1' || state.borrowType === '4') ? 'findBorrowInfo' : 'findBorrowSetInfo',
        method: 'post',
        data: e,
        callback: (data) => {
          if (data.result === 1) {
            commit(types.SET_BORROW_INFO, {
              borrowTitle: data.data.title || data.data.planDesc,
              amount: (state.borrowType === '1' || state.borrowType === '4') ? data.data.amount : data.data.planAmount,
              accountExplain: data.data.accountExplain.replace('连连', state.borrowType === '1' ? '存管' : '旧'),
              annualRate: data.data.annualRate,
              investAccount: (state.borrowType === '1' || state.borrowType === '4') ? data.data.investAccount : data.data.investedAmount,
              loanPeriod: data.data.loanPeriod,
              repaymentType: data.data.repaymentType,
              loanPeriodType: data.data.loanPeriodType,
              minAmount: (state.borrowType === '1' || state.borrowType === '4') ? data.data.initAmount : data.data.minAmount,
            })
          }
          resolve(data)
        }
      })
    })
  },
  checkBorrowIdStatusAPI ({ commit, state }, data) {
    let d = {}
    d[(state.borrowType === '1' || state.borrowType === '4') ? 'borrowId' : 'borrowSetId'] = state.borrowId
    let e = Object.assign( d, state.depositoryId === '0' ? {} : { depositoryId: state.depositoryId })
    return new Promise((resolve, reject) => {
      getData({
        key: (state.borrowType === '1' || state.borrowType === '4') ? 'checkBorrowStatus' : 'checkBorrowSetStatus',
        method: 'post',
        data: e,
        callback: (data) => {
          resolve(data)
        }
      })
    })
  },
  clearborrow ({ commit, state }, data) {
    commit(types.RESET_BORROW_STATE)
  }
}

// mutations
const mutations = {
  [types.SET_BORROW_INFO] (state, data) {
    Object.assign(state, data)
  },
  [types.RESET_BORROW_STATE] (state) {
    state.borrowTitle = ''
    state.amount = ''
    state.moneyInputValue = ''
    state.accountExplain = ''
    state.annualRate = ''
    state.borrowId = ''
    state.borrowType = ''
    state.depositoryId = ''
    state.investAccount = ''
    state.loanPeriod = ''
    state.repaymentType = ''
    state.loanPeriodType = ''
    // state.investMsg = ''
    // state.investimgUrl = ''
    state.selectTicket = ''
    state.minAmount = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}