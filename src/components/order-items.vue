<template>
  <div v-if="order">
    <b-alert
      :variant="(checkStatus && idStatusOfOrder === 1) ? 'success'
        : ((checkStatus && idStatusOfOrder === 2) ? 'warning'
          : ((checkStatus && idStatusOfOrder === 3) ? 'danger'
            :'primary'))"
      show
    >
      <p class="text-center">
        Заказ № {{ orderId }} от {{ order.createdAt.split(' ',2)[0] }}
      </p>
      <template v-if="checkStatus">
        Статуc: {{ nameStatusOfOrder }}
      </template>
      <b-row>
        <b-col
          cols="5"
          class="text-dark pt-2 pb-2 info-waybill"
        >
          Позиций: {{ order.orderElement.length }}
        </b-col>
        <b-col
          cols="7"
          class="text-right text-dark pt-2 pb-2 info-waybill"
        >
          Сумма:  <span class="font-weight-bold">
            {{ totalPrice }}
          </span>
        </b-col>
      </b-row>
      <div
        v-if="getPaymentDataFromOrder()"
        class="text-justify text-dark pt-2 info-waybill"
      >
        <b-form-select
          v-model="selected"
          :options="options"
          :disabled="disableSelect"
          class="mb-3"
        />
      </div>
      <div class="text-justify text-dark pb-3">
        <b-form-input
          v-model="search"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </b-alert>
    <div
      v-if="order.deliveryComment"
      class="pb-3 text-justify"
    >
      {{ order.deliveryComment }}
    </div>
    <template v-if="!checkStatus">
      <div class="pb-3">
        <b-row align-h="around">
          <b-col cols="12">
            <b-btn
              v-b-modal.send
              variant="success"
              class="w-100"
            >
              Отправить
            </b-btn>
          </b-col>
        </b-row>
      </div>
    </template>
    <!--<template v-if="changeOrderElement()">-->
    <item
      v-for="item in orderElements"
      :key="item.id"
      :item="item"
      :order-id="order.id"
      :status="checkStatus"
    />
    <!--</template>-->
    <b-modal
      id="send"
      ref="modalSend"
      centered
      :title="'Заказ № '+order.id"
      hide-footer
    >
      <template v-if="status !== 1">
        <p
          v-if="status === 3"
          class="text-center"
        >
          Отменить заказ?
        </p>
        <p
          v-else
          class="text-center"
        >
          Перенести заказ?
        </p>
        <b-form-textarea
          id="textarea1"
          v-model="comment"
          placeholder="Введите комментарий"
          :rows="3"
          :max-rows="6"
        />
        <b-row align-h="around">
          <b-col
            cols="5"
            class="pt-3 pb-2"
          >
            <b-btn
              size="md"
              variant="danger"
              class="w-100"
              @click="status=1"
            >
              Нет
            </b-btn>
          </b-col>
          <b-col
            cols="5"
            class="pt-3 pb-2"
          >
            <b-btn
              size="md"
              variant="primary"
              class="w-100"
              @click="orderChanges()"
            >
              Да
            </b-btn>
          </b-col>
        </b-row>
      </template>
      <template v-else>
        <b-form
          @submit.prevent="orderChanges"
        >
          <p class="text-center">
            {{ options[selected-1].text }}
          </p>
          <p class="text-center">
            <span class="font-weight-bold text-danger">
              {{ totalPrice }}
            </span>
          </p>
          <div v-if="selected === 7">
            <b-row>
              <b-col cols="12">
                Наличными
              </b-col>
              <b-col cols="12">
                <b-form-input
                  v-model="mixedSumCash"
                  type="number"
                  pattern="\d+(\.\d{2})?"
                  placeholder="Введите сумму"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                Безналичными(через терминал)
              </b-col>
              <b-col cols="12">
                <b-form-input
                  v-model="mixedSumCard"
                  type="number"
                  pattern="\d+(\.\d{2})?"
                  placeholder="Введите сумму"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                Сертификат
              </b-col>
              <b-col
                cols="12"
                :class="[(error || errorCertificate) ? 'pb-2' : 'pb-4']"
              >
                <b-form-input
                  v-model="mixedSumCertificate"
                  type="number"
                  pattern="[0-9]+$"
                  placeholder="Введите сумму"
                />
              </b-col>
            </b-row>
            <b-row v-if="error || errorCertificate">
              <b-col cols="12">
                <p
                  v-if="error && !errorCertificate"
                  class="font-weight-bold text-danger text-center"
                >
                  Не сходится сумма
                </p>
                <p
                  v-if="errorCertificate"
                  class="font-weight-bold text-danger text-center"
                >
                  Сумма сертификата должна быть кратной 500
                </p>
              </b-col>
            </b-row>
          </div>
          <b-form-textarea
            id="textarea1"
            v-model="comment"
            placeholder="Введите комментарий"
            :rows="3"
            :max-rows="6"
          />
          <b-btn
            variant="primary"
            block
            class="mt-2 mb-4"
            type="submit"
            :disabled="error || errorCertificate"
          >
            Ок
          </b-btn>
          <b-btn
            variant="danger"
            block
            @click="status=3"
          >
            Отменить заказ
          </b-btn>
          <b-btn
            v-b-modal.confirmation
            variant="warning"
            block
            @click="status=2"
          >
            Перенести заказ
          </b-btn>
        </b-form>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {GET_ORDER,POST_ORDER, PATCH_ORDER} from '../store/actions/orders.js'
  import {
    //GET_MIXED_PAYMENTS, PATCH_MIXED_PAYMENTS,
    POST_MIXED_PAYMENTS, DELETE_MIXED_PAYMENTS} from '../store/actions/mixed-payments.js'
  import {GET_ORDERS_ELEMENT} from '../store/actions/elements.js'
  import Item from './item.vue'
  import FastClone from 'fastest-clone'

  export default {
    name: 'OrderItems',
    components: {
      Item
    },
    props: {
      //входной параметр - номер заказа
      orderId: {
        type: Number,
        default: 0,
      },
      //данные заказа
      orderData:{
        type: Object,
        default: function() {
          return {}
        },
      },
    },
    // search-для поиска, comment-комент.курьера, status-статус заказа, error-ошибки суммы оплаты,
    // errorCertificate-ошибка суммы сертификата, sumCash-нал в смеш.платеже, sumCard-безнал. в смеш.платеже,
    // sumCertificate-сертификат в смеш.платеже
    // selected-выбор способа оплаты, options-список способов оплаты
    // idStatusOfOrder-статус заказа, nameStatusOfOrder-имя статуса заказа
    data() {
      return {
        search: '',
        comment:'',
        status: 1,
        error: '',
        errorCertificate: false,
        sumCash: 0,
        sumCard: 0,
        sumCertificate: 0,
        selected: null,
        idStatusOfOrder: 0,
        nameStatusOfOrder: '',
        options: [
          { value: 1, text: 'Наличный расчёт', disabled:false },
          { value: 2, text: 'Курьеру банковской картой (через терминал)', disabled:false },
          { value: 3, text: 'Перевод на карту Сбербанка', disabled:true },
          { value: 4, text: 'Оплата онлайн', disabled:true },
          { value: 5, text: 'Платежная система WebMoney', disabled:true },
          { value: 6, text: 'Расчётный счёт', disabled:true },
          { value: 7, text: 'Смешанный', disabled:false },
          { value: 8, text: 'Оплата на счёт через Сбербанк-Онлайн', disabled:true },
          { value: 9, text: 'Оплата ApplePay', disabled:true },
          { value: 10, text: 'Оплата AndroidPay', disabled:true },
        ]
      }
    },
    computed: {
      //слушаем массив с путевками в хранилище
      ...mapGetters(['waybills', 'elements', 'ordersChange', 'mixedPayments', 'responseServer']),
      //проверяем статус заказа
      checkStatus: function() {
        //если в хранилище есть массив измененных заказов
        if (this.ordersChange) {
          for (let i = 0; i < this.ordersChange.length; i++) {
            //если в массиве находим наш заказ
            if (this.orderId === this.ordersChange[i].id) {
              //если у него установлен статус
              if (this.ordersChange[i].status) {
                this.setParamsStatusOfOrder(this.ordersChange[i].status.id, this.ordersChange[i].status.name)
                return true
              }
            }
          }
        }
        //если не было данных с изменений, тогда берем входные данные заказа
        if (this.order.status && this.order.status.id < 3) {
          this.setParamsStatusOfOrder(this.order.status.id, this.order.status.name)
          return true
        }else
          return false
      },
      //поиск по позициям в заказе
      orderElements: function() {
        //клонируем массив товаров из заказа
        let orderElements = FastClone.cloneArray(this.order.orderElement)
        for(let i = 0; i < orderElements.length; i++) {
          //если были изменения кол-ва
          if(orderElements[i].amountDiff) {
            //вычисляем кол-во товара
            orderElements[i].amount = orderElements[i].amount + orderElements[i].amountDiff
            delete orderElements[i].amountDiff
          }
        }
        //если в хранилище существует массив с измененными товарами
        if (this.elements) {
          for (let i = 0; i < this.elements.length; i++) {
            for (let j = 0; j < orderElements.length; j++) {
              //если нашли совпадение элементов по id
              if (this.elements[i].element.id === orderElements[j].element.id) {
                orderElements[j].itemChange = ""
                //проверяем на изменение цены и кол-ва
                if (this.elements[i].amount !== orderElements[j].amount && this.elements[i].price !== orderElements[j].price) {
                  //устанавливаем измененные значения
                  orderElements[j].price = this.elements[i].price
                  orderElements[j].amount = this.elements[i].amount
                  //указываем, что было изменено
                  orderElements[j].itemChange = "all"
                  //если была изменена только цена
                }else if (this.elements[i].price !== orderElements[j].price) {
                  orderElements[j].price = this.elements[i].price
                  orderElements[j].itemChange = "price"
                  //если было изменено только кол-во
                }else if (this.elements[i].amount !== orderElements[j].amount) {
                  orderElements[j].amount = this.elements[i].amount
                  orderElements[j].itemChange = "amount"
                }

              }
            }
          }
        }
        //возвращаем массив элементов, фильтруя по имени(поле поиск)
        return orderElements.filter(item => String(item.name).toLowerCase().indexOf(this.search.toLowerCase()) !== -1)
      },
      //наличный расчёт для смешанного платежа
      mixedSumCash: {
        get: function () {
          //вызов ф-ии вычисления наличной суммы
          this.getSumCash()
          //вызов ф-ии проверки на общую сумму смешанного способа оплаты
          this.checkMixedSum()
          //результат округляем до двух знаков после запятой
          return this.sumCash.toFixed(2)
        },
        set: function (newValue) {
          //перед установлением значения проверяем, чтобы не было число больше общей суммы заказа
          if (newValue > this.totalPrice){
            this.error = true
          }else{
            if (this.error)
              this.error = false
            this.sumCash = Number(newValue)
          }
        },
      },
      //безналичный расчёт для смешанного платежа
      mixedSumCard: {
        get: function () {
          return this.sumCard
        },
        set: function (newValue) {
          //перед установлением значения проверяем, чтобы не было число больше общей суммы заказа
          if (newValue > this.totalPrice){
            this.error = true
          }else{
            if (this.error){
              this.error = false
            }
            this.sumCard = Number(newValue)
          }
        },
      },
      //расчёт сертификатом для смешанного платежа
      mixedSumCertificate: {
        get: function () {
          return this.sumCertificate
        },
        set: function (newValue) {
          //проверяем сумму сертификата на кратность 500
          if (newValue % 500 !== 0){
            this.errorCertificate = true
          }else{
            if(this.errorCertificate)
              this.errorCertificate = false
            this.sumCertificate = Number(newValue)
          }
        },
      },
      //получаем все данные о конкретном заказе
      order: function () {
        //если есть входные параметря, т.е. перешли по маршруту
        if (this.orderData.id) {
          //вызов action на получение измененных товаров для заказа
          this.$store.dispatch(GET_ORDERS_ELEMENT, this.orderId)
          return this.orderData
          //если нет входных параметров, т.е. была перезагрузка страницы
        }else {
          for (let i = 0; i < this.waybills.length; i++) {
            for (let j = 0; j < this.waybills[i].orders.length; j++) {
              //если нашли заказ в массиве с путевками
              if (this.waybills[i].orders[j].id === this.orderId) {
                //вызов action на получение измененных товаров для заказа
                this.$store.dispatch(GET_ORDERS_ELEMENT, this.orderId)
                return this.waybills[i].orders[j]
              }
            }
          }
          return 0
        }
      },
      //сумма заказа
      totalPrice: function(){
        //sumOld-старая сумма по измененным товарам, sumNew-новая сумма по измененным товарам, totalPrice-сумма заказа
        let sumOld, sumNew, totalPrice
        sumOld = sumNew = totalPrice = 0
        //если в хранилище существует массив с изменениями
        if (this.ordersChange) {
          for (let i = 0; i < this.ordersChange.length; i++) {
            //если в хранилище в массиве измененных заказов есть наш
            if (this.ordersChange[i].id === this.orderId) {
              for (let n = 0; n < this.ordersChange[i].orderElement.length; n++) {
                for (let m = 0; m < this.order.orderElement.length; m++) {
                  //если нашли совпадающие товары по их id
                  if (this.ordersChange[i].orderElement[n].element.id === this.order.orderElement[m].element.id) {
                    //если изначально в заказе были изменения кол-ва
                    if (this.order.orderElement[m].amountDiff) {
                      sumOld = parseFloat(sumOld) + parseFloat(this.order.orderElement[m].price) * (parseFloat(this.order.orderElement[m].amount) + parseFloat(this.order.orderElement[m].amountDiff))
                    } else
                      sumOld = parseFloat(sumOld) + parseFloat(this.order.orderElement[m].price) * parseFloat(this.order.orderElement[m].amount)
                    sumNew = parseFloat(sumNew) + parseFloat(this.ordersChange[i].orderElement[n].price) * parseFloat(this.ordersChange[i].orderElement[n].amount)
                  }
                }
              }
              if (sumOld !== sumNew)
                totalPrice = (parseFloat(this.order.totalPrice) + (parseFloat(sumNew) - parseFloat(sumOld))).toFixed(2)
              else
                totalPrice = this.order.totalPrice
            }
          }
        }
        if (totalPrice === 0)
          totalPrice =  this.order.totalPrice
        return Number(totalPrice)
      },
      //номер путевки
      waibillId: function () {
        for (let i = 0; i < this.waybills.length; i++) {
          for (let j = 0; j < this.waybills[i].orders.length; j++) {
            if (this.waybills[i].orders[j].id === this.orderId) {
              return this.waybills[i].id
            }
          }
        }
        return 0
      },
      //запрет смены способа оплаты если не наличный, не терминал и не смешанный
      disableSelect:function(){
          if ((this.order.paymentMethod.id === 1 || this.order.paymentMethod.id === 2 || this.order.paymentMethod.id === 7) && !this.checkStatus) {
            return false
          }else
            return true
      }
    },
    methods: {
      //установка данных статуса заказа
      setParamsStatusOfOrder: function (id, name){
        this.idStatusOfOrder = id
        this.nameStatusOfOrder = name
      },
      //проверка смешанного способа оплаты
      checkMixedSum: function(){
        //обая сумма по всем полям смешанного платежа не должна превышать общей суммы заказа
        if ((this.sumCertificate + this.sumCard + this.sumCash)>this.totalPrice)
          this.error = true
        // значения полей смешанного платежа не могут быть отрицательными
        else if ((this.sumCertificate < 0)|| (this.sumCard < 0) || (this.sumCash < 0))
          this.error = true
        else
          this.error = false
      },
      //получение данных о способе оплаты заказа
      getPaymentDataFromOrder: function(){
        //если способ оплаты не выбран
        if(!this.selected){
          let setSelect = false
          //если в хранилище есть массив с изменениями по заказам
          if (this.ordersChange) {
            for (let i = 0; i < this.ordersChange.length; i++) {
              //если в этом массиве нашли наш заказ
              if (this.orderId === this.ordersChange[i].id) {
                //если был изменен способ оплаты
                if (this.ordersChange[i].paymentMethod) {
                  //устанавливаем его
                  this.selected = this.ordersChange[i].paymentMethod.id
                  setSelect = true
                  // if (this.ordersChange[i].paymentMethod.id === 7 && this.ordersChange[i].mixedPayment){
                  //   this.sumCash = Number(this.ordersChange[i].mixedPayment.sumCash)
                  //   this.sumCard = Number(this.ordersChange[i].mixedPayment.sumCard)
                  //   this.sumCertificate = Number(this.ordersChange[i].mixedPayment.sumCertificate)
                  // }
                }
              }
            }
          }
          //если не был установлен способ оплаты ранее
          if (!setSelect)
            this.selected = this.order.paymentMethod.id
        }
        //если в заказе изначально указан спешанный способ оплаты и данные не были еще установлены
        if (!this.sumCash && !this.sumCard && !this.sumCertificate && this.selected === 7 && this.order.mixedPayment){
          //наличные this.order.mixedPayment
          this.sumCash = Number(this.order.mixedPayment.sumCash)
          //безналичные
          this.sumCard = Number(this.order.mixedPayment.sumCard)
          //сертификат
          this.sumCertificate = Number(this.order.mixedPayment.sumCertificate)
        }
        return true
      },
      //вычисление наличного способа оплаты для смешанного платежа
      getSumCash: function () {
        (this.sumCertificate && this.sumCard) ? (this.sumCash = this.totalPrice - this.sumCertificate - this.sumCard) :
          (this.sumCertificate ? (this.sumCash = this.totalPrice - this.sumCertificate):
            (this.sumCard ? (this.sumCash = this.totalPrice - this.sumCard): this.sumCash = this.totalPrice))
      },
      //отправка заказа
      orderChanges: function () {
        const {status, comment, totalPrice, sumCash, sumCard, sumCertificate} = this
        let id = this.orderId
        let order = this.orderId
        let paymentMethod = this.selected
        //если статус доставлен
        if (this.status === 1) {
          //если в заказе изначально был смешанный способ оплаты, и он был изменен
          if (this.order.paymentMethod.id === 7 && this.selected !== 7) {
            //вызываем action из хранилища на удаление данных смешанного платежа
            this.$store.dispatch(DELETE_MIXED_PAYMENTS, order)
            //если в заказе изначально не было смешанног платежа, но произошло изменение на него
          } else if (this.selected === 7) {
              if ((this.order.mixedPayment && (this.order.mixedPayment.sumCash !== sumCash || this.order.mixedPayment.sumCard !== sumCard ||
                this.order.mixedPayment.sumCertificate !== sumCertificate)) || !this.order.mixedPayment) {
                // console.log(this.order.mixedPayment, ' ', sumCash, ' ', sumCard, ' ', sumCertificate)
                  this.$store.dispatch(POST_MIXED_PAYMENTS, {order, sumCash, sumCard, sumCertificate})
              }
          }
          // else if (this.order.paymentMethod.id !== 7 && this.selected === 7) {
          //   // const {sumCash, sumCard, sumCertificate} = this
          //   //вызываем action из хранилища на добавление данных смешанного платежа
          //   this.$store.dispatch(POST_MIXED_PAYMENTS, {order, sumCash, sumCard, sumCertificate})
          //   //если был смешанный платеж и остался
          // } else if (this.selected === 7) {
          //   // const {sumCash, sumCard, sumCertificate} = this
          //   //вызываем action из хранилища на получение данных смешанного платежа по заказу
          //   this.$store.dispatch(GET_MIXED_PAYMENTS, order).then( () => {
          //     //если в хранилище есть массив с данными смещанного платежа и если данные различаются и введенными
          //     if (this.mixedPayments && (this.mixedPayments.sumCash !== sumCash || this.mixedPayments.sumCard !== sumCard ||
          //       this.mixedPayments.sumCertificate !== sumCertificate)) {
          //       let data = {}
          //       data.order = order
          //       data.payment = {order, sumCash, sumCard, sumCertificate}
          //       this.$store.dispatch(PATCH_MIXED_PAYMENTS, data)
          //     }
          //   }).catch ( () => {
          //     //отправляем данные заказа
          //     return this.$store.dispatch(POST_MIXED_PAYMENTS, {order, sumCash, sumCard, sumCertificate})
          //   })
          // }
        }
        //вызываем action на получение данных заказа
        this.$store.dispatch(GET_ORDER, order).then( () => {
          //формируем новые данные заказа и отправляем
          let data = {}
          data.id = order
          data.order = {status, comment, totalPrice, paymentMethod}
          return this.$store.dispatch(PATCH_ORDER, data)
        }).catch ( (error) => {
          if (error !== 'PATCH_ERROR')
          //отправляем данные заказа
            return this.$store.dispatch(POST_ORDER, {id, status, comment, totalPrice, paymentMethod})
        }).then( () => {
          if (this.responseServer){
            //скрываем модальное окно
            this.$refs.modalSend.hide()
            //очищаем статус чтобы не влиял на модальное окно
            this.status = 1
            //открываем список заказов в путевки
            this.$router.push('/orders/'+this.waibillId)
          }
        })
      },
    },
  }

</script>

<style scoped>
  .info-waybill {
    font-size: 14px;
  }
</style>
