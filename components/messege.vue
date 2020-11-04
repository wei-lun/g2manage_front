<template>
  <div class="messege">
    <v-badge
      :value="membersNum"
      :content="membersNum"
      color="orange"
      overlap
      class="mr-5"
    >
      <v-icon large @click.stop="openMemberDialog">mdi-account-details</v-icon>
    </v-badge>

    <v-badge
      :value="messageNum"
      :content="messageNum"
      color="orange"
      overlap
      class="mr-5"
    >
      <v-icon large @click.stop="openMessegeDialog"
        >mdi-comment-processing-outline</v-icon
      >
    </v-badge>

    <v-badge
      :value="depositsNum"
      :content="depositsNum"
      color="orange"
      overlap
      class="mr-5"
    >
      <v-icon large @click.stop="openDepositDialog">mdi-credit-card</v-icon>
    </v-badge>

    <v-badge
      :value="walletsNum"
      :content="walletsNum"
      color="orange"
      overlap
      class="mr-5"
    >
      <v-icon large @click.stop="openWalletsDialog"
        >mdi-currency-usd-circle</v-icon
      >
    </v-badge>

    <v-dialog v-model="depositDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>尚有{{ depositsNum }}個會員等待提款審核中</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 350px;">
          <v-list>
            <v-list-item-group multiple>
              <template v-for="(item, index) in deposits">
                <v-list-item :key="'deposit' + index">
                  <template>
                    <v-list-item-content class="d-flex">
                      <v-list-item-title
                        v-text="item.account"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.date"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < deposits.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="depositDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="walletsDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>尚有{{ walletsNum }}個會員等待存款審核中</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 350px;">
          <v-list>
            <v-list-item-group multiple>
              <template v-for="(item, index) in wallets">
                <v-list-item :key="'wallets' + index">
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.account"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.date"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < wallets.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="walletsDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="messegeDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>尚有{{ messageNum }}個訊息</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 350px;">
          <v-list>
            <v-list-item-group multiple>
              <template v-for="(item, index) in messages">
                <v-list-item :key="'message' + index">
                  <template>
                    <v-list-item-content class="d-flex">
                      <v-list-item-title
                        v-text="item.account"
                      ></v-list-item-title>
                      {{ item.date }}
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < messages.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="messegeDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="memberDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>尚有{{ membersNum }}個會員審核中</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 350px;">
          <v-list>
            <v-list-item-group multiple>
              <template v-for="(item, index) in members">
                <v-list-item :key="'member' + index">
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.account"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.date"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < members.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="memberDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.messege {
  position: absolute;
  right: 60px;
  bottom: 35px;
  background: none !important;
}
</style>

<script>
import Stomp from 'stompjs'

export default {
  data() {
    return {
      hidden: true,
      toggle_exclusive: 2,
      messegeDialog: false,
      memberDialog: false,
      walletsDialog: false,
      depositDialog: false,
      members: [],
      deposits: [],
      wallets: [],
      messages: []
    }
  },
  computed: {
    messageNum() {
      return this.messages.length
    },
    walletsNum() {
      return this.wallets.length
    },
    depositsNum() {
      return this.deposits.length
    },
    membersNum() {
      return this.members.length
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    openMessegeDialog() {
      this.messegeDialog = true
    },
    openMemberDialog() {
      this.memberDialog = true
    },
    openDepositDialog() {
      this.depositDialog = true
    },
    openWalletsDialog() {
      this.walletsDialog = true
    },
    connect() {
      const vm = this
      vm.client = Stomp.client(process.env.mqUrl)
      const headers = process.env.mqheader

      // vm.client.debug = null
      vm.client.connect(
        headers.login,
        headers.passcode,
        (frame) => {
          // console.info('连接成功!');
          this.connected = true

          vm.client.subscribe('/exchange/msg_notify', function(data) {
            const datas = JSON.parse(data.body)

            if (datas.from === 'CompanyDeposit') {
              vm.deposits.push(datas)
            } else if (datas.from === 'TokenWithdrawal') {
              vm.wallets.push(datas)
            } else if (datas.from === 'CashWithdrawal') {
              vm.wallets.push(datas)
            } else if (datas.from === 'AgentReview') {
              vm.members.push(datas)
            } else if (datas.from === 'MemberRegister') {
              vm.members.push(datas)
            } else if (datas.from === 'StationMail ') {
              vm.messages.push(datas)
            } else if (datas.from === 'SiteAnnouncement') {
              vm.messages.push(datas)
            } else {
              // alert('有新通知！')
            }
          })
        },
        (error) => {
          // console.info('连接失败!')
          console.log(error)
          this.connected = false
        },
        headers.vhost
      )
    },
    disconnect(a) {
      if (a === 'true') {
        this.client.disconnect()
        console.log('Disconnected')
      }
    }
  }
}
</script>
