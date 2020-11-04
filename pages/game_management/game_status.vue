<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        <v-layout> 遊戲列表(遊戲數量：{{ totalItems }}) </v-layout>
        <v-spacer></v-spacer>
        <v-layout wrap>
          <v-flex xs12 md4 mt-2 mr-2> </v-flex>
          <v-flex xs12 md4 mt-2 mr-2>
            <v-select
              :items="itemFillter"
              :value="itemFillter[0]"
              label="所有"
              solo
              hide-details
            ></v-select>
          </v-flex>
          <v-flex xs12 md3>
            <v-switch
              color="primary"
              label="顯示永久停用"
              hide-details
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="gamelist"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        hide-default-footer
      >
        <template v-slot:item.online_mention="{ item }">
          {{ moment(item.online_mention).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-slot:item.switch="{ item }">
          <v-switch
            v-model="item.switch"
            true-value="on"
            false-value="off"
            color="primary"
            hide-details
            @click="
              setSwitch(item.id, 'gamelobby_switch', item.gamelobby_switch)
            "
          ></v-switch>
        </template>
        <template v-slot:item.maintain="{ item }">
          {{ moment(item.maintain).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-slot:item.disable="{ item }">
          <v-switch
            v-model="item.disable"
            true-value="on"
            false-value="off"
            color="primary"
            hide-details
            @click="
              setSwitch(
                item.id,
                'gamelobby_disable_switch',
                item.gamelobby_disable_switch
              )
            "
          ></v-switch>
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
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { gamesList } from '~/plugins/api_route'
import confirmDialog from '~/components/confirm_dialog.vue'
import pagination from '~/components/pagination.vue'

export default {
  components: { confirmDialog, pagination },
  data() {
    return {
      moment,
      search: '',
      sort: {},
      totalItems: 0,
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '遊戲中文名', align: 'right', value: 'cn_name' },
        { text: '遊戲英文名', align: 'right', value: 'en_name' },
        { text: '優先順序', value: 'sort' },
        { text: '上線醒目提示', value: 'online_mention' },
        { text: '關閉/開啟', value: 'switch' },
        { text: '維護狀態', value: 'maintain' },
        { text: '暫時停用', value: 'disable' },
        { text: '操作', value: 'operation', sortable: false }
      ],
      itemFillter: [
        { text: '全部娛樂城', value: '1' },
        { text: '未開啟', value: '2' },
        { text: '維護中', value: '3' },
        { text: '暫時停用中', value: '4' }
      ],
      gamelist: [],
      dl_status: null
    }
  },
  methods: {
    confirm(data) {
      this.$refs.confirmDialog.confirmDlg(data)
    },
    async init() {
      await gamesList({
        ...this.filter,
        ...this.sort,
        page: this.pagination.page
      })
        .then((response) => {
          this.gamelist = response.data.data
          this.totalItems = response.data.meta.pagination.total
        })
        .catch((error) => {
          if (error) {
            this.gamelist = []
            this.totalItems = 0
          }
        })
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
