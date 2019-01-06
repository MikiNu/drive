import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth.js'
import setting from './modules/setting.js'
import waybills from './modules/waybills.js'
import orders from './modules/orders.js'
import elements from './modules/elements.js'
import mixedPayments from './modules/mixed-payments.js'
import responseServer from './modules/response-server.js'

Vue.use(Vuex)

//const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  //используемые модули
  modules: {
    auth,
    setting,
    waybills,
    orders,
    elements,
    mixedPayments,
    responseServer
  },
})
