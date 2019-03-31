import Vue from 'vue'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import App from './app.vue'
import router from './router/router.js'
import store from './store/store.js'
import Icon from 'vue-awesome/components/Icon.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons'
import {AUTH_LOGOUT} from './store/actions/auth'
import {SET_RESPONSE_SERVER} from './store/actions/response-server'
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

//устанавливаем плагины
Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(CxltToastr, {
  position: 'top right',
  showDuration: 100,
})
//регистрируем глобальный компонент
Vue.component('v-icon', Icon)

Vue.config.productionTip = false
//глобальная установка заголовков для HTTP-запросов
Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.headers.common['x-api-token'] = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')).token : ''
//перехват ответа с ошибкой
Vue.http.interceptors.push(function () {
  return function (response) {
    if (response.status === 403) {
      store.dispatch(AUTH_LOGOUT)
      router.push('/login')
    } else if (response.status === 0) {
      store.dispatch(SET_RESPONSE_SERVER, false)
    }
  }
})

export default new Vue({
  el: '#app',
  router,
  store,
  components: {
    App,
  },
  template: '<App/>',
})
