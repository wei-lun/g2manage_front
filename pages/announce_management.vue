<template>
  <v-container align-content-center justify-center fluid>
    <template>
      <v-tabs
        v-if="
          !!submenu &&
            submenu.child.find((item) => item.to === $route.path) != undefined
        "
        color="blue darken-1"
        slider-color="primary"
        fixed-tabs
      >
        <template v-slot:default>
          <v-tab v-for="(n, index) in submenu.child" :key="index" :to="n.to">
            {{ n.title }}
          </v-tab>
        </template>
      </v-tabs>
    </template>
    <NuxtChild
      ref="platformChild"
      :filter="filter"
      :website-status="websiteStatus"
      :lobby-type="lobbyType"
      :platform-type="platformType"
      :site-name="siteName"
    />
  </v-container>
</template>

<script>
import { websiteAddition } from '~/plugins/api_route'

export default {
  data() {
    return {
      filter: {
        status: 'all'
      },
      siteName: ['gpk01', 'gpk02', 'gpk03', 'gpk04', 'gpk05', 'gpk06', 'gpk07'],
      platformType: [
        { name: '娛樂城', value: 'casino' },
        { name: '商城', value: 'mall' }
      ]
    }
  },
  computed: {
    submenu() {
      return this.$store.state.menu.menulist.find(
        (item) => item.id === 'announce_management'
      )
    }
  },
  mounted() {},
  methods: {
    async add(data) {
      const self = this
      await websiteAddition(data)
        .then(function(response) {
          self.$refs.platformChild.init()
          self.$refs.addSiteDialog.closeAddDialog()
          self.$store.dispatch('alert/success', '新增成功')
        })
        .catch(function(error) {
          if (error) {
            self.$refs.addSiteDialog.toggleStep(1)
            if (error.response.status === 500) {
              self.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查站台代碼與站台名稱是否有重複'
              )
              self.$refs.addSiteDialog.asyncValidate({
                website_code: ['請檢查名稱是否有重複'],
                website_name: ['請檢查名稱是否有重複']
              })
            }
            if (error.response.status === 400) {
              self.$store.dispatch(
                'alert/danger',
                '新增失敗，請檢查資料是否正確'
              )
              self.$refs.addSiteDialog.asyncValidate(
                JSON.parse(error.response.data.message)
              )
            }
          }
        })
    }
  }
}
</script>
