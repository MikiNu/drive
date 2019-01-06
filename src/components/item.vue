<template>
  <div class="order">
    <b-card :class="[(itemChanges || amountChange || priceChange) ? 'border-danger':'','mb-2 order']">
      <b-row class="mb-2 item">
        <b-col cols="12">
          <b-row align-v="center">
            <b-col cols="4">
              <a
                :id="item.id"
                v-b-modal="'img-'+item.id"
                href="#"
                @click.prevent
              >
                <img
                  :src="item.element.image"
                  height="80px"
                >
              </a>
            </b-col>
            <b-col
              cols="8"
              class="text-right"
            >
              <template v-if="!status">
                <a
                  :id="item.id"
                  v-b-modal="'change-'+item.id"
                  href="#"
                  @click.prevent
                >
                  <div class="text-justify pt-2">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="!checkPriceAndAmount"
                    class="text-center text-success font-weight-bold pb-2 pt-2"
                  >
                    <span :class="[priceChange ? 'text-danger':'']">
                      {{ item.price }}
                    </span> x <span :class="[amountChange ? 'text-danger':'']">
                      {{ item.amount }}
                    </span> = <span :class="[(amountChange || priceChange) ? 'text-danger':'']">
                      {{ (parseFloat(item.amount)*parseFloat(item.price)).toFixed(2) }}
                    </span>
                  </div>
                  <div
                    v-if="checkPriceAndAmount"
                    class="text-center text-danger font-weight-bold pb-2 pt-2"
                  >
                    Ошибка!
                  </div>
                </a>
              </template>
              <template v-else>
                <div class="text-justify pt-2">
                  {{ item.name }}
                </div>
                <div
                  v-if="!checkPriceAndAmount"
                  class="text-center text-success font-weight-bold pb-2 pt-2"
                >
                  <span :class="[priceChange ? 'text-danger':'']">
                    {{ item.price }}
                  </span> x <span :class="[amountChange ? 'text-danger':'']">
                    {{ item.amount }}
                  </span> = <span :class="[(amountChange || priceChange) ? 'text-danger':'']">
                    {{ (parseFloat(item.amount)*parseFloat(item.price)).toFixed(2) }}
                  </span>
                </div>
                <div
                  v-if="checkPriceAndAmount"
                  class="text-center text-danger font-weight-bold pb-2 pt-2"
                >
                  Ошибка!
                </div>
              </template>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
    <b-modal
      :id="'img-'+item.id"
      ref="modalChangeItem"
      centered
      :title="item.name"
      hide-footer
    >
      <div class="mx-auto d-table">
        <img :src="item.element.image">
      </div>
    </b-modal>
    <b-modal
      :id="'change-'+item.id"
      ref="modalChangeItem"
      centered
      title="Редактирование товара"
      hide-footer
      @hidden="onHidden"
    >
      <b-form
        @submit.prevent="saveChangeItem"
      >
        <b-row>
          <b-col cols="12">
            <p class="text-center">
              {{ item.name }}
            </p>
            <b-row align-v="center">
              <b-col cols="4">
                <img
                  :src="item.element.image"
                  height="80px"
                >
              </b-col>
              <b-col
                cols="8"
              >
                Цена за шт.:
                <b-form-input
                  v-model="priceValue"
                  type="number"
                  pattern="\d+(\.\d{2})?"
                  placeholder="Введите сумму"
                  class="text-center"
                />
                Количество:
                <b-form-input
                  v-model="amountValue"
                  type="number"
                  pattern="[0-9]+$"
                  placeholder="Введите количество"
                  class="text-center"
                />
              </b-col>
            </b-row>
            <div
              v-if="checkPriceAndAmountEdit"
              class="text-danger font-weight-bold text-center pt-2"
            >
              Поле не может быть пустым или отрицательным!
            </div>
            <div
              v-else
              class="text-right pt-2"
            >
              Итого: <span class="text-danger font-weight-bold">
                {{ (parseFloat(amountValue)*parseFloat(priceValue)).toFixed(2) }}
              </span>
            </div>
            <b-btn
              variant="success"
              block
              class="mt-2"
              type="submit"
              :disabled="checkPriceAndAmountEdit"
            >
              Сохранить
            </b-btn>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {GET_ORDERS_ELEMENT, POST_ORDER_ELEMENT, PATCH_ORDER_ELEMENT} from '../store/actions/elements.js'
  // import {GET_ORDERS} from '../store/actions/orders.js'

  export default {
    name: 'Item',
    props: {
      //входные параметры из родителя-данные о позиции товара
      item:{
        type: Object,
        default: function() {
          return {}
        },
      },
      //id заказа
     orderId:{
        type: Number,
        default: 0,
      },
      //статус заказа
      status:{
        type: Boolean,
        default: false,
      },
    },
    //переменные для редактирования товара
    data() {
      return {
        priceChange: false,
        amountChange: false,
        priceValue: this.item.price,
        amountValue: this.item.amount,
      }
    },
    computed: {
      //слушаем массив с элементами в хранилище
      ...mapGetters(['elements']),
      //изменение товара
      itemChanges:function(){
        this.setPriceValue()
        this.setAmountValue()
        if (this.item.itemChange) {
          if (this.item.itemChange === "price") {
            this.changePrice(true)
            this.changeAmount(false)
          }else if (this.item.itemChange === "amount") {
            this.changeAmount(true)
            this.changePrice(false)
          }else if (this.item.itemChange === "all") {
            this.changePrice(true)
            this.changeAmount(true)
          }else{
            this.changePrice(false)
            this.changeAmount(false)
          }
          return true
        }else{
          this.changePrice(false)
          this.changeAmount(false)
          return false
        }
      },
      // проверка полей цены и кол-во позиции товара на существование и отрицательное значение
      checkPriceAndAmount:function(){
        if (!this.item.price || ( this.item.price < 0 ) || ( this.item.amount < 0 ) ) {
          return true
        }else
          return false
      },
      //проверка редактируемых полей у товара
      checkPriceAndAmountEdit:function(){
        if (!this.priceValue || (!this.amountValue && this.amountValue!==0) || ( this.priceValue < 0 ) || ( this.amountValue < 0 ) ) {
          return true
        }else
          return false
      },
    },
    methods: {
      //при закрытии модального окна устанавливаем старые значения
      onHidden () {
        this.priceValue=this.item.price
        this.amountValue=this.item.amount
      },
      //сохранение изменения данных позиции товара
      saveChangeItem: function () {
        //определяем данные для отправки
        let price = Number(this.priceValue)
        let amount = Number(this.amountValue)
        let order =  Number(this.orderId)
        let element =  Number(this.item.element.id)
        let id =""
        //проверяем были ли изменения цены и кол-ва товара
        if ((price !== this.item.price) || (amount !== this.item.amount)){
          //вызов action из хранилища на получение изменений по заказу
          this.$store.dispatch(GET_ORDERS_ELEMENT, order).then(() => {
            let data = {}
            data.item = {order, element, price, amount}
            data.order = order
            //если массив с товарами в хранилище существует
            if (this.elements) {
              for (let i = 0; i < this.elements.length; i++) {
                //если в измененном массиве уже есть изменяемый элемент
                if (this.elements[i].element.id === this.item.element.id) {
                  id = Number(this.elements[i].id)
                  data.id = id
                  this.$store.dispatch(PATCH_ORDER_ELEMENT, data)
                }
              }
              //если в массиве не было данного товара
              if (!id) {
                this.$store.dispatch(POST_ORDER_ELEMENT, data)
              }
              //если в хранилище массив с товарами пуст
            } else {
              this.$store.dispatch(POST_ORDER_ELEMENT, data)
            }

          })
        }
        //закрытие модального окна
        this.$refs.modalChangeItem.hide()
      },
      //изменения кол-ва
      changeAmount: function(value){
        this.amountChange = value
      },
      //изменения цены
      changePrice: function(value){
        this.priceChange = value
      },
      //установка изменяемым данным начальных значений
      setPriceValue: function(){
        this.priceValue=this.item.price
      },
      setAmountValue: function(){
        this.amountValue=this.item.amount
      }
    },
  }

</script>

<style scoped>
  .item{
    font-size: 14px;
  }
  .order a,.order a:hover {
    text-decoration: none;
    color: unset;
  }
</style>