<template>
  <div v-if="waybill">
    <b-alert
      :variant="waybill.isCompleted ? 'success' : 'primary'"
      show
    >
      <p class="text-center">
        Путёвка {{ waybillId }} от {{ waybill.date }}
      </p>
      <b-row>
        <b-col cols="6">
          <p class="mb-0">
            Заказов: {{ waybill.orders.length }}
          </p>
        </b-col>
        <b-col
          cols="6"
          :class="waybill.isCompleted ? 'p-0' : ''"
        >
          <template v-if="waybill.isCompleted">
            Статус: закрыта
          </template>
          <template v-else>
            <b-btn
              v-b-modal.finish
              variant="success"
              class="w-100"
            >
              Завершить
            </b-btn>
          </template>
        </b-col>
      </b-row>
      <div class="text-justify text-dark pb-2 pt-4">
        <b-form-input
          v-model="search"
          type="text"
          pattern="[0-9]+$"
          placeholder="Поиск..."
        />
      </div>
      <b-form-select
        v-model="selected"
        :options="options"
        class="mt-2 mb-2"
      />
    </b-alert>
    <order
      v-for="order in orders"
      :key="order.id"
      :order="order"
      :price="ordersTotalPriceNew[order.id]"
    />
    <b-modal
      id="finish"
      ref="modalFinish"
      centered
      :title="'Путевка № '+waybillId"
      hide-footer
    >
      <b-form
        @submit.prevent="sendFinish"
      >
        <p class="text-center mb-4">
          Завершение работы
        </p>
        <b-form-group label="Введите киллометраж:">
          <b-form-input
            v-model="mileage"
            type="number"
            pattern="[0-9]+$"
            required
            placeholder="Введите км"
          />
        </b-form-group>
        <b-form-group label="Кол-во довозов:">
          <b-form-input
            v-model="quantityOfExtraDelivery"
            type="number"
            pattern="[0-9]+$"
            required
            placeholder="Введите кол-во довозов"
          />
        </b-form-group>
        <b-form-group label="Кол-во межгородов:">
          <b-form-input
            v-model="quantityOutOfCity"
            type="number"
            pattern="[0-9]+$"
            required
            placeholder="Введите кол-во межгорода"
          />
        </b-form-group>
        <b-form-group label="Сумма наличными:">
          <b-form-input
            v-model="sumCashEnterDriver"
            type="number"
            pattern="\d+(\.\d{2})?"
            required
            placeholder="Введите сумму наличных"
          />
        </b-form-group>
        <b-form-textarea
          v-model="comment"
          placeholder="Введите комментарий"
          :rows="3"
          :max-rows="6"
          class="mb-3"
        />
        <b-row align-h="end">
          <b-col
            cols="6"
            class="pt-2 pb-2"
          >
            <b-btn
              size="md"
              variant="success"
              class="w-100"
              type="submit"
            >
              Ок
            </b-btn>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {PATCH_WAYBILLS} from '../store/actions/waybills.js'
  import Order from './order.vue'

  export default {
    name: 'Orders',
    //хэш компонентов, доступных в данном экземпляре
    components: {
      //заказ
      Order,
    },
    props: {
      //входной параметр-id путевого листа
      waybillId: {
        type: Number,
        default: 0,
      },
    },
    //search-поле для поиска по id заказа, mileage-км, quantityOfExtraDelivery-кол-во довозов, quantityOutOfCity-кол-во межгорода
    //comment-комментарий, sumCashEnterDriver-сумма наличных, selected-выбранный статус заказа, options-статусы заказов
    // массив ordersTotalPriceNew[номер_заказа]=сумма заказа для передачи в компонент
    data() {
      return {
        search: '',
        mileage: '',
        quantityOfExtraDelivery: '',
        quantityOutOfCity: '',
        comment: '',
        sumCashEnterDriver: '',
        selected: 0,
        options: [
          {value: 0, text: 'Все статусы'},
          {value: 1, text: 'Доставлен'},
          {value: 2, text: 'Перенесен'},
          {value: 3, text: 'Отменён'},
        ],
        ordersTotalPriceNew: []
      }
    },
    computed: {
      //слушаем массив путевых листов и массив изменений заказов в хранилище
      ...mapGetters(['waybills', 'ordersChange']),
      orders: function() {
        //sumOld-старая сумма по измененным товарам, sumNew-новая сумма по измененным товарам, totalPrice-сумма заказа
        let sumOld, sumNew, totalPrice
        //если в хранилище существует массив с изменениями
        if (this.ordersChange){
          for (let i = 0; i < this.ordersChange.length; i++) {
            for (let j = 0; j < this.waybill.orders.length; j++) {
              //если в хранилище в массиве измененных заказов есть заказ из нашей путевки
              if (this.ordersChange[i].id === this.waybill.orders[j].id) {
                sumOld=sumNew=totalPrice=0
                for (let n = 0; n < this.ordersChange[i].orderElement.length; n++) {
                  for (let m = 0; m < this.waybill.orders[j].orderElement.length; m++) {
                    //если нашли измененные позиции заказа
                    if (this.ordersChange[i].orderElement[n].element.id === this.waybill.orders[j].orderElement[m].element.id) {
                      //если изначально в заказе были изменения кол-ва
                      if(this.waybill.orders[j].orderElement[m].amountDiff) {
                        sumOld = parseFloat(sumOld) + parseFloat(this.waybill.orders[j].orderElement[m].price) * (parseFloat(this.waybill.orders[j].orderElement[m].amount)+parseFloat(this.waybill.orders[j].orderElement[m].amountDiff))
                      }else
                        sumOld = parseFloat(sumOld) + parseFloat(this.waybill.orders[j].orderElement[m].price) * parseFloat(this.waybill.orders[j].orderElement[m].amount)
                      sumNew = parseFloat(sumNew) + parseFloat(this.ordersChange[i].orderElement[n].price) * parseFloat(this.ordersChange[i].orderElement[n].amount)
                    }
                  }
                }
                if (sumOld !== sumNew)
                  totalPrice =  (parseFloat(this.waybill.orders[j].totalPrice) + (parseFloat(sumNew) - parseFloat(sumOld))).toFixed(2)
                else
                  totalPrice =  this.waybill.orders[j].totalPrice
                this.setOrdersTotalPriceNew( this.waybill.orders[j].id, totalPrice)
              }
            }
          }
        }
        //т.к. функция имеет свой this и не будет иначе видеть глобальные объекты
        let that = this
        let ordersList = this.waybill.orders.map(function(order) {
          //если в хранилище есть массив с изменением заказов
          if (that.ordersChange) {
            for (let i = 0; i < that.ordersChange.length; i++) {
              //если в этом массиве есть заказ из путевки
              if (order.id === that.ordersChange[i].id) {
                let newOrder
                //если в измененном массиве есть статус
                  if (that.ordersChange[i].status)
                    //вызываем функцию на изменения параметра
                    newOrder =  that.setParamInOrders(order, 'status', that.ordersChange[i].status)
                //если в измененном массиве есть способ оплаты
                  if (that.ordersChange[i].paymentMethod)
                    newOrder =  that.setParamInOrders(order, 'paymentMethod',  that.ordersChange[i].paymentMethod)
                  if (newOrder)
                    return newOrder
                  else
                    return order
              }
            }
            return order
          }else
            return order
        })
        //если выбран статус заказа
        if (this.selected !== 0){
          //если есть в хранилище массив с измененными заказами
          if (this.ordersChange) {
            //возвращаем массив с фильтров по статусу и id заказа
            return ordersList
              .filter(order => (order.status.id === this.selected) && String(order.id).indexOf(this.search) !== -1)
            //иначе ничего не возвращаем
          }else
            return 0
          //если статус заказа не выбран, то оставляем только фильтр по id(из поиска)
        }else
          return (ordersList.sort(this.sortOfActualOrder)).filter(order => String(order.id).indexOf(this.search) !== -1)
      },
      //возвращает массив с данными конкретной путевки(c входным id)
      waybill: function () {
        for (let i = 0; i < this.waybills.length; i++) {
          if (this.waybills[i].id === this.waybillId) {
            return this.waybills[i]
          }
        }
        return 0
      },
    },
    methods: {
      //метод для сортировки заказов по статусам, чтобы актуальные были вверху списка
      sortOfActualOrder: function (order1, order2){
        if (order1.status.id < order2.status.id)
          return 1
        if (order1.status.id > order2.status.id)
          return -1
      },
      //метод устанавливает новые значения(value) в массиве order, для поля nameParam
      //return массив заказа
      setParamInOrders: function(order, nameParam, value){
        if (nameParam === 'status')
         order.status = value
        if (nameParam === 'paymentMethod')
          order.paymentMethod = value
        if (nameParam === 'mixedPayment')
          order.mixedPayment = value
        return order
      },
      //закрытие путевки
      sendFinish: function(){
        //формируем данные для отправки на сервер
        const {mileage, quantityOfExtraDelivery, quantityOutOfCity, comment} = this
        let sumCash = this.sumCashEnterDriver
        //параметр закрытия
        let isCompleted = true
        let data = {}
        data.id = this.waybillId
        data.waybill = {mileage, quantityOfExtraDelivery, quantityOutOfCity, comment, sumCash, isCompleted}
        //вызов action из хранилища на изменение путевки
        this.$store.dispatch(PATCH_WAYBILLS, data)
        //скрываем модальное окно
        this.$refs.modalFinish.hide()
        //открываем список путевок
        this.$router.push('/')
      },
      //добавление в массив ordersTotalPriceNew поля orderId и соответствующего ему значения totalPrice
      setOrdersTotalPriceNew: function (orderId, totalPrice) {
       this.ordersTotalPriceNew[Number(orderId)] = Number(totalPrice)
      }
    },
  }

</script>