<template>
  <div>
    <loading v-if="loading" />
    <div class="list-home">
      <p class="mt-3 mb-3 p-1 text-uppercase text-center">
        Путёвки - {{ driverShortname }}
      </p>
      <waybill
        v-for="waybill in waybills"
        :key="waybill.id"
        :waybill="waybill"
      />
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Loading from './loading.vue'
  import Waybill from './waybill.vue'

  export default {
    name: 'Home',
    //хэш компонентов, доступных в данном экземпляре
    components: {
      //загрузка
      Loading,
      //путевка
      Waybill,
    },
    computed: {
      //слушаем массив путевых листов в хрнилище и адрес сервера в хранилище
      ...mapGetters(['waybills', 'urlServer', 'driver', 'authStatus', 'isAuthenticated']),
      //процесс загрузки
      loading: function () {
        return this.authStatus === 'loading' && !this.isAuthenticated
      },
      //Фамилия И.О. водителя
      driverShortname: function () {
        return this.driver.replace(/(.+) (.).+ (.).+/, '$1 $2. $3.')
      },
    },
    beforeUpdate: function () {
      this.$router.push('/login')
    },
    updated: function () {
      if (!this.isAuthenticated && this.authStatus !== 'loading') {
        this.$router.push('/login')
      }
    },
  }
</script>
