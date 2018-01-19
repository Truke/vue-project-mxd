/**
 * 全局action处理
 */

import * as types from './mutation-types'

/**
 * 设置页面头部
 */
export const setPageHead = ({ commit }, data) => {
  commit(types.SET_PAGE_HEAD, data)
}

/**
 * 重置STORE
 */
export const resetStore = ({ commit }) => {
  commit(types.RESET_STATE)
}
