<template>
  <div>
    <v-btn color="primary" small @click.stop="addDialog = true">新增站台</v-btn>
    <v-dialog v-model="addDialog" dark persistent max-width="750px">
      <v-card>
        <v-card-title>
          <span>新增站台</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="closeAddDialog"
            >取消並關閉</v-btn
          >
        </v-card-title>
        <v-stepper v-model="stepper">
          <v-stepper-header>
            <v-stepper-step :complete="stepper > 1" step="1">
              站台資訊
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepper > 2" step="2">
              站台狀態
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepper > 3" step="3">
              位址資訊
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="4">開站設定</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="grey darken-3">
            <v-stepper-content step="1">
              <v-form ref="step1" lazy-validation>
                <v-container grid-list-md fluid>
                  <v-layout wrap>
                    <v-flex xs12 md6>
                      <v-text-field
                        id="website_code"
                        ref="website_code"
                        v-model="dl_new.website_code"
                        :error-messages="valid[1].website_code"
                        :rules="[FV.required, FV.min2, FV.max20, FV.alpha_num]"
                        label="*站台代碼"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.website_name"
                        :error-messages="valid[1].website_name"
                        :rules="[FV.required, FV.min2, FV.max50]"
                        label="*站台名稱"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-datetime-picker
                        v-model="dl_new.date"
                        :error-messages="valid[1].date"
                        :datetime="dl_new.date"
                        :rules="[FV.required]"
                        label="*架站時間"
                      >
                      </v-datetime-picker>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-divider class="mb-2"></v-divider>
              <v-layout justify-end>
                <v-btn color="blue darken-1" @click="nextStep($refs.step1)"
                  >下一步</v-btn
                >
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-form ref="step2" lazy-validation>
                <v-container grid-list-md fluid>
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-select
                        v-model="dl_new.website_type"
                        :items="platformType"
                        :rules="[FV.required]"
                        label="*站台類型"
                        item-text="name"
                        item-value="value"
                        hint="*必填選項"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="dl_new.operate"
                        :items="lobbyType"
                        label="營運類別(多選)"
                        item-text="name"
                        chips
                        deletable-chips
                        hide-selected
                        multiple
                      >
                      </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select
                        v-model="dl_new.status"
                        :items="websiteStatus"
                        :rules="[FV.required]"
                        item-text="name"
                        item-value="value"
                        label="*營運狀態"
                        hint="*必填選項"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-switch
                        v-model="dl_new.cdn_setting"
                        color="primary"
                        label="CDN設定"
                        true-value="on"
                        false-value="off"
                      ></v-switch>
                    </v-flex>
                    <v-flex
                      v-if="dl_new.cdn_setting === 'on' ? true : false"
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="dl_new.cdn_code"
                        :rules="[FV.required, FV.min2, FV.max20]"
                        label="*CDN代號"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      v-if="dl_new.cdn_setting === 'on' ? true : false"
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="dl_new.cdn_url"
                        :rules="[FV.required, FV.url]"
                        label="*CDN網址"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-divider class="mb-2"></v-divider>
              <v-layout justify-end>
                <v-btn color="blue darken-1 mr-2" @click="prevStep()"
                  >上一步</v-btn
                >
                <v-btn color="blue darken-1" @click="nextStep($refs.step2)"
                  >下一步</v-btn
                >
              </v-layout>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-form ref="step3" lazy-validation>
                <v-container grid-list-md fluid>
                  <v-layout wrap>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.management_frontdesk"
                        :rules="[FV.required, FV.url, FV.max100]"
                        label="*前台網址"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.management_background"
                        :rules="[FV.required, FV.url, FV.max100]"
                        label="*後台網址"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.management_frontdesk_spare"
                        :rules="[FV.url, FV.max100]"
                        label="前台網址(備用)"
                        hint="選填"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.management_background_spare"
                        :rules="[FV.url, FV.max100]"
                        label="後台網址(備用)"
                        hint="選填"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.ga_prefix"
                        :rules="[FV.required, FV.min2, FV.max50]"
                        label="*GA前綴"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.ccdb_ip"
                        :rules="[FV.required, FV.ip]"
                        label="*CCDB IP"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.brdb_ip"
                        :rules="[FV.required, FV.ip]"
                        label="*BRDB IP"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.bwdb_ip"
                        :rules="[FV.required, FV.ip]"
                        label="*BWDB IP"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        v-model="dl_new.note"
                        :rules="[FV.max200]"
                        label="備註"
                        filled
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-divider class="mb-2"></v-divider>
              <v-layout justify-end>
                <v-btn color="blue darken-1 mr-2" @click="prevStep()"
                  >上一步</v-btn
                >
                <v-btn color="blue darken-1" @click="nextStep($refs.step3)"
                  >下一步</v-btn
                >
              </v-layout>
            </v-stepper-content>
            <v-stepper-content step="4">
              <v-form ref="step4" lazy-validation>
                <v-container grid-list-md fluid>
                  <v-layout wrap>
                    <v-flex xs12 md6>
                      <v-select
                        v-model="dl_new.main_settings.currency"
                        :items="[
                          { text: '台幣', value: 'TWD' },
                          { text: '人民幣', value: 'RMB' }
                        ]"
                        :rules="[FV.required]"
                        label="*幣別"
                        hint="*必填選項"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="dl_new.main_settings.template"
                        :rules="[FV.max100, FV.required]"
                        label="*樣板"
                        hint="*必填選項"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="dl_new.main_settings.language"
                        :items="langList"
                        :rules="[languageCheck]"
                        label="*開放語系(多選)"
                        chips
                        deletable-chips
                        hide-selected
                        multiple
                      >
                      </v-autocomplete>
                    </v-flex>
                    <v-flex v-if="defaultLanguageItem.length !== 0" xs12 md6>
                      <v-select
                        v-model="dl_new.main_settings.default_language"
                        :items="defaultLanguageItem"
                        :rules="[FV.required]"
                        label="*預設語系"
                        hint="*必填選項"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-divider />
                  <v-layout wrap>
                    <v-flex
                      v-for="(val, key) in dl_new.option_function"
                      :key="key"
                      xs6
                      md4
                    >
                      <v-switch
                        v-model="dl_new.option_function[key]"
                        :label="option_function[key]"
                        color="primary"
                        true-value="on"
                        false-value="off"
                      ></v-switch>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-divider class="mb-2"></v-divider>
              <v-layout justify-end>
                <v-btn color="blue darken-1 mr-2" @click="prevStep()"
                  >上一步</v-btn
                >
                <v-btn color="success" @click="callAddNewSite">完成</v-btn>
              </v-layout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import formValidation from '~/plugins/form_validation.js'
