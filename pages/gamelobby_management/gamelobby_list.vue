<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        娛樂城列表(娛樂城數量：{{ totalItems }})
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="casinolist"
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
        <template v-slot:item.setting="{ item }">
          <v-btn color="primary" small @click.stop="openConfigDialog(item)"
            >設定</v-btn
          >
        </template>
        <template v-slot:item.category="{ item }">
          <div v-if="!item.category || item.category.length == 0">
            <v-chip small>
              無資料
            </v-chip>
          </div>
          <div v-else-if="$vuetify.breakpoint.width > 1680">
            <v-chip v-for="(i, k) in item.category" :key="k" small>
              {{ sortLobbyType(i) }}
            </v-chip>
          </div>
          <v-tooltip v-else max-width="140px" right>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" small dark v-on="on">顯示</v-btn>
            </template>
            <v-chip v-for="(i, k) in item.category" :key="k" small>
              {{ sortLobbyType(i) }}
            </v-chip>
          </v-tooltip>
        </template>
      </v-data-table>
      <pagination
        :total-items="totalItems"
        :pagination="pagination"
        :sort="sort"
        @fetch="init()"
      />
      <confirmDialog
        ref="confirmDialog"
        text="永久關閉將不可回復，請問是否執行？"
        @confirmed="disable"
      ></confirmDialog>
    </v-flex>
    <NuxtChild :edit-data="editData" :lobby-type="lobbyType" />
  </v-layout>
</template>

<script>
import moment from 'moment'
import { casinoList } from '~/plugins/api_route'
import confirmDialog from '~/components/confirm_dialog.vue'
import pagination from '~/components/pagination.vue'

export default {
  components: { confirmDialog, pagination },
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
    }
  },
  data() {
    return {
      moment,
      editData: {},
      casinolist: [],
      sort: {},
      totalItems: null,
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '娛樂城代碼', value: 'casino_id' },
        { text: '娛樂城名稱', value: 'tw_name' },
        { text: '營運類別', value: 'category' },
        // { text: '娛樂城設定值', value: 'setting', sortable: false },
        // { text: '獨立站台設定', value: 'gamelobby_maintain_time' },
        { text: '事件歷程', value: 'note', sortable: false },
        { text: '操作', value: 'operation', sortable: false }
      ],
      itemFillter: [
        { text: '全部娛樂城', value: '1' },
        { text: '未開啟', value: '2' },
        { text: '維護中', value: '3' },
        { text: '暫時停用中', value: '4' }
      ],
      dl_status: null
    }
  },
  computed: {},
  watch: {},
  methods: {
    confirm(data) {
      this.$refs.confirmDialog.confirmDlg(data)
    },
    async init() {
      await casinoList({
        ...this.filter,
        ...this.sort,
        search: this.filter.search,
        page: this.pagination.page,
        items: this.pagination.itemsPerPage
      })
        .then((response) => {
          this.casinolist = response.data.data
          this.totalItems = response.data.meta.pagination.total
        })
        .catch((error) => {
          if (error) {
            if (error.response.status !== 401) {
              this.casinolist = []
              this.$store.dispatch('alert/danger', '查無資料')
            }
            this.totalItems = 0
          }
        })
    },
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
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.init()
      }
    },
    openConfigDialog(item) {
      this.dl_status = item.casino_id
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push('/gamelobby_management/gamelobby_list/config')
    },
    openEditDialog(item) {
      this.dl_status = item.casino_id
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push('/gamelobby_management/gamelobby_list/edit')
    },
    async setSwitch(id, key, data) {
      await this.$axios
        .$patch('/gamelobbylist/' + id, {
          [key]: !data
        })
        .then((response) => {
          this.init()
          this.$store.dispatch('alert/success', '編輯成功')
        })
      // .catch((error) =>{
      //   if (error) {
      //   }
      // })
    },
    async disable(data) {
      await this.$axios
        .$patch('/gamelobbylist/' + data.id, {
          gamelobby_disable: !data.data
        })
        .then((response) => {
          this.init()
          this.$store.dispatch('alert/success', '編輯成功')
        })
      // .catch((error)=> {
      //   if (error) {
      //   }
      // })
    }
  }
}
</script>
