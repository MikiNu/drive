import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from '../actions/auth.js'
import {GET_DRIVER,
  //GET_WAYBILLS
} from '../actions/waybills.js'
import Vue from 'vue'
import {SET_RESPONSE_SERVER} from '../actions/response-server'

// инициализируем состояние
const state = {
  token: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')).token : '',
  status: localStorage.getItem('data') ? 'success' : '',
  hasLoadedOnce: false,
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({
                     commit,
                     dispatch,
                     rootGetters,
                   }, data) => {
    return new Promise((resolve, reject) => {
      //вызываем мутацию-статус закрузки
      commit(AUTH_REQUEST)
      //делаем запрос авторизации на сервер
      Vue.http.post(rootGetters.urlServer + 'login', {...data}).then(response => {
        //устанавливаем полученный данных в localStorage
        localStorage.setItem('data', JSON.stringify(response.body))
        //изменение глобального заголовка для HTTP-запросов
        Vue.http.headers.common['x-api-token'] = JSON.parse(localStorage.getItem('data')).token
        //вызываем мутацию-статус успеха
        commit(AUTH_SUCCESS, response.body)
        //вызываем action по установлению ФИО водителя в состояние хранилища
        dispatch(GET_DRIVER, response.body.user.fullname)
        //вызываем action на получение массива путевок в хранилище
        // dispatch(GET_WAYBILLS)
        dispatch(SET_RESPONSE_SERVER, true)
        resolve(response.body)
      }, response => {
        //вызываем мутацию-статус ошибки
        commit(AUTH_ERROR, response)
        //удаляем токен из кук
        localStorage.removeItem('data')
        reject(response)
      })
    })
  },
  // выход
  [AUTH_LOGOUT]: ({
                    commit,
                  }) => {
    return new Promise((resolve) => {
      // вызываем мутацию изменения значения токена в хранилище
      commit(AUTH_LOGOUT)
      // очищаем токен
      localStorage.removeItem('data')
      resolve()
    })
  },
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
    state.status = ''
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
