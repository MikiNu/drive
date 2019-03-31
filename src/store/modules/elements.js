import {
  GET_ORDERS_ELEMENT, POST_ORDER_ELEMENT, PATCH_ORDER_ELEMENT,
} from '../actions/elements.js'
import Vue from 'vue'
import {GET_ORDERS} from '../actions/orders'
import {SET_RESPONSE_SERVER} from '../actions/response-server'

const state = {
  elements: '',
}

const getters = {
  elements: state => state.elements,
}

const actions = {
  //получения изменений заказов
  [GET_ORDERS_ELEMENT]: ({
                           commit,
                           dispatch,
                           rootGetters,
                         }, order) => {
    return new Promise((resolve, reject) => {
      //запрос данных с сервера
      Vue.http.get(rootGetters.urlServer + 'orderelementchanges?order=' + order).then(response => {
        //вызов мутации установления измененных заказов
        commit(GET_ORDERS_ELEMENT, response.body)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //создание изменения у заказа
  [POST_ORDER_ELEMENT]: ({
                           dispatch,
                           rootGetters,
                         }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.post(rootGetters.urlServer + 'orderelementchanges', {...data.item}).then(response => {
        dispatch(GET_ORDERS)
        dispatch(GET_ORDERS_ELEMENT, data.order)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //обновления существующего изменения у заказа
  [PATCH_ORDER_ELEMENT]: ({
                            dispatch,
                            rootGetters,
                          }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.patch(rootGetters.urlServer + 'orderelementchanges/' + data.id, {...data.item}).then(response => {
        dispatch(GET_ORDERS)
        dispatch(GET_ORDERS_ELEMENT, data.order)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
}

const mutations = {
  [GET_ORDERS_ELEMENT]: (state, data) => {
    state.elements = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
