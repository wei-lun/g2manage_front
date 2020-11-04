<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        娛樂城狀態管理
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.casino_id"
                  label="娛樂城代碼"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.tw_name"
                  label="娛樂城名稱"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-datetime-picker
                  v-model="edit_data.notify_datetime"
                  :error-messages="valid[1].date"
                  :datetime="edit_data.notify_datetime"
                  :rules="[FV.required]"
                  label="*架站時間"
                >
                </v-datetime-picker>
              </v-flex>
              <!-- <v-flex xs12 sm12>
                <v-flex xs12 md6>
                  <v-select
                    v-model="edit_data.status"
                    :items="websiteStatus"
                    item-text="name"
                    item-value="value"
                    label="狀態"
                    hint="*必填選項"
                    :rules="[FV.required]"
                  ></v-select>
                </v-flex>
              </v-flex> -->
              <v-flex xs4>
                <v-switch
                  v-model="openSetting"
                  color="primary"
                  label="關閉/開啟"
                  @change="open_casino"
                ></v-switch>
              </v-flex>
              <v-flex xs4>
                <v-switch
                  v-model="maintainSetting"
                  color="primary"
                  label="維護"
                  @change="maintain_casino"
                ></v-switch>
              </v-flex>
              <v-flex xs4>
                <v-switch
                  v-model="stopSetting"
                  color="primary"
                  label="暫時停用"
                  @change="stop_casino"
                ></v-switch>
              </v-flex>
              <v-row>
                <v-flex xs4>
                  <v-btn text icon large color="red" @click="dialog = !dialog">
                    <v-icon>mdi-minus-circle</v-icon>
                    永遠關閉
                  </v-btn>
                </v-flex>
              </v-row>
              <v-flex xs12>
                <v-textarea
                  v-model="edit_data.note"
                  :rules="[FV.max200]"
                  label="備註"
                  filled
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
        <v-dialog v-model="dialog" max-width="500px">
          <v-form ref="form" lazy-validation @keyup.native.enter="login()">
            <v-card>
              <v-card-title>
                <p class="display-1 red--text font-weight-bold">
                  警告
                </p>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-card-text>
                <v-text-field
                  ref="psd"
                  v-model="user.password"
                  :rules="[FV.required]"
                  prepend-icon="mdi-lock"
                  name="user.password"
                  label="請輸入密碼"
                  type="password"
                ></v-text-field>
                <p class="body-1">永久关闭娱乐城无法再开启，是否确定？</p>
                <p class="body-1">请在上方输入密码，确认永久关闭娱乐城。</p>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="casinoClose">确定</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="danger" to="/gamelobby_management/gamelobby_status"
          >關閉</v-btn
        >
        <v-btn color="success" @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { userLogin } from '~/plugins/api_route'
import formValidation from '~/plugins/form_validation.js'
import vDatetimePicker from '~/components/date_time_picker.vue'

