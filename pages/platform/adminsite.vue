<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-subheader>營運項目設定(站台數量：{{ totalItems }})</v-subheader>
      <v-data-table
        :headers="headers"
        :items="sitestatus"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        hide-default-footer
      >
        <template v-slot:item.type="{ item }">
          <div v-if="!item.operate || item.operate.length == 0">
            <v-chip small>
              無資料
            </v-chip>
          </div>
          <div v-else-if="$vuetify.breakpoint.width > 1680">
            <v-chip v-for="(i, k) in item.operate" :key="k" small>
              {{ sortLobbyType(i) }}
            </v-chip>
          </div>
          <v-tooltip v-else max-width="200px" right>
            <template v-slot:activator="{ on }">
              <v-btn color="secondary" small v-on="on">顯示</v-btn>
            </template>
            <v-chip v-for="(i, k) in item.operate" :key="k" small dark>
              {{ sortLobbyType(i) }}
            </v-chip>
          </v-tooltip>
        </template>
        <template v-slot:item.cdn_setting="{ item }">
          <v-icon :color="item.cdn_setting === 'on' ? 'success' : 'danger'">{{
            item.cdn_setting === 'on' ? 'mdi-check' : 'mdi-close'
          }}</v-icon>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn color="primary" small @click.stop="openEditDialog(item)"
            >編輯</v-btn
          >
        </template>
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
      :website-status="websiteStatus"
      @callEdit="saveEdit"
    />
  </v-layout>
</template>

<script>
import { businessProject, websiteConfiguration } from '~/plugins/api_route'
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
    lobbyType: {
      type: Array,
      default() {
        return []
      }
    },
    platformType: {
      type: Array,
      default() {
        return []
      }
    },
    websiteStatus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentPage: '/platform/adminsite',
      editData: {},
      sitestatus: [],
      totalItems: 0,
      sort: {},
      pagination: {
        rowsPerPage: 10,
        sortBy: ['cdn_setting'],
        sortDesc: [false]
      },
      headers: [
        // { text: '序號', value: 'id' },
        { text: '網站代碼', value: 'website_code', sortable: false },
        { text: '網站名稱', value: 'website_name', sortable: false },
        { text: '娛樂城管理', value: '', sortable: false },
        { text: '營運類別管理', value: 'type', sortable: false },
        { text: '遊戲管理', value: '', sortable: false },
        { text: 'CDN設定', value: 'cdn_setting' },
        // { text: '相關網址', value: 'relate_url', sortable: false },
        { text: '操作', value: 'operation', sortable: false }
      ],
      dl_status: null
    }
  },
  methods: {
    sortLobbyType(type) {
      const typenum = this.lobbyType
        .map(function(item, index) {
          return item.value
        })
        .indexOf(type)
      if (typeof this.lobbyType[typenum] !== 'undefined')
        return this.lobbyType[typenum].shortName
      else return type
    },
    openEditDialog(item) {
      this.dl_status = item.website_code
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push(this.currentPage + '/edit')
    },
    async init() {
      await businessProject({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then((response) => {
          this.sitestatus = response.data.data
          this.totalItems = response.data.meta.pagination.total
        })
        .catch((error) => {
          if (error) {
            this.sitestatus = []
            this.totalItems = 0
          }
        })
    },
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.init()
      }
    },
    async saveEdit(data) {
      await websiteConfiguration(this.dl_status, data)
        .then((response) => {
          this.$store.dispatch('alert/success', '編輯成功')
          this.init()
          this.$router.push(this.currentPage)
        })
        .catch((error) => {
          if (error) {
            this.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    }
  }
}
</script>
