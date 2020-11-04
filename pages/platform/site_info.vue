<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-subheader>資料庫管理(站台數量：{{ totalItems }})</v-subheader>
      <v-data-table
        :headers="headers"
        :items="sitestatus"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        hide-default-footer
      >
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
    <NuxtChild :edit-data="editData" @callEdit="saveEdit" />
  </v-layout>
</template>

<script>
import { DBSetting, websiteConfiguration } from '~/plugins/api_route'
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
      currentPage: '/platform/site_info',
      editData: {},
      sitestatus: [],
      totalItems: 0,
      sort: {},
      pagination: { rowsPerPage: 10 },
      headers: [
        // { text: '序號', value: 'id' },
        { text: '網站代碼', value: 'website_code', sortable: false },
        { text: '網站名稱', value: 'website_name', sortable: false },
        { text: 'CCDB IP', value: 'ccdb_ip', sortable: false },
        { text: 'BRDB IP', value: 'brdb_ip', sortable: false },
        { text: 'BWDB IP', value: 'bwdb_ip', sortable: false },
        { text: 'GA前綴', value: 'ga_prefix', sortable: false },
        { text: '操作', value: 'operation', sortable: false }
      ],
      dl_status: null
    }
  },
  methods: {
    openEditDialog(item) {
      this.dl_status = item.website_code
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push(this.currentPage + '/edit')
    },
    async init() {
      await DBSetting({
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
