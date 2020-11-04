<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        遊戲列表(遊戲數量：{{ totalItems }})
        <v-spacer></v-spacer>
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
    <editGame
      ref="editGame"
      :lobby-type="lobbyType"
      @callEdit="saveEdit"
    ></editGame>
  </v-layout>
</template>

<script>
import { gamesList } from '~/plugins/api_route'
import editGame from '~/components/gamelobby_management/edit_game.vue'
import pagination from '~/components/pagination.vue'

export default {
  components: { editGame, pagination },
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      search: '',
      sort: {},
      totalItems: 0,
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '遊戲中文名', align: 'right', value: 'cn_name' },
        { text: '遊戲英文名', align: 'right', value: 'en_name' },
        { text: '娛樂城', align: 'right', value: 'casino' },
        { text: '遊戲分類', align: 'right', value: 'type' },
        { text: '子類別', align: 'right', value: 'sub_type' },
        {
          text: '顯示平台',
          align: 'right',
          value: 'platform',
          sortable: false
        },
        {
          text: '遊戲設定值',
          align: 'right',
          value: 'setting',
          sortable: false
        },
        { text: '操作', align: 'center', value: 'operation', sortable: false }
      ],
      lobbyType: [
        { name: '電子遊藝', value: 'game' },
        { name: '真人視訊', value: 'live' },
        { name: '彩票遊戲', value: 'lottery' },
        { name: '捕魚達人', value: 'fishing' },
        { name: '棋牌遊戲', value: 'chess' },
        { name: '體育賽事', value: 'sport' }
      ],
      gamelist: [],
      dl_status: null
    }
  },
  methods: {
    openEditDialog(id) {
      this.dl_status = id
      const editdata = JSON.parse(JSON.stringify(this.gamelist[id - 1]))
      this.$refs.editGame.openEdit(editdata)
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
    async add(data) {
      await this.$axios.$post('/gamelist', data).then((response) => {
        this.init()
        this.$refs.addGame.closeAddDialog()
        this.$store.dispatch('alert/success', '新增成功')
      })
      // .catch((error) =>{
      //   if (error) {
      //   }
      // })
    },
    setFilter() {
      if (this.pagination.page !== 1) this.pagination.page = 1
      else {
        this.init()
      }
    },
    async saveEdit(data) {
      await this.$axios
        .$patch('/gamelist/' + this.dl_status, data)
        .then((response) => {
          this.init()
          this.$refs.editGame.closeEdit()
          this.$store.dispatch('alert/success', '編輯成功')
        })
      // .catch((error)=> {
      //   if (error) {
      //   }
      // })
    },
    async setSwitch(id, data) {
      await this.$axios
        .$patch('/gamelist/' + id, {
          game_switch: !data
        })
        .then((response) => {
          this.init()
          this.$store.dispatch('alert/success', '編輯成功')
        })
      // .catch((error) =>{
      //   if (error) {
      //   }
      // })
    }
  }
}
</script>
