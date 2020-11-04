<template>
  <v-dialog :value="true" persistent max-width="650px" dark>
    <v-card>
      <v-card-title>
        新增角色權限
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="">
                <v-text-field
                  v-model="form_data.permission"
                  :rules="[FV.required, FV.min1, FV.max20]"
                  label="*角色名稱"
                  hint="*必填選項"
                />
              </v-col>
              <v-col cols="12" sm="">
                <v-select
                  v-model="form_data.type"
                  :items="userTypeArr"
                  :rules="[FV.required]"
                  item-text="name"
                  item-value="value"
                  label="*帳號類型"
                  hint="*必填選項"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p class="title">權限調整</p>
                <v-permission-setting
                  v-model="form_data.setting"
                  :readonly="false"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form_data.note"
                  :rules="[FV.max100]"
                  label="備註"
                  solo-inverted
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="saveData">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getUserConf, permissionSettingAddition } from '~/plugins/api_route'
import formValidation from '~/plugins/form_validation.js'
import vPermissionSetting from '~/components/user_management/permission_setting_list.vue'

export default {
  components: {
    vPermissionSetting
  },
  props: {
    editKey: { type: String, default: '' },
    editData: {
      type: Object,
      default() {
        return {}
      }
    },
    userTypeArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      parentPage: '/user_management/permission_setting',
      form_data: { setting: {} },
      FV: formValidation.rules
    }
  },
  created() {
    if (this.editKey === '') this.fetchSetting()
    else {
      this.$set(this.form_data, 'setting', this.editData.setting)
    }
  },
  methods: {
    async fetchSetting() {
      await getUserConf(this.$store.state.auth.user.account)
        .then((response) => {
          const settingList = response.data.data.setting
          Object.keys(settingList).forEach((key) => {
            this.$set(this.form_data.setting, key, {
              read: false,
              write: false
            })
          })
        })
        .catch((error) => {
          if (error) {
            this.$store.dispatch('alert/danger', '帳號異常，請重新登入')
          }
        })
    },
    async saveData() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.form_data))
        data.setting = JSON.stringify(this.form_data.setting)
        await permissionSettingAddition(data)
          .then((response) => {
            this.$store.dispatch('alert/success', '新增成功')
            this.$emit('fetchData')
            this.$router.push(this.parentPage)
          })
          .catch((error) => {
            if (error) {
              this.$store.dispatch('alert/danger', error.response.data.message)
            }
          })
      } else {
        this.$store.dispatch('alert/danger', '請填入正確資料')
      }
    }
  }
}
</script>
