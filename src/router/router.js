import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home.vue'
import Login from '../components/login.vue'
import Setting from '../components/setting.vue'
import Orders from '../components/orders.vue'
import OrderItems from '../components/order-items.vue'
import {GET_WAYBILLS} from '../store/actions/waybills.js'
import {GET_ORDERS} from '../store/actions/orders.js'
import store from '../store/store.js'

Vue.use(Router)

//проверка НЕ авторизирован ли пользователь
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    //переход к следующему хуку в цепочке
    next()
    return
  }
  //перенаправление на другой маршрут
  next('/')
}

//проверка авторизирован ли пользователь
const ifAuthenticated = (to, from, next) => {

  //если авторизирован
  if (store.getters.isAuthenticated) {
    //если существует адрес сервера и массив путевок пуст
    if ((store.getters.urlServer !== '') && (store.getters.waybills === '')) {
      //вызываем action на получение путевых листов
      store.dispatch(GET_WAYBILLS)
      store.dispatch(GET_ORDERS)
    }
    //переход к следующему хуку в цепочке
    next()
    return
  }
  //перенаправление на другой маршрут
  next('/login')
}

//хук beforeEnter вызывается до подтверждения пути
//props-входной параметр, определен как функция, чтобы возвращать нужный компоненту объект
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/orders/:waybillId',
      name: 'Orders',
      component: Orders,
      props: (route) => ({waybillId: Number(route.params.waybillId)}),
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/order-items/:orderId',
      name: 'OrderItems',
      component: OrderItems,
      props: (route) => ({orderId: Number(route.params.orderId), orderData: route.params.order}),
      beforeEnter: ifAuthenticated,
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
