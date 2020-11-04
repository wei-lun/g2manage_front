<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯獨立站管端資訊
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-md>
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
                <v-switch
                  v-model="edit_data.cdn_setting"
                  color="primary"
                  label="CDN設定"
                  true-value="on"
                  false-value="off"
                ></v-switch>
              </v-flex>
              <v-flex
                v-if="edit_data.cdn_setting === 'on' ? true : false"
                xs12
                md6
              >
                <v-text-field
                  v-model="edit_data.cdn_code"
                  :rules="[FV.required, FV.min2, FV.max20]"
                  label="*CDN代號"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex
                v-if="edit_data.cdn_setting === 'on' ? true : false"
                xs12
                md6
              >
                <v-text-field
                  v-model="edit_data.cdn_url"
                  :rules="[FV.required, FV.url]"
                  label="*CDN網址"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
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
      parentPage: '/platform/adminsite',
      edit_data: {},
      FV: formValidation.rules,
      dl: false
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
        const data = JSON.parse(JSON.stringify(this.edit_data))
        data.operate =
          !!data.operate === true ? JSON.stringify(data.operate) : '[]'
        delete data.website_code
        delete data.website_name
        this.$emit('callEdit', data)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
