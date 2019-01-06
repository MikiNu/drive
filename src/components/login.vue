<template>
  <div class="text-center">
    <div class="pt-4">
      <p>Добро пожаловать в IRMAGDrive!</p>
    </div>
    <b-form
      @submit.prevent="login"
    >
      <div class="p-4 text-primary">
        <h2 class="text-center">
          Авторизация
        </h2>
      </div>
      <b-form-group id="exampleInputGroup1">
        <b-form-input
          id="exampleInput1"
          v-model="username"
          type="text"
          size="85"
          required
          placeholder="Введите логин"
          class="mb-2"
        />
      </b-form-group>
      <b-form-group id="exampleInputGroup2">
        <b-form-input
          id="exampleInput2"
          v-model="password"
          type="password"
          required
          placeholder="Введите пароль"
          class="mb-2"
        />
      </b-form-group>
      <div
        v-if="urlServer === ''"
        class="pt-2 font-weight-bold text-danger"
      >
        Укажите настройки сервера!
      </div>
      <div
        v-if="notLogin"
        class="pt-2 font-weight-bold text-danger"
      >
        Неверный логин или пароль!
      </div>
      <b-button
        class="w-100 mt-5"
        type="submit"
        variant="primary"
      >
        Войти
      </b-button>
    </b-form>
  </div>
</template>

<script>
  import {AUTH_REQUEST} from '../store/actions/auth.js'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Login',
    data () {
      return {
        username: 'courier_1',
        password: '123qweasd',
        notLogin: false
      }
    },
    computed: {
      //слушаем адрес сервера в хранилище
      ...mapGetters(['urlServer']),
    },
    //хук ЖЦ экземпляра
    beforeCreate: function () {
      //вызываем мутацию по установлению параметра, что мы находимся НЕ в настройках
      this.$store.commit('SETTING', false)
    },
    methods: {
      //ф-ия авторизации
      login: function () {
        //если адрес сервера существует
        if (this.urlServer !== "") {
          //определяем данные для отправки
          const {username, password} = this
          //вызов action из хранилища на запрос авторизации
          this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
            this.notLogin = false
            //если успех - переходим на главную страницу
            this.$router.push('/')
          },response =>{
            if(response.status === 403) {
              this.notLogin = true
            }
          })
        }
      },
    },
  }
</script>
