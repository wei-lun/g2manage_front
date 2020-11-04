<template>
  <v-layout row justify-center align-center>
    <v-flex class="px-3" xs12>
      <v-card-title class="subtitle-1">
        遊戲類別列表(類別數量：{{ totalItems }})
        <v-spacer></v-spacer>
        <v-flex xs12 md4 mt-2 mr-2>
          <v-text-field
            v-model="search"
            class="input-height"
            height="30px"
            append-icon="mdi-magnify"
            flat
            clear-icon="mdi-close"
            clearable
            label="搜尋"
            solo
            hide-details
          ></v-text-field>
        </v-flex>
        <addGameType ref="addGameType" @callAddNewSite="add"></addGameType>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="gametypelist"
        :server-items-length="totalItems"
        :options.sync="pagination"
        :loading="$store.state.loading.inprogress"
        :must-sort="true"
        hide-default-footer
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.game_type_id }}</td>
            <td class="text-xs-center">
              {{ props.item.game_type }}
            </td>
            <td class="text-xs-center">
              <v-btn
                color="primary"
                small
                dark
                @click.stop="openEditDialog(props.item.id)"
                >編輯</v-btn
              >
            </td>
          </tr>
        </template>
      </v-data-table>
      <pagination
        :total-items="totalItems"
        :pagination="pagination"
        :sort="sort"
        @fetch="init()"
      />
    </v-flex>
    <editGameType ref="editGameType" @callEdit="saveEdit"></editGameType>
  </v-layout>
</template>

<script>
import addGameType from '~/components/multi_settings/add_gametype.vue'
import editGameType from '~/components/multi_settings/edit_gametype.vue'
import pagination from '~/components/pagination.vue'

export default {
  components: { editGameType, addGameType, pagination },
  data() {
    return {
      search: '',
      sort: {},
      totalItems: 0,
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: '類別代號', value: 'game_type_id' },
        { text: '類別名稱', value: 'game_type' },
        { text: '操作', value: '', align: 'center', sortable: false }
      ],
      lobbyType: [
        { name: '電子遊藝', value: 'game' },
        { name: '真人視訊', value: 'live' },
        { name: '彩票遊戲', value: 'lottery' },
        { name: '捕魚達人', value: 'fishing' },
        { name: '棋牌遊戲', value: 'chess' },
        { name: '體育賽事', value: 'sport' }
      ],
      gametypelist: [],
      dl_status: null
    }
  },
  created() {},
  methods: {
    openEditDialog(id) {
      this.dl_status = id
      const editdata = JSON.parse(JSON.stringify(this.gametypelist[id - 1]))
      this.$refs.editGameType.openEdit(editdata)
    },
    async init() {
      // const gametypelist = await this.$axios.$get('/gametypelist')
      // this.gametypelist = gametypelist
      // this.pagination.totalItems = this.gametypelist.length
    },
    async add(data) {
      await this.$axios.$post('/gametypelist', data).then((response) => {
        this.init()
        this.$refs.addGameType.closeAddDialog()
        this.$store.dispatch('alert/success', '新增成功')
      })
      // .catch((error) =>{
      //   if (error) {
      //   }
      // })
    },
    async saveEdit(data) {
      await this.$axios
        .$patch('/gametypelist/' + this.dl_status, data)
        .then((response) => {
          this.init()
          this.$refs.editGameType.closeEdit()
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
