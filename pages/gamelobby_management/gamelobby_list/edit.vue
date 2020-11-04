<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        娛樂城設定
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="edit_data.casino_id"
                  label="娛樂城代碼"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="edit_data.cn_name"
                  :rules="[FV.required, FV.min2, FV.max20, FV.alpha_num]"
                  label="*娛樂城名稱(簡中)"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="edit_data.tw_name"
                  :rules="[FV.required, FV.min2, FV.max20, FV.alpha_num]"
                  label="*娛樂城名稱(繁中)"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="edit_data.en_name"
                  :rules="[FV.required, FV.min2, FV.max20, FV.alpha_num]"
                  label="*娛樂城名稱(英文)"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <edit-gamelobby-i18n />
              </v-flex>
              <v-flex xs12 md6>
                <v-file-input
                  v-model="edit_data.file"
                  label="logo圖檔"
                ></v-file-input>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.cdn_url"
                  :rules="[FV.required, FV.url]"
                  label="*URL"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="edit_data.category"
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="danger" to="/gamelobby_management/gamelobby_list"
          >關閉</v-btn
        >
        <v-btn color="success" @click="callEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidation from '~/plugins/form_validation.js'
import editGamelobbyI18n from '~/components/gamelobby_management/edit_gamelobby_i18n.vue'

export default {
  components: {
    editGamelobbyI18n
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
    websiteStatus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      edit_data: {},
      FV: formValidation.rules,
      dl: false
    }
  },
  created() {
    if (!Object.keys(this.editData).length) {
      this.$router.push('/gamelobby_management/gamelobby_list')
    } else {
      this.dl = true
      this.edit_data = JSON.parse(JSON.stringify(this.editData))
    }
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
        this.$router.push('/gamelobby_management/gamelobby_list')
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
