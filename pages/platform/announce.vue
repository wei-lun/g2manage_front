<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        公告信息(公告數量：{{ totalItems }})
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="addAnnounce()">新增公告</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="sitestatus"
        :search="search"
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
          <v-btn color="secondary" small @click.stop="deleteDialog(item)"
            >刪除</v-btn
          >
        </template>
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
    }
  },
  data() {
    return {
      editData: {},
      search: '',
      sitestatus: [],
      totalItems: 0,
      sort: {},
      pagination: {
        rowsPerPage: 10,
        sortBy: ['update_time'],
        sortDesc: [false]
      },
      headers: [
        // { text: '序號', value: 'id' },
        { text: '序號', value: 'announce_code', sortable: false },
        { text: '信息標題', value: 'title', width: '600' },
        { text: '公告時間', value: 'update_time' },
        { text: '發送站數', value: 'siteNumber', sortable: false },
        { text: '最後更新者', value: 'updater', width: '215' },
        { text: '操作', value: 'operation', sortable: false }
      ],
      dl_status: null
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
    } /*,
    filter: {
      handler() {
        // eslint-disable-next-line no-console
        console.log(this.filter)
      },
      deep: true
    } */
  },
  methods: {
    openEditDialog(item) {
      this.dl_status = item.announce_code
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push('/platform/announce/edit')
    },
    addAnnounce() {
      this.$router.push('/platform/announce/add')
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
    },
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.init()
      }
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
