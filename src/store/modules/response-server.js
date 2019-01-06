import {
  SET_RESPONSE_SERVER,
} from '../actions/response-server.js'


const state = {
  responseServer: true,
}

const getters = {
  responseServer: state => state.responseServer
}

const actions = {
  [SET_RESPONSE_SERVER]: ({
                 commit,
               }, data) => {
    return new Promise((resolve) => {
      // вызываем мутацию изменения значения в хранилище
      commit(SET_RESPONSE_SERVER, data)
      resolve()
    })
  },
}

const mutations = {
  [SET_RESPONSE_SERVER]: (state, data) => {
    state.responseServer = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
