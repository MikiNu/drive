import {
  GET_WAYBILLS, GET_DRIVER, PATCH_WAYBILLS,
} from '../actions/waybills.js'
import Vue from 'vue'
import {SET_RESPONSE_SERVER} from '../actions/response-server'

const state = {
  waybills: '',
  driver: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')).user.fullname : '',
}

const getters = {
  waybills: state => state.waybills,
  driver: state => state.driver,
}

const actions = {
  [GET_WAYBILLS]: ({
                     commit,
                     dispatch,
                     rootGetters,
                   }) => {
    return new Promise((resolve, reject) => {
      //запрос данных с сервера
      Vue.http.get(rootGetters.urlServer + 'waybills?offset=&limit=30').then(response => {
        //вызов мутации установления заявок
        commit(GET_WAYBILLS, response.body)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  [GET_DRIVER]: ({
                   commit,
                   dispatch, // eslint-disable-line no-unused-vars
                 }, data) => {
    return new Promise((resolve) => {
      commit(GET_DRIVER, data)
      resolve()
    })
  },
  //обновление позиции товара
  [PATCH_WAYBILLS]: ({
                       dispatch,
                       rootGetters,
                     }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.patch(rootGetters.urlServer + 'waybills/' + data.id, {...data.waybill}).then(response => {
        dispatch(GET_WAYBILLS)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },

}

const mutations = {
  [GET_WAYBILLS]: (state, data) => {
    state.waybills = data
  },
  [GET_DRIVER]: (state, driverFio) => {
    state.driver = driverFio
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
