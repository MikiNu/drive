import {GET_ORDER, GET_ORDERS, POST_ORDER, PATCH_ORDER} from '../actions/orders.js'
import Vue from 'vue'
import {SET_RESPONSE_SERVER} from "../actions/response-server";

const state = {
  ordersChange: '',
}

const getters = {
  ordersChange: state => state.ordersChange,
}

const actions = {
  //получения изменений заказов
  [GET_ORDERS]: ({
                     commit,
                     dispatch,
                     rootGetters
                   }) => {
    return new Promise((resolve, reject) => {
      //запрос данных с сервера
      Vue.http.get(rootGetters.urlServer+'orderchanges?offset=&limit=100').then(response => {
        //вызов мутации установления измененных заказов
        commit(GET_ORDERS, response.body)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //получение изменений по конкретному заказу
  [GET_ORDER]: ({
                   commit,
                   dispatch,
                   rootGetters
                 }, order) => {
    return new Promise((resolve, reject) => {
      //запрос данных с сервера
      Vue.http.get(rootGetters.urlServer+'orderchanges/' + order).then(response => {
        //вызов мутации установления измененных заказов
        commit(GET_ORDERS, response.body)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //создание изменения у заказа
  [POST_ORDER]: ({
                    dispatch,
                    rootGetters
                  }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.post(rootGetters.urlServer+'orderchanges', {...data}).then(response => {
        dispatch(GET_ORDERS)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        reject(response)
      })
    })
  },
  //обновление существующих изменений у заказа
  [PATCH_ORDER]: ({
                    dispatch,
                    rootGetters
                  }, data) => {
    return new Promise((resolve, reject) => {
      Vue.http.patch(rootGetters.urlServer+'orderchanges/' + data.id, {...data.order}).then(response => {
        dispatch(GET_ORDERS)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, () => {
        reject('PATCH_ERROR')
      })
    })
  },
}

const mutations = {
  [GET_ORDERS]: (state, data) => {
    state.ordersChange = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