import vDatetimePicker from '~/components/date_time_picker.vue'

export default {
  components: {
    vDatetimePicker
  },
  props: {
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
    websiteStatus: {
      type: Array,
      default() {
        return []
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
      moment,
      addDialog: false,
      newForm: {
        date: null,
        cdn_setting: 'off',
        casino: [],
        operate: [],
        main_settings: {
          language: []
        },
        option_function: {
          bonus_sale: 'off',
          bonus_profit: 'off',
          bonus_dividend: 'off',
          national_agent: 'off',
          open_online_pay: 'off',
          realtime_reward: 'off',
          hide_cash_account: 'off',
          betting_commission: 'off',
          open_company_deposit: 'off'
        }
      },
      option_function: {
        bonus_sale: '組織營業獎金',
        bonus_profit: '組織營運獎金',
        bonus_dividend: '組織股利獎金',
        national_agent: '全民代理功能',
        open_online_pay: '啟用線上支付',
        realtime_reward: '時時反水',
        hide_cash_account: '隱藏現金帳戶',
        betting_commission: '存款投注佣金',
        open_company_deposit: '啟用公司入款'
      },
      langList: [
        { text: '繁體中文', value: 'TW' },
        { text: '簡體中文', value: 'CN' },
        { text: 'English', value: 'EN' }
      ],
      dl_new: {},
      FV: formValidation.rules,
      stepper: 1,
      valid: {
        1: { website_code: '', website_name: '', date: '' },
        2: {},
        3: {
          management_frontdesk: '',
          management_background: '',
          management_frontdesk_spare: '',
          management_background_spare: '',
          ccdb_ip: '',
          brdb_ip: '',
          bwdb_ip: ''
        }
      }
    }
  },
  computed: {
    languageCheck() {
      if (this.dl_new.main_settings.language.length === 0) return '必填選項'
      else return true
    },
    defaultLanguageItem() {
      const selectedItems = this.langList.reduce((acc, cur, i) => {
        if (this.dl_new.main_settings.language.includes(cur.value))
          acc.push(cur)
        return acc
      }, [])
      return selectedItems
    }
  },
  watch: {},
  created() {
    this.newForm.date = this.moment().format('YYYY-MM-DD HH:mm:ss')
    this.$set(this, 'dl_new', JSON.parse(JSON.stringify(this.newForm)))
  },
  methods: {
    nextStep(form) {
      Object.keys(this.valid[this.stepper]).forEach((key) => {
        this.valid[this.stepper][key] = ''
      })
      // form.resetValidation()
      if (form.validate()) {
        this.stepper++
      } else {
        this.$store.dispatch('alert/danger', '必填選項未填')
      }
    },
    prevStep() {
      this.stepper--
    },
    toggleStep(step) {
      this.stepper = step
    },
    callAddNewSite() {
      if (this.$refs.step4.validate()) {
        const data = JSON.parse(JSON.stringify(this.dl_new))
        data.date = moment(data.date).format('YYYY-MM-DD HH:mm:ss')
        data.operate = JSON.stringify(data.operate)
        data.casino = JSON.stringify(data.casino)
        data.main_settings = JSON.stringify(data.main_settings)
        data.option_function = JSON.stringify(data.option_function)
        // console.log(data)
        this.$emit('callAddNewSite', data)
      } else {
        this.$store.dispatch('alert/danger', '必填選項未填')
      }
    },
    closeAddDialog() {
      this.addDialog = false
      this.clearForm()
    },
    clearForm() {
      // this.$refs.form.reset()
      this.$set(this, 'dl_new', JSON.parse(JSON.stringify(this.newForm)))
      this.$refs.step1.resetValidation()
      this.$refs.step2.resetValidation()
      this.$refs.step3.resetValidation()
      this.$refs.step4.resetValidation()
      this.stepper = 1
    },
    asyncValidate(errorObj) {
      Object.keys(errorObj).forEach((key) => {
        this.valid[1][key] = errorObj[key].join(',')
      })
    }
  }
}
</script>
