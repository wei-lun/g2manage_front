<template>
  <v-dialog :value="dl" persistent max-width="650px" dark>
    <v-card>
      <v-card-title>
        編輯使用者帳號
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="edit_data.account"
                  label="帳號"
                  hide-details
                  disabled
              /></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="">
                <div @click="$refs.switchPermission.openPermissionDialog()">
                  <v-select
                    v-model="edit_data.type"
                    :items="userTypeArr"
                    :rules="[FV.required]"
                    item-text="name"
                    item-value="value"
                    label="*帳號類型"
                    hint="*必填選項"
                    hide-details
                    disabled
                  />
                </div>
              </v-col>
              <v-col cols="12" sm="">
                <div @click="$refs.switchPermission.openPermissionDialog()">
                  <v-text-field
                    v-model="edit_data.permission"
                    :rules="[FV.required]"
                    label="*角色名稱"
                    hint="*必填選項"
                    hide-details
                    disabled
                  />
                </div>
              </v-col>
              <v-col class="d-flex align-center" cols="auto">
                <v-switch-permission
                  ref="switchPermission"
                  :user-type-arr="userTypeArr"
                  @output="switchPermission"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-expansion-panels>
                <v-expansion-panel key="panel-1">
                  <v-expansion-panel-header class="grey darken-2">
                    查看權限
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="grey darken-2">
                    <v-permission-setting v-model="edit_data.setting" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-switch
                  v-model="edit_data.status"
                  color="primary"
                  label="帳號狀態"
                  hide-details
                  true-value="on"
                  false-value="off"
                />
              </v-col>
              <!-- <v-col cols="12" sm="6">
                <v-text-field
                  v-model="edit_data.nickneme"
                  label="帳號暱稱"
                  :rules="[FV.max50]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="edit_data.note"
                  label="備註"
                  solo-inverted
                  :rules="[FV.max100]"
                />
              </v-col> -->
            </v-row>
          </v-container>
          <small>*為必填選項</small>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :to="parentPage" color="danger">關閉</v-btn>
        <v-btn color="success" @click="saveEdit">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { userConfiguration, getUserConf } from '~/plugins/api_route'
import formValidation from '~/plugins/form_validation.js'
import vPermissionSetting from '~/components/user_management/permission_setting_list.vue'
import vSwitchPermission from '~/components/user_management/switch_permission.vue'

export default {
  components: {
    vPermissionSetting,
    vSwitchPermission
  },
  props: {
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
      parentPage: '/user_management/user_list',
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
      // this.getUserData()
    }
  },
  methods: {
    switchPermission(permission) {
      this.edit_data.type = permission.type
      this.edit_data.permission = permission.permission
      this.edit_data.setting = permission.setting
    },
    async getUserData() {
      await getUserConf(this.edit_data.account)
        .then((response) => {
          // console.log(response.data.data)
        })
        .catch((error) => {
          if (error) {
            this.$store.dispatch('alert/danger', error.response.data.message)
            this.$router.push(this.parentPage)
          }
        })
    },
    async saveEdit() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.edit_data))
        delete data.setting
        await userConfiguration(data.account, data)
          .then((response) => {
            this.$store.dispatch('alert/success', '編輯成功')
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
