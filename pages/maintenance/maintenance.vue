<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-subheader> 站台維護數量(維護數量：{{ totalItems }}) </v-subheader>
      <v-data-table
        :headers="headers"
        :items="maintenance"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        show-expand
        hide-default-footer
      >
        <template v-slot:item.start_date="{ item }">
          <div class="text-no-wrap text-truncate">
            <template v-if="item.maintenance_type === 'regular'">
              {{ moment(item.start_date).format('HH:mm:ss') }}
            </template>
            <template v-else>
              {{ item.start_date }}
            </template>
          </div>
        </template>
        <template v-slot:item.end_date="{ item }">
          <div class="text-no-wrap text-truncate">
            <template v-if="item.maintenance_type === 'regular'">
              {{ moment(item.end_date).format('HH:mm:ss') }}
            </template>
            <template v-else>
              {{ item.end_date }}
            </template>
          </div>
        </template>
        <template v-slot:item.execution_status="{ item }">
          <div v-if="item.execution_status" class="text-no-wrap text-truncate">
            {{
              executionStatus.find((i) => i.value === item.execution_status)
                .name
            }}
          </div>
        </template>
        <template v-slot:item.execution_status="{ item }">
          <div v-if="item.execution_status" class="text-no-wrap text-truncate">
            {{
              executionStatus.find((i) => i.value === item.execution_status)
                .name
            }}
          </div>
        </template>
        <template v-slot:item.note="{ item }">
          <div class="text-no-wrap text-truncate">
            {{ item.note }}
          </div>
        </template>
        <template v-slot:item.maintenance_type="{ item }">
          <div class="text-no-wrap text-truncate">
            <v-chip
              :color="
                maintenanceStatus.find((i) => i.value === item.status).color
              "
              small
              filled
            >
              {{ maintenanceStatus.find((i) => i.value === item.status).name }}
            </v-chip>

            <v-tooltip v-if="$vuetify.breakpoint.width < 1680" bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  :color="
                    maintenanceStatus.find((i) => i.value === item.status).color
                  "
                  v-on="on"
                  >mdi-brightness-1</v-icon
                >
              </template>
              {{ maintenanceStatus.find((i) => i.value === item.status).name }}
            </v-tooltip>
            {{
              maintenanceType.find((i) => i.value === item.maintenance_type)
                .name
            }}
            <v-tooltip bottom>
              <template
                v-if="item.maintenance_type === 'regular'"
                v-slot:activator="{ on }"
              >
                <v-btn color="secondary" small class="ml-3" v-on="on"
                  >顯示</v-btn
                >
              </template>
              <template v-if="item.cycle !== null">
                {{ frequency.find((i) => i.value === item.cycle).name }}
              </template>
              <template v-if="item.cycle === 'WEEKLY'">
                {{ byday.find((i) => i.value === item.byday).name }}
              </template>
              <template v-if="item.cycle === 'MONTHLY'">
                {{ bydate.find((i) => i.value === item.byday).name }}
              </template>
              <template v-if="item.last_end_date !== null">
                <br />上次結束時間：{{ item.last_end_date }}
              </template>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          {{ maintenanceStatus.find((i) => i.value === item.status).name }}
          <v-icon
            :color="
              maintenanceStatus.find((i) => i.value === item.status).color
            "
            >mdi-brightness-1</v-icon
          >
        </template>
        <template v-slot:item.website="{ item }">
          {{ item.website.join('、') }}
        </template>
        <template v-slot:item.operation="{ item }">
          <template v-if="item.execution_status == 'maintain'">
            <v-btn color="warning" small @click.stop="openFinishDialog(item)"
              >完成</v-btn
            >
          </template>
          <template v-else-if="item.execution_status === 'finish'">
            <v-btn color="success" small @click.stop="openCheckDialog(item)"
              >確認</v-btn
            >
          </template>
          <template v-else-if="item.maintenance_type === 'reserve'">
            <v-btn color="warning" small @click.stop="openCancelDialog(item)"
              >取消</v-btn
            >
          </template>
          <template v-else>
            <v-btn color="primary" small @click.stop="openEditDialog(item)"
              >編輯</v-btn
            >
          </template>
        </template>
        <template v-slot:expanded-item="{ item }">
          <td :colspan="headers.length">
            維護網站：
            <v-chip v-for="(i, k) in item.website" :key="k" class="ml-2">
              {{
                typeof item.website[k] === 'object'
                  ? item.website[k].name
                  : item.website[k]
              }}
            </v-chip>
          </td>
        </template>
        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <pagination
        :total-items="totalItems"
        :pagination="pagination"
        :sort="sort"
        @fetch="init()"
      />
    </v-flex>
    <NuxtChild
      :edit-data="editData"
      :check-data="checkData"
      :finish-data="finishData"
      :maintenance-type="maintenanceType"
      :frequency="frequency"
      :maintenance-status="maintenanceStatus"
      :execution-status="executionStatus"
      :byday="byday"
      :bydate="bydate"
      :website-list="websiteList"
      @callEdit="saveEdit"
      @callCancel="cancel"
      @callCheck="saveCheck"
      @callFinish="finishMaintenance"
    />
  </v-layout>
