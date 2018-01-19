import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as actions from './actions'
import * as getters from './getters'
import { state, mutations } from './mutations'
import account from './modules/account'
import borrow from './modules/borrow'

Vue.use(Vuex)

let isDebugMode = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    account,
    borrow,
  },
  strict: isDebugMode,
  plugins: [createPersistedState()],
})

export default store