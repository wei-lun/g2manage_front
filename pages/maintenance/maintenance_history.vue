<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-subheader> 歷史維護紀錄(歷史數量：{{ totalItems }}) </v-subheader>
      <v-data-table
        :headers="headers"
        :items="maintenanceHistory"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        show-expand
        hide-default-footer
      >
        <template v-slot:item.note="{ item }">
          <div class="text-no-wrap text-truncate" style="width: 300px;">
            {{ item.note }}
          </div>
        </template>
        <template v-slot:item.maintenance_type="{ item }">
          {{
            maintenanceType.find((i) => i.value === item.maintenance_type).name
          }}
          <v-tooltip bottom>
            <template
              v-if="item.maintenance_type === 'regular'"
              v-slot:activator="{ on }"
            >
              <v-icon class="ml-3" v-on="on">mdi-calendar-clock</v-icon>
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
          </v-tooltip>
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
        <template v-slot:expanded-item="{ item }">
          <td :colspan="headers.length">
            維護網站：
            <v-chip v-for="(i, k) in item.website" :key="k" class="ml-2">
              {{ item.website[k] }}
            </v-chip>
          </td>
        </template>
      </v-data-table>
      <pagination
        :total-items="totalItems"
        :pagination="pagination"
        :sort="sort"
        @fetch="init()"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { maintenanceHistoryList } from '~/plugins/api_route'
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
    }
  },
  data() {
    return {
      currentPage: '/maintenance/maintenance_history',
      maintenanceHistory: [],
      singleExpand: false,
      totalItems: 0,
      moment,
      sort: {},
      pagination: { rowsPerPage: 10, sortBy: ['date'], sortDesc: [false] },
      headers: [
        { text: '維護種類', value: 'maintenance_type' },
        { text: '開始時間', value: 'start_date', sortable: false },
        { text: '預計結束時間', value: 'end_date', sortable: false },
        { text: '上次結束時間', value: 'last_end_date', sortable: false },
        {
          text: '備註',
          value: 'note',
          sortable: false,
          width: 300,
          class: 'text-no-wrap'
        },
        { text: '網站', value: 'data-table-expand' }
      ],
      dl_status: null
    }
  },
  methods: {
    async init() {
      const self = this
      await maintenanceHistoryList({
        search: self.filter.search,
        page: this.pagination.page
      })
        .then(function(response) {
          self.maintenanceHistory = response.data.data
          self.totalItems = response.data.meta.pagination.total
        })
        .catch(function(error) {
          if (error) {
            self.maintenanceHistory = []
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
