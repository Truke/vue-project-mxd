/**
 * 全局mutation处理
 */

import * as types from './mutation-types'

export const state = {
  headData: {
    show: true,
    title: '',
    headFlag: true,
  },
}

export const mutations = {
  // 设置页面头部
  [types.SET_PAGE_HEAD] (state, data) {
    state.headData = data
    document.title = /micromessenger/i.test(navigator.userAgent) ? '民信贷' : data.title
  },
  // 重置state
  [types.RESET_STATE] (state) {
    state = {}
  }
}
