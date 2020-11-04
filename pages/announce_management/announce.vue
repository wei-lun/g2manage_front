<template>
  <v-layout row justify-center align-center>
    <v-flex xs12 md11 lg10>
      <v-card-title>
        公告信息(公告數量：{{ totalItems }})
        <div class="flex-grow-1"></div>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="addAnnounce()">新增公告</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="sitestatusItem"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        hide-default-footer
      >
        <template v-slot:item.site="{ item }">
          <div v-for="(i, k) in item.sitename" :key="k" small>
            {{ item.sitename[k] }}
          </div>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn color="primary" small @click.stop="openEditDialog(item)"
            >閱讀</v-btn
          >
        </template>
        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination
          v-model="pagination.page"
          :length="pages"
          :total-visible="$vuetify.breakpoint.xsOnly ? 5 : 7"
        ></v-pagination>
      </div>
    </v-flex>
    <NuxtChild
      :edit-data="editData"
      :site-name="siteName"
      @callEdit="saveEdit"
    />
  </v-layout>
</template>

<script>
import { announceList, announceEdit } from '~/plugins/api_route'

export default {
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
    siteName: {
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
    },
    datetime: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      editData: {},
      search: '',
      sitestatus: [],
      sitestatusItem: [],
      totalItems: null,
      sort: {},
      pagination: {
        rowsPerPage: 10,
        sortBy: ['announce_code'],
        sortDesc: [false]
      },
      headers: [
        { text: '序號', value: 'announce_code', sortable: false },
        { text: '信息標題', value: 'title', width: '600' },
        { text: '公告時間', value: 'update_time' },
        { text: '發送站數', value: 'site', sortable: false },
        { text: '最後更新者', value: 'updater', width: '215' },
        { text: '操作', value: 'operation', sortable: false }
      ],
      dl_status: null,
      dialog: false
    }
  },
  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null || this.totalItems == null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    pagination: {
      handler() {
        this.sort.order_by =
          !!this.pagination.sortBy[0] === true ? this.pagination.sortBy[0] : ''
        this.sort.sort = !!this.pagination.sortDesc[0] === true ? 'DESC' : 'ASC'
        this.init()
      },
      deep: true
    }
  },
  methods: {
    openEditDialog(item) {
      this.dl_status = item.announce_code
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push('/announce_management/announce/edit')
    },
    openRemoveDialog(item) {
      this.dl_status = item.announce_code
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.dialog = !this.dialog
    },
    addAnnounce() {
      this.$router.push('/announce_management/announce/add')
    },
    async init() {
      const self = this
      await announceList({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then(function(response) {
          self.sitestatus = response.data.data
          self.totalItems = response.data.meta.pagination.total
        })
        .catch(function(error) {
          if (error) {
            if (error.response.status !== 401) {
              self.sitestatus = []
              self.$store.dispatch('alert/danger', error.response.data.message)
            }
            self.totalItems = 0
          }
        })
      this.sitestatusItem = self.sitestatus
    },
    async saveEdit(data) {
      const self = this
      await announceEdit(this.dl_status, data)
        .then(function(response) {
          self.$store.dispatch('alert/success', '編輯成功')
          self.init()
        })
        .catch(function(error) {
          if (error) {
            self.$store.dispatch('alert/danger', error.response.data.message)
          }
        })
    }
  }
}
</script>
