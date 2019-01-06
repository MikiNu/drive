import {
  GET_MIXED_PAYMENTS, POST_MIXED_PAYMENTS, PATCH_MIXED_PAYMENTS, DELETE_MIXED_PAYMENTS
} from '../actions/mixed-payments.js'
import Vue from 'vue'
import {SET_RESPONSE_SERVER} from "../actions/response-server";

const state = {
  mixedPayments: '',
}

const getters = {
  mixedPayments: state => state.mixedPayments,
}

const actions = {
  //получения данных о смешанном платеже по заказу
  [GET_MIXED_PAYMENTS]: ({
                   commit,
                   dispatch,
                   rootGetters
                 }, order) => {
    return new Promise((resolve, reject) => {
      //запрос данных с сервера
      Vue.http.get(rootGetters.urlServer+'orderchangesmixedpayments/'+order).then(response => {
        //вызов мутации установления измененных заказов
        commit(GET_MIXED_PAYMENTS, response.body)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //создание смешанного платежа у заказа
  [POST_MIXED_PAYMENTS]: ({
                   dispatch,
                   rootGetters
                 }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.post(rootGetters.urlServer+'orderchangesmixedpayments', {...data}).then(response => {
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //обновления существующих данных смешанного платежа у заказа
  [PATCH_MIXED_PAYMENTS]: ({
                    dispatch,
                    rootGetters
                  }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.patch(rootGetters.urlServer+'orderchangesmixedpayments/'+data.order, {...data.payment}).then(response => {
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //удаление данных смешанного платежа у заказа
  [DELETE_MIXED_PAYMENTS]: ({
                             dispatch,
                             rootGetters
                           }, order) => {
    return new Promise((resolve, reject) => {
      Vue.http.patch(rootGetters.urlServer+'orderchangesmixedpayments/'+order).then(response => {
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
}

const mutations = {
  [GET_MIXED_PAYMENTS]: (state, data) => {
    state.mixedPayments = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
