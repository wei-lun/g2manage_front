<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-toolbar flat height="40px" extension-height="36px">
        <v-spacer></v-spacer>
        <addMaintenanceDialog
          ref="addMaintenanceDialog"
          :maintenance-type="maintenanceType"
          :frequency="frequency"
          :maintenance-status="maintenanceStatus"
          :execution-status="executionStatus"
          :byday="byday"
          :bydate="bydate"
          :website-list="websiteList"
          class="mr-2"
          @callAddNewMaintenance="add"
        ></addMaintenanceDialog>
        <v-text-field
          v-model="filter.search"
          class="input-height"
          height="30px"
          append-icon="mdi-magnify"
          flat
          clear-icon="mdi-close"
          clearable
          label="搜尋"
          solo-inverted
          hide-details
          @click:clear="
            ;[delete filter.search, $refs.platformChild.set_filter()]
          "
          @keyup.enter="$refs.platformChild.set_filter()"
          @click:append="$refs.platformChild.set_filter()"
        ></v-text-field>
        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs
            v-if="
              !!submenu &&
                submenu.child.find((item) => item.to === $route.path) !=
                  undefined
            "
            color="blue darken-1"
            slider-color="primary"
            fixed-tabs
          >
            <template v-slot:default>
              <v-tab
                v-for="(n, index) in submenu.child"
                :key="index"
                :to="n.to"
              >
                {{ n.title }}
              </v-tab>
            </template>
          </v-tabs>
        </template>
      </v-toolbar>
    </template>
    <NuxtChild
      ref="platformChild"
      :filter="filter"
      :maintenance-type="maintenanceType"
      :frequency="frequency"
      :maintenance-status="maintenanceStatus"
      :execution-status="executionStatus"
      :byday="byday"
      :bydate="bydate"
      :website-list="websiteList"
    />
  </v-container>
</template>

<script>
import Stomp from 'stompjs'
import { maintenanceAddition } from '~/plugins/api_route'
import addMaintenance from '~/components/maintenance/add_maintenance.vue'

export default {
  components: { addMaintenanceDialog: addMaintenance },
  data() {
    return {
      filter: {
        search: ''
      },
      maintenanceType: [
        { name: '固定維護', value: 'regular' },
        { name: '緊急維護', value: 'emergency' },
        { name: '預約維護', value: 'reserve' }
      ],
      frequency: [
        { name: '每周', value: 'WEEKLY' },
        { name: '每月', value: 'MONTHLY' }
      ],
      maintenanceStatus: [
        { name: '啟用', color: 'success', value: 'start' },
        { name: '暫停', color: 'warning', value: 'pause' },
        { name: '取消', color: 'danger', value: 'cancel' },
        { name: '已結束', color: 'warning', value: 'finish' }
      ],
      executionStatus: [
        { name: '維護中', color: 'success', value: 'maintain' },
        { name: '已結束', color: 'warning', value: 'finish' },
        { name: '已開站', color: 'danger', value: 'open' }
      ],
      byday: [
        { name: '星期天', value: 'SUN' },
        { name: '星期一', value: 'MON' },
        { name: '星期二', value: 'TUE' },
        { name: '星期三', value: 'WED' },
        { name: '星期四', value: 'THU' },
        { name: '星期五', value: 'FRI' },
        { name: '星期六', value: 'SAT' }
      ],
      bydate: [],
      websiteList: [],
      sitestatus: []
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'maintenance'
      )
    }
  },
  created() {
    for (let i = 0; i < 31; i++) {
      this.bydate.push({
        name: i + 1 + '號',
        value: String(i + 1)
      })
    }
  },
  mounted() {
    this.connect()
  },
  destroyed() {
    this.disconnect()
  },
  methods: {
    async add(data) {
      const self = this
      await maintenanceAddition(data)
        .then(function(response) {
          self.$refs.platformChild.init()
          self.$refs.addMaintenanceDialog.closeAddDialog()
          self.$store.dispatch('alert/success', '新增成功')
        })
        .catch(function(error) {
          if (error) {
            if (error.response.status === 400) {
              self.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查資料是否正確'
              )
              self.$refs.addMaintenanceDialog.asyncValidate(
                JSON.parse(error.response.data.message)
              )
            }
          }
        })
    },
    statusUpdate() {
      const self = this

      if (self.$refs.platformChild.currentPage === '/maintenance/maintenance') {
        self.$refs.platformChild.init()
        self.$store.dispatch('alert/success', '一筆維護狀態已更新')
      }
    },
    addHistorry() {
      const self = this

      if (
        self.$refs.platformChild.currentPage ===
        '/maintenance/maintenance_history'
      ) {
        self.$refs.platformChild.init()
        alert('新增一筆歷史維護紀錄')
      }
    },
    connect() {
      const vm = this
      vm.client = Stomp.client(process.env.mqUrl)
      const headers = process.env.mqheader

      // vm.client.debug = null
      vm.client.connect(
        headers.login,
        headers.passcode,
        (frame) => {
          // console.info('连接成功!');
          this.connected = true

          vm.client.subscribe('/exchange/front_notify', function(data) {
            const datas = JSON.parse(data.body)

            if (datas.to === 'maintenance_setting') {
              vm.statusUpdate()
            } else if (datas.to === 'maintenance_history') {
              vm.addHistorry()
            }
          })
        },
        (error) => {
          // console.info('连接失败!')
          console.log(error)
          this.connected = false
        },
        headers.vhost
      )
    },
    disconnect() {
      this.client.disconnect()
      console.log('Disconnected')
    }
  }
}
</script>
