<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-toolbar flat height="40px" extension-height="36px">
        <v-spacer></v-spacer>
        <addSiteDialog
          ref="addSiteDialog"
          :lobby-type="lobbyType"
          :platform-type="platformType"
          :website-status="websiteStatus"
          class="mr-2"
          @callAddNewSite="add"
        ></addSiteDialog>
        <v-select
          v-model="filter.status"
          :items="[...websiteStatusFilter, ...websiteStatus]"
          class="mr-2 input-height"
          height="30px"
          flat
          solo-inverted
          hide-details
          item-text="name"
          item-value="value"
          @input="$refs.platformChild.setFilter()"
        ></v-select>
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
            ;[delete filter.search, $refs.platformChild.setFilter()]
          "
          @keyup.enter="$refs.platformChild.setFilter()"
          @click:append="$refs.platformChild.setFilter()"
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
    <NuxtChild
      ref="platformChild"
      :filter="filter"
      :website-status="websiteStatus"
      :lobby-type="lobbyType"
      :platform-type="platformType"
    />
  </v-container>
</template>

<script>
import { websiteAddition } from '~/plugins/api_route'
import addSitestatus from '~/components/platform_status/add_site_status.vue'

export default {
  components: { addSiteDialog: addSitestatus },
  data() {
    return {
      filter: {
        status: 'all'
      },
      websiteStatus: [
        {
          name: '營運中',
          color: 'success',
          value: 'in_operation'
        },
        {
          name: '未上線',
          color: 'danger',
          value: 'not_online'
        },
        {
          name: '維護中',
          color: 'warning',
          value: 'not_service'
        },
        {
          name: '即將關站',
          color: 'danger',
          value: 'will_be_closed'
        },
        {
          name: '永久關站',
          color: 'danger',
          value: 'permanently_closed'
        }
      ],
      websiteStatusFilter: [
        {
          name: '全部',
          value: 'all'
        }
      ],
      lobbyType: [
        { name: '電子遊藝', shortName: '電子', value: 'game' },
        { name: '真人視訊', shortName: '真人', value: 'live' },
        { name: '彩票遊戲', shortName: '彩票', value: 'lottery' },
        { name: '捕魚達人', shortName: '捕魚', value: 'fish' },
        { name: '棋牌遊戲', shortName: '棋牌', value: 'card' },
        { name: '體育賽事', shortName: '體育', value: 'sport' },
        { name: 'html5', shortName: 'html5', value: 'html5' }
      ],
      platformType: [
        { name: '娛樂城', value: 'casino' },
        { name: '商城', value: 'mall' }
      ]
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'platform_operation'
      )
    }
  },
  mounted() {},
  methods: {
    async add(data) {
      await websiteAddition(data)
        .then((response) => {
          this.$refs.platformChild.init()
          this.$refs.addSiteDialog.closeAddDialog()
          this.$store.dispatch('alert/success', '新增成功')
        })
        .catch((error) => {
          if (error) {
            this.$refs.addSiteDialog.toggleStep(1)
            if (error.response.status === 500) {
              this.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查站台代碼與站台名稱是否有重複'
              )
              this.$refs.addSiteDialog.asyncValidate({
                website_code: ['請檢查名稱是否有重複'],
                website_name: ['請檢查名稱是否有重複']
              })
            }
            if (error.response.status === 400) {
              this.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查資料是否正確'
              )
              this.$refs.addSiteDialog.asyncValidate(
                JSON.parse(error.response.data.message)
              )
            }
          }
        })
    }
  }
}
</script>
