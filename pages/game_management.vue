<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-toolbar flat height="40px" extension-height="36px">
        <v-spacer></v-spacer>
        <addGame
          ref="addGame"
          :lobby-type="lobbyType"
          class="mr-2"
          @callAddNewSite="add"
        ></addGame>
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
            ;[delete filter.search, $refs.gameListChild.setFilter()]
          "
          @keyup.enter="$refs.gameListChild.setFilter()"
          @click:append="$refs.gameListChild.setFilter()"
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
    <NuxtChild ref="gameListChild" :filter="filter" />
  </v-container>
</template>

<script>
import addGame from '~/components/gamelobby_management/add_game.vue'

export default {
  components: { addGame },
  data() {
    return {
      filter: {
        status: 'all'
      },
      lobbyType: [
        { name: '電子遊藝', value: 'game' },
        { name: '真人視訊', value: 'live' },
        { name: '彩票遊戲', value: 'lottery' },
        { name: '捕魚達人', value: 'fishing' },
        { name: '棋牌遊戲', value: 'chess' },
        { name: '體育賽事', value: 'sport' }
      ]
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'game_management'
      )
    }
  },
  mounted() {},
  methods: {
    async add(data) {
      await this.$axios.$post('/gamelist', data).then((response) => {
        this.init()
        this.$refs.addGame.closeAddDialog()
        this.$store.dispatch('alert/success', '新增成功')
      })
      // .catch((error)=> {
      //   if (error) {
      //   }
      // })
    }
  }
}
</script>