export default {
  components: {
    vDatetimePicker
  },
  props: {
    editData: {
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
    platformType: {
      type: Array,
      default() {
        return []
      }
    },
    gamelobbyStatus: {
      type: Object,
      default() {
        return {}
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
      edit_data: {},
      FV: formValidation.rules,
      dl: false,
      dialog: false,
      dl_new: {
        date: null,
        cdn_setting: 'off',
        casino: '[]'
      },
      openSetting: '',
      maintainSetting: '',
      stopSetting: '',
      user: {
        account: '',
        password: ''
      },
      valid: {
        1: { website_code: '', website_name: '', date: '' },
        2: {},
        3: {
          /* management_frontdesk: '',
          management_background: '',
          management_frontdesk_spare: '',
          management_background_spare: '',
          ccdb_ip: '',
          brdb_ip: '',
          bwdb_ip: '' */
        }
      }
    }
  },
  computed: {
    open_setting() {
      if (this.editData.status === this.gamelobbyStatus.casinoOn) {
        return true
      }
      return false
    },
    maintain_setting() {
      if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOn ||
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOff ||
        this.editData.status ===
          this.gamelobbyStatus.casinoEmgForCasinoCloseOff ||
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoCloseOn
      ) {
        return true
      }
      return false
    },
    stop_setting() {
      if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOff ||
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOn ||
        this.editData.status ===
          this.gamelobbyStatus.casinoCloseForCasinoEmgOff ||
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoEmgOn
      ) {
        return true
      }
      return false
    }
  },
  watch: {
    // openSetting(val) {
    //   if (val === true) {
    //     this.maintainSetting = false
    //     this.stopSetting = false
    //   }
    // },
    // maintainSetting(val) {
    //   if (val === true) {
    //     this.openSetting = false
    //     this.stopSetting = false
    //   }
    // },
    // stopSetting(val) {
    //   if (val === true) {
    //     this.openSetting = false
    //     this.maintainSetting = false
    //   }
    // }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push('/gamelobby_management/gamelobby_status')
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
    }

    this.openSetting = this.open_setting
    this.maintainSetting = this.maintain_setting
    this.stopSetting = this.stop_setting
  },
  methods: {
    callEdit() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.edit_data))
        data.operate =
          !!data.operate === true ? JSON.stringify(data.operate) : '[]'
        delete data.website_code
        delete data.website_name
        this.$emit('callEdit', data)
        this.edit_data = {}
        this.$router.push('/gamelobby_management/gamelobby_status')
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    },
    open_casino() {
      if (this.editData.status === this.gamelobbyStatus.casinoOn) {
        this.editData.status = this.gamelobbyStatus.casinoOff
        this.openSetting = false
      } else {
        this.editData.status = this.gamelobbyStatus.casinoOn
        this.openSetting = true
        this.maintainSetting = false
        this.stopSetting = false
      }
    },
    maintain_casino() {
      if (this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOff) {
        this.editData.status = this.gamelobbyStatus.casinoOff
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoOn
        this.openSetting = true
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoCloseOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoEmgOn
        this.stopSetting = true
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoCloseOff
      ) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoEmgOff
        this.stopSetting = true
      } else if (this.editData.status === this.gamelobbyStatus.casinoOff) {
        this.editData.status = this.gamelobbyStatus.casinoEmgForCasinoOff
      } else if (this.editData.status === this.gamelobbyStatus.casinoOn) {
        this.editData.status = this.gamelobbyStatus.casinoEmgForCasinoOn
        this.openSetting = false
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOff ||
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoEmgOff
      ) {
        this.editData.status = this.gamelobbyStatus.casinoEmgForCasinoCloseOff
        this.stopSetting = false
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOn ||
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoEmgOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoEmgForCasinoCloseOn
        this.stopSetting = false
      }
    },
    stop_casino() {
      if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOff
      ) {
        this.editData.status = this.gamelobbyStatus.casinoOff
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoOn
        this.openSetting = true
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoEmgOff
      ) {
        this.editData.status = this.gamelobbyStatus.casinoEmgForCasinoCloseOff
        this.maintainSetting = true
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoCloseForCasinoEmgOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoEmgOn
        this.maintainSetting = true
      } else if (this.editData.status === this.gamelobbyStatus.casinoOff) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoOff
      } else if (this.editData.status === this.gamelobbyStatus.casinoOn) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoOn
        this.openSetting = false
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOff ||
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoCloseOff
      ) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoEmgOff
        this.maintainSetting = false
      } else if (
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoOn ||
        this.editData.status === this.gamelobbyStatus.casinoEmgForCasinoCloseOn
      ) {
        this.editData.status = this.gamelobbyStatus.casinoCloseForCasinoEmgOn
        this.maintainSetting = false
      }
    },
    async casinoClosePost() {
      await userLogin(this.user)
        .then((response) => {
          this.$store.commit('auth/logined', {
            account: response.data.expires_in,
            token: response.data.token
          })
          this.$store.dispatch('alert/success', '登入成功')
          this.$router.push('/')
        })
        .catch((error) => {
          const message = error.response.data.message
          if (error) {
            this.$store.dispatch('alert/danger', message)
          }
        })
        .then(() => {})
    },
    casinoClose() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.casinoClosePost()
      } else {
        this.$store.dispatch('alert/danger', '必填選項未填')
      }
    }
  },
  maintain_casino() {}
}
</script>
