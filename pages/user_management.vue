<template>
  <v-container fluid>
    <v-tabs
      v-if="
        !!submenu &&
          submenu.child.find((item) => item.to === $route.path) != undefined
      "
      color="blue darken-1"
      slider-color="primary"
      fixed-tabs
    >
      <template v-slot:default>
        <v-tab v-for="(n, index) in submenu.child" :key="index" :to="n.to">
          {{ n.title }}
        </v-tab>
      </template>
    </v-tabs>
    <v-row class="mt-5">
      <v-col cols="12" sm="auto">
        帳號類型
      </v-col>
      <!-- <v-col cols="12" sm="auto">
        <v-select
          v-model="filter.type"
          class="mr-2 input-height"
          height="30px"
          flat
          solo-inverted
          hide-details
          :items="[
            {
              name: '全部',
              value: ''
            },
            ...userTypeArr
          ]"
          item-text="name"
          item-value="value"
          label="使用者等級"
        />
      </v-col> -->
      <v-col cols="12" sm="auto">
        <v-btn-group
          v-model="filter.type"
          :items="[
            {
              name: '全部',
              value: ''
            },
            ...userTypeArr
          ]"
          :small="true"
          item-text="name"
          item-value="value"
        />
      </v-col>
    </v-row>
    <NuxtChild
      ref="userManagementChild"
      :filter="filter"
      :user-type-arr="userTypeArr"
    />
  </v-container>
</template>
<script>
import vBtnGroup from '~/components/btn_group.vue'

export default {
  components: {
    vBtnGroup
  },
  data() {
    return {
      filter: {
        type: ''
      },
      userTypeArr: [
        {
          name: '維運',
          value: 'O'
        },
        {
          name: '客服',
          value: 'C'
        },
        {
          name: '業務',
          value: 'S'
        }
      ]
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'user_management'
      )
    }
  },
  watch: {
    filter: {
      handler(val) {
        this.$refs.userManagementChild.setFilter()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {}
}
</script>
