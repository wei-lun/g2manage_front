<template>
  <v-app>
    <v-navigation-drawer
      v-if="!!$store.state.auth.user.isLogin"
      v-model="drawer"
      :expand-on-hover="breakpointWidth < 1264 ? false : true"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title
            >{{ userRole }} ：{{
              $store.state.auth.user.account
            }}</v-list-item-title
          >
          <!-- <v-list-item-icon>
            <v-btn rounded text x-small depressed to="/user_info"
              ><v-icon>{{ 'mdi-pencil' }}</v-icon>
            </v-btn>
          </v-list-item-icon> -->
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group
          v-for="item in menulist"
          :key="item.id"
          :value="item.active"
          :prepend-icon="'mdi-' + item.icon"
          color="blue lighten-1"
          no-action
        >
          <v-divider></v-divider>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <div v-for="(subItem, i) in item.child" :key="item.id + i">
            <v-list-item
              v-if="typeof subItem.child === 'undefined'"
              :to="typeof subItem.child === 'undefined' ? subItem.to : ''"
              color="blue lighten-1"
              class="pl-10"
              ripple
              exact
            >
              <v-list-item-title v-text="subItem.title" />
              <v-list-item-action>
                <v-icon>{{ 'mdi-' + subItem.icon }}</v-icon>
              </v-list-item-action>
            </v-list-item>

            <v-list-group v-else color="blue lighten-1" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title" />
                </v-list-item-content>
              </template>
              <v-divider></v-divider>
              <v-list-item
                v-for="(thirdItem, j) in subItem.child"
                :key="item.id + i + j"
                :to="thirdItem.to"
                color="blue lighten-1"
              >
                <v-list-item-title v-text="thirdItem.title" />
                <v-list-item-action>
                  <v-icon>{{ 'mdi-' + thirdItem.icon }}</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list-group>
          </div>

          <v-divider></v-divider>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-item
          :disabled="$store.state.loading.inprogress"
          @click.stop="logout"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>登出</v-list-item-title>
        </v-list-item>
        <v-list-item
          :disabled="$store.state.loading.inprogress"
          @click.stop="
            $store.commit('auth/setTheme'),
              ($vuetify.theme.dark = !$vuetify.theme.dark)
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-lightbulb</v-icon>
          </v-list-item-icon>
          <v-list-item-title>開/關燈</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="true" fixed app height="36px">
      <v-btn
        v-if="!!$store.state.auth.user.isLogin && !drawer"
        icon
        @click.stop="drawer_toggle"
      >
        <v-icon>{{ `${!temporary ? 'mdi-menu' : 'mdi-chevron_left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title class="mr-3" v-text="title" />
      <p v-if="drawer" class="mb-0">
        {{ $store.state.breadcrumb.text }}
      </p>
      <v-spacer />
      <!-- <v-btn
        v-if="!!$store.state.auth.user.isLogin"
        x-small
        @click.stop="notification()"
      >
        測試通知
      </v-btn>
      <v-badge
        v-if="!!$store.state.auth.user.isLogin"
        :color="connected ? 'success' : 'danger'"
        bordered
        overlap
        dot
      >
        <v-btn x-small @click.stop="mqConnect()">
          MQ連線
        </v-btn>
      </v-badge> -->
    </v-app-bar>
    <v-content>
      <nuxt />
      <messegeDialog v-if="!!$store.state.auth.user.isLogin"></messegeDialog>
    </v-content>
    <!-- <v-footer :fixed="false" app>
      <span class="ml-2"> &copy; 2019</span>
    </v-footer> -->
    <snackBarAlert />
    <v-dialog
      v-model="$store.state.loading.inprogress"
      no-click-animation
      persistent
      max-width="300"
    >
      <v-card color="primary" dark>
        <v-card-text>
          請稍候......
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Stomp from 'stompjs'
import { userLogout } from '~/plugins/api_route'
import snackBarAlert from '~/components/snackbar_alert.vue'
import messege from '~/components/messege.vue'

export default {
  components: {
    snackBarAlert,
    messegeDialog: messege
  },
  data() {
    return {
      collapse: null,
      temporary: false,
      miniVariant: true,
      drawer: true,
      title: 'JIG總後台',
      connected: false,
      mqMsgBody: ''
      // menulist: []
    }
  },
  computed: {
    menulist() {
      const list = JSON.parse(JSON.stringify(this.$store.state.menu.menulist))
      return list
    },
    userinfo() {
      return this.$store.state.auth.user
    },
    userRole() {
      let role = ''
      switch (this.$store.state.auth.user.type) {
        case 'R':
          role = '管理員'
          break
        case 'O':
          role = '維運'
          break
        case 'C':
          role = '客服'
          break
        case 'S':
          role = '業務'
          break
      }
      return role
    },
    breakpointWidth() {
      if (
        !!this.$vuetify &&
        typeof this.$vuetify.breakpoint.width !== 'undefined'
      )
        return this.$vuetify.breakpoint.width
      else return '1024'
    }
  },
  watch: {
    userinfo: {
      handler(val1, val) {
        this.$store.commit(
          'menu/setMenulist',
          this.$store.state.auth.user.setting
        )
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        // console.log('允許通知')
      } else if (permission === 'denied') {
        // console.log('拒絕通知')
      }
    })
  },
  created() {
    this.$store.commit('auth/getTheme')
    if (this.breakpointWidth < 1264) {
      this.miniVariant = false
      this.drawer = false
    }
  },
  methods: {
    drawer_toggle() {
      if (this.breakpointWidth < 1264) {
        if (this.collapse) {
          this.menulist.find((item) => item.id === this.collapse).active = true
        }
        this.drawer = !this.drawer
        this.miniVariant = false
      } else {
        this.drawer = true
        this.miniVariant = !this.miniVariant
      }
    },
    async logout() {
      // this.disconnect()
      await userLogout()
        .then((response) => {
          this.$store.commit('auth/logout')
          this.$store.dispatch('alert/success', '登出成功')
          // this.$router.push('/login')
          this.$refs.messageDialog.disconnect('true')
        })
        .catch((error) => {
          if (error) {
            this.$store.commit('auth/logout')
            this.$store.dispatch('alert/success', '登出成功')
            // this.$router.push('/login')
            this.$refs.messageDialog.disconnect('true')
          }
        })
    },
    notification() {
      const n = new Notification('狀態更新', {
        body: '有一筆新訊息!!!',
        // icon: '',
        requireInteraction: false
      })
      this.mqMsgBody = n.body
    },
    mqConnect() {
      if (!this.connected) this.connect()
      else this.disconnect()
    },
    connect() {
      this.client = Stomp.client(process.env.mqUrl)
      const headers = process.env.mqheader

      // this.client.debug = null
      this.client.connect(
        headers.login,
        headers.passcode,
        (frame) => {
          this.connected = true

          this.client.subscribe('/exchange/front_notify', (data) => {
            const datas = JSON.parse(data.body)

            if (datas.to === 'maintenance_setting') {
              this.statusUpdate()
              alert('一筆維護狀態已更新')
            } else if (datas.to === 'maintenance_history') {
              this.addHistorry()
              alert('新增一筆歷史維護紀錄')
            }
          })
        },
        (error) => {
          if (error) {
            this.connected = false
          }
          // console.info('连接失败!')
          // console.log(error)
        },
        headers.vhost
      )
    },
    disconnect() {
      this.client.disconnect()
      this.connected = false
      // console.log('Disconnected')
    }
  }
}
</script>
