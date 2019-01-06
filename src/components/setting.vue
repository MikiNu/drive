<template>
  <div>
    <div class="pb-5 pr-5 pl-5 pt-4 text-primary">
      <h2 class="text-center">
        Настройки
      </h2>
    </div>
    <b-form-input
      id="exampleInput1"
      v-model="urlserver"
      class="mb-2"
      type="text"
      size="85"
      required
      placeholder="Введите адрес сервера"
    />
    <b-button
      type="submit"
      variant="success"
      class="w-100 mt-5"
      @click="setting(urlserver)"
    >
      Сохранить
    </b-button>
  </div>
</template>

<script>
  import {SET_SAVE} from '../store/actions/setting.js'

  export default {
    name: 'Setting',
    data () {
      return {
        //возвращаем значение соответствующее адресу сервера из хранилища
        urlserver: this.$store.getters.urlServer,
      }
    },
    computed: {},
    //хук ЖЦ экземпляра
    beforeCreate: function () {
      //вызываем мутацию по установлению параметра, что мы находимся в настройках
      this.$store.commit('SETTING', true)
    },
    methods: {
      //сохраняем адрес сервера, являющимся входным параметров для ф-ии - urlserver
      setting: function (urlserver) {
        //вызываем action в храналище, сохраняющий адрес сервера и переходим на страницу авторизации
        this.$store.dispatch(SET_SAVE, urlserver).then(() => this.$router.push('/login'))
      },
    },
  }

</script>
