<template>
  <b-card :class="[(order.status.id < 3 || (order.status.id === 3 && order.status.shortname === 'C')) ? 'text-secondary':'','mb-2 order']">
    <router-link
      :to="{ name: 'OrderItems', params: { orderId: order.id , order: order }}"
    >
      <b-row class="orders-item">
        <div class="font-weight-bold pt-2 pb-2">
          <v-icon
            name="cart-arrow-down"
            scale="1"
          />
          Заказ {{ order.id }} от {{ order.createdAt }}
        </div>
        <b-col
          cols="12"
        >
          <b-row>
            <span class="font-weight-bold pr-1">
              Сумма:
            </span>
            <span :class="[(order.status.id < 3 || (order.status.id === 3 && order.status.shortname === 'C')) ? 'text-secondary':'text-danger', 'font-weight-bold']">
              {{ totalPrice }}
            </span>
          </b-row>
        </b-col>
        <b-col cols="12">
          <b-row class="pb-2">
            <b-col
              cols="6"
              class="p-0"
            >
              {{ order.payerUsername }}
            </b-col>
            <b-col
              cols="6"
              class="text-left p-0"
            >
              <a
                :href="'tel:' + phonePayer"
                :class="[(order.status.id < 3 || (order.status.id === 3 && order.status.shortname === 'C')) ? 'text-secondary':'text-primary', 'font-weight-bold']"
              >
                <v-icon
                  name="phone"
                  scale="1"
                />
                {{ phonePayer }}
              </a>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12">
          <b-row>
            <b-col
              cols="6"
              class="font-weight-bold p-0"
            >
              <div>
                <v-icon
                  v-if="order.deliveryMethod.id === 1"
                  name="car"
                  scale="1"
                />
                <v-icon
                  v-if="order.deliveryMethod.id === 2"
                  name="warehouse"
                  scale="1"
                />
                {{ order.deliveryMethod.name }}
              </div>
              <div class="pt-2">
                <v-icon
                  name="ruble-sign"
                  scale="1"
                />
                {{ order.paymentMethod.name }}
              </div>
            </b-col>
            <b-col
              cols="6"
              class="text-center p-0"
            >
              <div>{{ order.deliveryTime.name }}</div>
              <div>{{ address }}</div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </router-link>
  </b-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'Order',
    props: {
      // входной параметр - заказ
      order:{
        type: Object,
        default: function() {
          return {}
        },
      },
      //сумма заказа
      price:{
        type: Number,
        default: 0
      },
    },
    computed: {
      //слушаем в хранилище массив изменения заказов
      ...mapGetters(['ordersChange']),
      //сумма заказа
      totalPrice: function() {
        // console.log('q')
        if (this.price === 0)
          return this.order.totalPrice
        else
          return this.price
      },
      //адрес доставки
      address: function () {
        let rezult=''
        //если самовывоз
        if (this.order.deliveryMethod.id === 2) {
          (this.order.deliveryCity.name === undefined || this.order.deliveryCity.name === null) ? '' : (rezult += this.order.deliveryCity.name),
            (this.order.selfserviceMethod.address === undefined || this.order.selfserviceMethod.address === null) ? '' : (rezult += ", "+this.order.selfserviceMethod.address)
        //иначе доставка курьером
        } else {
          (this.order.deliveryCity.name === undefined || this.order.deliveryCity.name === null) ? '' : (rezult += this.order.deliveryCity.name),
            (this.order.deliveryStreet === undefined || this.order.deliveryStreet === null) ? '' : (rezult += ", "+this.order.deliveryStreet),
            (this.order.deliveryHouse === undefined || this.order.deliveryHouse === null) ? '' : (rezult += ", "+this.order.deliveryHouse),
            (this.order.deliveryApartment === undefined || this.order.deliveryApartment === null) ? '' : (rezult += ", "+this.order.deliveryApartment)
        }
        return rezult
      },
      //преобразование для номера заказчика
      phonePayer: function () {
        let r = /([0-9])+/g, arr = this.order.payerTelephone.match(r), res, str = arr.join('')
        if (this.order.payerTelephone.substr(0, 1) === '+') {
          res = "+" + str;
        } else if (str.substr(0, 1) === '8') {
          res = "+7" + str.substr(1);
        }  else if (str.substr(0, 1) === '7') {
          res = "+" + str;
        } else {
          res = str;
        }
        return res
      },
    },
  }
</script>

<style scoped>
  .order a,.order a:hover {
    text-decoration: none;
    color: unset;
  }
  .orders-item{
    font-size: 14px;
  }
</style>