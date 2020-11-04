<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯站台
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
              <v-flex xs12 sm6>
                <v-select
                  v-model="edit_data.website_type"
                  :items="platformType"
                  :rules="[FV.required]"
                  label="*站台類型"
                  item-text="name"
                  item-value="value"
                  hint="*必填選項"
                ></v-select>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  v-model="edit_data.status"
                  :items="websiteStatus"
                  :rules="[FV.required]"
                  item-text="name"
                  item-value="value"
                  label="狀態"
                  hint="*必填選項"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  v-model="edit_data.operate"
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
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.management_frontdesk"
                  :rules="[FV.required, FV.url, FV.max100]"
                  label="*前台網址"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.management_background"
                  :rules="[FV.required, FV.url, FV.max100]"
                  label="*後台網址"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.management_frontdesk_spare"
                  :rules="[FV.url, FV.max100]"
                  label="前台網址(備用)"
                  hint="選填"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.management_background_spare"
                  :rules="[FV.url, FV.max100]"
                  label="後台網址(備用)"
                  hint="選填"
                ></v-text-field>
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
        delete data.date
        this.$emit('callEdit', data)
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
