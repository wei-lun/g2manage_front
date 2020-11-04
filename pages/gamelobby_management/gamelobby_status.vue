<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        <v-layout> 娛樂城列表(娛樂城數量：{{ totalItems }}) </v-layout>
        <v-spacer></v-spacer>
        <v-layout wrap>
          <v-flex xs12 md4 mt-2 mr-2> </v-flex>
          <v-flex xs12 md5>
            <v-switch
              v-model="showCloseCasino"
              color="primary"
              label="顯示永久停用"
              hide-details
            ></v-switch>
          </v-flex>
        </v-layout>
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
        <template v-slot:item.status="{}">
          {{ itemFillter.text }}
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
      <confirmDialog
        ref="confirmDialog"
        text="永久關閉將不可回復，請問是否執行？"
        @confirmed="disable"
      ></confirmDialog>
      <NuxtChild
        :edit-data="editData"
        :lobby-type="lobbyType"
        :gamelobby-status="gamelobby_status"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { casinoList } from '~/plugins/api_route'
import confirmDialog from '~/components/confirm_dialog.vue'
import formValidation from '~/plugins/form_validation.js'
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
    },
    datetime: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      moment,
      search: '',
      sort: {},
      totalItems: null,
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '系統代碼', value: 'casino_id' },
        { text: '娛樂城名稱', value: 'cn_name' },
        { text: '優先順序', value: 'order' },
        { text: '上線醒目提示', value: 'notify_datetime' },
        { text: '狀態', value: 'status' },
        { text: '操作', value: 'operation', sortable: false },
        { text: '', value: 'save', sortable: false }
      ],
      itemFillter: [
        { text: '全部娛樂城', value: '1' },
        { text: '未開啟', value: '2' },
        { text: '維護中', value: '3' },
        { text: '暫時停用中', value: '4' }
      ],
      casinolist: [],
      showCloseCasino: false,
      dl_new: {
        website_switch: false,
        date: null
      },
      gamelobby_status: {
        casinoOff: '0',
        casinoOn: '1',
        casinoOffProcessing: '2',
        casinoEmg: '3',
        casinoEmgForCasinoOff: '30',
        casinoEmgForCasinoOn: '31',
        casinoEmgForCasinoCloseOff: '340',
        casinoEmgForCasinoCloseOn: '341',
        casinoClose: '4',
        casinoCloseForCasinoOff: '40',
        casinoCloseForCasinoOn: '41',
        casinoCloseForCasinoEmgOff: '430',
        casinoCloseForCasinoEmgOn: '431',
        casinoDeprecated: '5',
        casinoNew: 'new'
      },
      FV: formValidation.rules,
      editData: {},
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
              this.$store.dispatch('alert/danger', error.response.data.message)
            }
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
    openEditDialog(item) {
      this.dl_status = item.casino_id
      const temp = JSON.parse(JSON.stringify(item))
      const editdata = { ...temp, ...temp.url }
      delete editdata.url
      this.editData = editdata
      this.$router.push('/gamelobby_management/gamelobby_status/edit')
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
      // .catch((error)=> {
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
