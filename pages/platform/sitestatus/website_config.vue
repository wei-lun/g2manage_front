<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯開站設定
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md fluid>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.website_code"
                  label="站台代碼"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.website_name"
                  label="站台名稱"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  v-model="edit_data.main_settings.currency"
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
                  v-model="edit_data.main_settings.template"
                  :rules="[FV.max100, FV.required]"
                  label="*樣板"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="edit_data.main_settings.language"
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
                  v-model="edit_data.main_settings.default_language"
                  :items="defaultLanguageItem"
                  :rules="[FV.required, defaultLanguageCheck]"
                  label="*預設語系"
                  hint="*必填選項"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-divider />
            <v-layout wrap>
              <v-flex
                v-for="(val, key) in edit_data.option_function"
                :key="key"
                xs6
                md4
              >
                <v-switch
                  v-model="edit_data.option_function[key]"
                  :label="option_function[key]"
                  color="primary"
                  true-value="on"
                  false-value="off"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'

export default {
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
    websiteStatus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      parentPage: '/platform/sitestatus',
      formTemp: {
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
      edit_data: {},
      FV: formValidation.rules,
      dl: false
    }
  },
  computed: {
    languageCheck() {
      if (this.edit_data.main_settings.language.length === 0) return '必填選項'
      else return true
    },
    defaultLanguageCheck() {
      if (
        !this.edit_data.main_settings.language.includes(
          this.edit_data.main_settings.default_language
        )
      )
        return '請重新選擇'
      else return true
    },
    defaultLanguageItem() {
      const selectedItems = this.langList.reduce((acc, cur, i) => {
        if (this.edit_data.main_settings.language.includes(cur.value))
          acc.push(cur)
        return acc
      }, [])
      return selectedItems
    }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push(this.parentPage)
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
    }
  },
  methods: {
    callEdit() {
      if (this.$refs.form.validate()) {
        const form = JSON.parse(JSON.stringify(this.edit_data))
        const data = {
          main_settings: JSON.stringify(form.main_settings),
          option_function: JSON.stringify(form.option_function)
        }
        this.$emit('callEdit', data)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
