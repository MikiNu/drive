<template>
  <div :class="[ type === '' ? '' : 'p-0', 'waybill']">
    <template v-if="type === ''">
      <router-link
        :to="{ name: 'Orders', params: { waybillId: waybill.id }}"
        :class="[ waybill.isCompleted ? 'text-success' : 'text-dark']"
      >
        <b-card class="mb-2 order">
          <div class="row justify-content-center">
            <i
              class="mr-2"
            >
              <v-icon
                name="car-side"
                scale="1"
              />
            </i>
            <span
              class="align-middle"
            >
              Путёвка {{ waybill.id }} от {{ waybill.date }}
            </span>
          </div>
        </b-card>
      </router-link>
    </template>
    <template v-else>
      <div class="menu-item">
        <router-link
          :to="{ name: 'Orders', params: { waybillId: waybill.id }}"
          :class="[ waybill.isCompleted ? 'text-success' : 'text-white-50', 'd-block' ]"
        >
          <i class="mr-2">
            <v-icon
              name="car-side"
              scale="1"
            />
          </i>
          <span class="align-middle">
            Путёвка {{ waybill.id }} от {{ waybill.date }}
          </span>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>

  export default {
    name: 'Waybill',
    //входной параметр - данные путевки
    props: {
      waybill: {
        type: Object,
        default: function () {
          return {}
        },
      },
      type: {
        type: String,
        default: '',
      },
    },
  }

</script>

<style scoped>
  .waybill a, .waybill a:focus, .waybill a:hover {
    text-decoration: none;
  }

  .menu-item {
    font-size: 1em;
  }
</style>
