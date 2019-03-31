<template>
  <div id="app">
    <header :class="{ 'shadow-for-nav': isAuthenticated }">
      <b-container>
        <b-row>
          <b-col cols="12">
            <navigation />
          </b-col>
        </b-row>
      </b-container>
    </header>
    <b-container>
      <b-row>
        <b-col
          v-if="!responseServer"
          cols="12"
          class="p-0"
        >
          <b-alert
            variant="danger"
            show
            class="text-center"
          >
            НЕТ СВЯЗИ!
          </b-alert>
        </b-col>
        <b-col cols="12">
          <router-view />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import Navigation from './components/navigation.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'App',
    //хэш компонентов, доступных в данном экземпляре
    components: {
      //верхнее меню
      Navigation,
    },
    computed: {
      //слушаем состояния: isAuthenticated-авторизирован ли пользователь
      ...mapGetters(['isAuthenticated', 'responseServer']),
    },
  }

</script>

<style scoped>
  .shadow-for-nav {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 0 4px rgba(0, 0, 0, 0.22);
  }
</style>
