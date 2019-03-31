<template>
  <div>
    <div :class="{ 'pb-4': !isAuthenticated }">
      <b-navbar v-if="!isAuthenticated">
        <b-row class="align-items-center">
          <b-col cols="9">
            <b-navbar-brand
              variant="faded"
              type="light"
            >
              <a href="tel:991100">
                <img
                  src="../assets/logo.svg"
                  width="205px"
                >
              </a>
            </b-navbar-brand>
          </b-col>
          <b-col cols="3">
            <b-navbar-nav>
              <b-nav-item
                v-if="!isSetting"
                :to="{ name: 'Setting' }"
              >
                <v-icon
                  name="cog"
                  scale="2"
                  class="text-primary"
                />
              </b-nav-item>
              <b-nav-item
                v-if="isSetting"
                :to="{ name: 'Login' }"
              >
                <v-icon
                  name="arrow-left"
                  scale="2"
                  class="text-primary"
                />
              </b-nav-item>
            </b-navbar-nav>
          </b-col>
        </b-row>
      </b-navbar>
      <b-navbar v-if="isAuthenticated">
        <b-row class="align-items-center">
          <b-col cols="2">
            <b-navbar-nav style="width: 45px;">
              <b-nav-item>
                <Slide>
                  <waybill
                    v-for="waybill in waybills"
                    :key="waybill.id"
                    :waybill="waybill"
                    :type="'slide'"
                  />
                </Slide>
              </b-nav-item>
            </b-navbar-nav>
          </b-col>
          <b-col
            cols="7"
            class="pr-0"
          >
            <b-navbar-brand
              variant="faded"
              type="light"
              class="m-0"
            >
              <a href="tel:991100">
                <img
                  src="../assets/logo.svg"
                  width="150px"
                >
              </a>
            </b-navbar-brand>
          </b-col>
          <b-col cols="3">
            <b-navbar-nav>
              <b-nav-item>
                <b-button
                  variant="white"
                  class="bg-white text-danger"
                  @click="logout"
                >
                  <v-icon
                    name="sign-out-alt"
                    scale="1.5"
                  />
                </b-button>
              </b-nav-item>
            </b-navbar-nav>
          </b-col>
        </b-row>
      </b-navbar>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {AUTH_LOGOUT} from '../store/actions/auth.js'
  import {Slide} from 'vue-burger-menu'
  // import Sidebar from './sidebar.vue'
  import Waybill from './waybill.vue'

  export default {
    name: 'Navigation',
    //хэш компонентов, доступных в данном экземпляре
    components: {
      //боковое меню
      // Sidebar,
      Slide,
      Waybill,
    },
    computed: {
      //слушаем состояния: isAuthenticated-авторизирован ли пользователь, isSetting-открыты ли настройки
      ...mapGetters(['isAuthenticated', 'isSetting', 'waybills']),
    },
    methods: {
      //выход
      logout: function () {
        //вызываем action отвечающий за выход и переходим на страницу авторизации
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      },
    },
  }
</script>

<style>
  .bm-menu-sidebar {
    left: 0;
    overflow-x: hidden;
    transition: .3s;
    width: 0;
    z-index: 1000;
  }

  .bm-burger-button {
    left: 10px;
    top: -7px;
  }

  .bm-burger-bars {
    background-color: #007bff
  }
</style>