</template>

<script>
import moment from 'moment'
import {
  maintenanceList,
  maintenanceConfiguration,
  csConfirmation,
  csChangeExecutionStatus
} from '~/plugins/api_route'
import pagination from '~/components/pagination.vue'

export default {
  components: {
    pagination
  },
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    },
    maintenanceType: {
      type: Array,
      default() {
        return []
      }
    },
    frequency: {
      type: Array,
      default() {
        return []
      }
    },
    maintenanceStatus: {
      type: Array,
      default() {
        return []
      }
    },
    executionStatus: {
      type: Array,
      default() {
        return []
      }
    },
    byday: {
      type: Array,
      default() {
        return []
      }
    },
    bydate: {
      type: Array,
      default() {
        return []
      }
    },
    websiteList: {
      type: Array,
      default() {
        return []
      }
    },
    sitestatus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentPage: '/maintenance/maintenance',
      editData: {},
      checkData: {},
      finishData: {},
      maintenance: [],
      maintenanceConfiguration: {},
      singleExpand: false,
      totalItems: 0,
      moment,
      sort: {},
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '維護種類', value: 'maintenance_type', sortable: false },
        { text: '開始時間', value: 'start_date', sortable: false },
        { text: '預計結束時間', value: 'end_date', sortable: false },
        {
          text: '備註',
          value: 'note',
          sortable: false,
          width: 300,
          class: 'text-no-wrap'
        },
        { text: '維護狀態', value: 'execution_status', sortable: false },
        { text: '操作', value: 'operation', sortable: false },
        { text: '網站', value: 'data-table-expand' }
      ],
      dl_status: null,
      rec: '收到的数据'
    }
  },
  methods: {
    openEditDialog(item) {
      this.dl_status = item.id
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp }
      this.editData = editdata
      this.$router.push(this.currentPage + '/edit')
    },
    openCancelDialog(item) {
      this.dl_status = item.id
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp }
      this.editData = editdata
      this.$router.push(this.currentPage + '/cancel')
    },
    openCheckDialog(item) {
      this.dl_status = item.id
      const temp = JSON.parse(JSON.stringify(item))
      const checkdata = { ...temp }
      this.checkData = checkdata
      this.$router.push(this.currentPage + '/check')
    },
    openFinishDialog(item) {
      this.dl_status = item.id
      const temp = JSON.parse(JSON.stringify(item))
      const finishdata = { ...temp }
      this.finishData = finishdata
      this.$router.push(this.currentPage + '/finish')
    },
    async saveEdit(data) {
      const self = this
      await maintenanceConfiguration(this.dl_status, data)
        .then(function(response) {
          self.$store.dispatch('alert/success', '編輯成功')
          self.$router.push(self.currentPage)
        })
        .catch(function(error) {
          if (error) {
            self.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    },
    async cancel(data) {
      const self = this
      await maintenanceConfiguration(this.dl_status, data)
        .then(function(response) {
          self.$store.dispatch('alert/success', '已取消')
          self.$router.push(self.currentPage)
        })
        .catch(function(error) {
          if (error) {
            self.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    },
    async saveCheck(data) {
      const self = this
      await csConfirmation(data.id)
        .then(function(response) {
          self.$store.dispatch('alert/success', '已確認')
          self.$router.push(self.currentPage)
        })
        .catch(function(error) {
          if (error) {
            self.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    },
    async finishMaintenance(data) {
      const self = this
      await csChangeExecutionStatus(this.dl_status, data)
        .then(function(response) {
          self.$store.dispatch('alert/success', '已完成')
          self.$router.push(self.currentPage)
        })
        .catch(function(error) {
          if (error) {
            self.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    },
    async init() {
      const self = this
      await maintenanceList({
        search: self.filter.search,
        page: this.pagination.page
      })
        .then(function(response) {
          self.maintenance = response.data.data
          self.totalItems = response.data.meta.pagination.total
        })
        .catch(function(error) {
          if (error) {
            self.maintenance = []
            self.totalItems = 0
          }
        })
    },
    set_filter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.init()
      }
    }
  }
}
</script>
