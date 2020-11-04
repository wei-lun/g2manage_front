<template>
  <v-dialog :value="dl" dark persistent max-width="650px">
    <v-card>
      <v-card-title>
        編輯獨立站資訊
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
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.ga_prefix"
                  :rules="[FV.required, FV.min2, FV.max50]"
                  label="*GA前綴"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.ccdb_ip"
                  :rules="[FV.required, FV.ip]"
                  label="*CCDB IP"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.brdb_ip"
                  :rules="[FV.required, FV.ip]"
                  label="*BRDB IP"
                  hint="*必填選項"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="edit_data.bwdb_ip"
                  :rules="[FV.required, FV.ip]"
                  label="*BWDB IP"
                  hint="*必填選項"
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
    }
  },
  data() {
    return {
      parentPage: '/platform/site_info',
      editDialog: false,
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
