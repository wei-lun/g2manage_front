<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-toolbar flat height="40px" extension-height="36px">
        <v-spacer></v-spacer>
        <addGamelobby :lobby-type="lobbyType" class="mr-2" />
        <v-flex xs12 md4 mr-2>
          <v-select
            :items="itemFillter"
            :value="itemFillter[0]"
            label="所有"
            class="mr-2 input-height"
            height="30px"
            flat
            solo-inverted
            hide-details
          ></v-select>
        </v-flex>
        <v-text-field
          v-model="filter.search"
          class="input-height"
          height="30px"
          append-icon="mdi-magnify"
          flat
          clear-icon="mdi-close"
          clearable
          label="搜尋"
          solo-inverted
          hide-details
          @click:clear="
            ;[(filter.search = ''), $refs.casinoListChild.setFilter()]
          "
          @keyup.enter="$refs.casinoListChild.setFilter()"
          @click:append="$refs.casinoListChild.setFilter()"
        ></v-text-field>
        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs
            v-if="
              !!submenu &&
                submenu.child.find((item) => item.to === $route.path) !=
                  undefined
            "
            color="blue darken-1"
            slider-color="primary"
            fixed-tabs
          >
            <template v-slot:default>
              <v-tab
                v-for="(n, index) in submenu.child"
                :key="index"
                :to="n.to"
              >
                {{ n.title }}
              </v-tab>
            </template>
          </v-tabs>
        </template>
      </v-toolbar>
    </template>
    <NuxtChild ref="casinoListChild" :filter="filter" :lobby-type="lobbyType" />
  </v-container>
</template>

<script>
import { cassinoAddition } from '~/plugins/api_route'
import addGamelobby from '~/components/gamelobby_management/add_gamelobby.vue'

export default {
  components: { addGamelobby },
  data() {
    return {
      filter: {
        status: 'all',
        search: ''
      },
      lobbyType: [
        { name: '電子遊藝', shortName: '電子', value: 'game' },
        { name: '真人視訊', shortName: '真人', value: 'live' },
        { name: '彩票遊戲', shortName: '彩票', value: 'lottery' },
        { name: '捕魚達人', shortName: '捕魚', value: 'fish' },
        { name: '棋牌遊戲', shortName: '棋牌', value: 'card' },
        { name: '體育賽事', shortName: '體育', value: 'sport' },
        { name: 'html5', shortName: 'html5', value: 'html5' }
      ],
      itemFillter: [
        { text: '全部娛樂城', value: '1' },
        { text: '未開啟', value: '2' },
        { text: '維護中', value: '3' },
        { text: '暫時停用中', value: '4' }
      ]
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'game_lobby_management'
      )
    }
  },
  mounted() {},
  methods: {
    async add(data) {
      await cassinoAddition(data)
        .then((response) => {
          this.$refs.platformChild.init()
          this.$refs.addGame.closeAddDialog()
          this.$store.dispatch('alert/success', '新增成功')
        })
        .catch((error) => {
          if (error) {
            this.$refs.addGame.toggleStep(1)
            if (error.response.status === 500) {
              this.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查站台代碼與站台名稱是否有重複'
              )
              this.$refs.addGame.asyncValidate({
                website_code: ['請檢查名稱是否有重複'],
                website_name: ['請檢查名稱是否有重複']
              })
            }
            if (error.response.status === 400) {
              this.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查資料是否正確'
              )
              this.$refs.addGame.asyncValidate(
                JSON.parse(error.response.data.message)
              )
            }
          }
        })
    }
  }
}
</script>
