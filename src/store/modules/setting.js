import {SET_SAVE, SETTING} from '../actions/setting.js'

const state = {
  urlServer: localStorage.getItem('urlServer') || '',
  isSetting: false,
}

const getters = {
  isSetting: state => state.isSetting,
  urlServer: state => state.urlServer,
}
const actions = {
  [SET_SAVE]: ({
                 commit,
               }, data) => {
    return new Promise((resolve) => {
      commit(SET_SAVE, data)
      localStorage.setItem('urlServer', data)
      resolve()
    })
  },
}

const mutations = {
  [SET_SAVE]: (state, data) => {
    state.urlServer = data
  },
  [SETTING]: (state, flag) => {
    state.isSetting = !!flag
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
