<template>
  <v-layout class="mt-5" justify-center align-center>
    <v-flex xs12 sm6>
      <v-card flat>
        <v-toolbar flat color="primary">
          <v-toolbar-title>使用者設定</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-text-field
              v-model="user.account"
              :rules="[FV.required, FV.alpha_num]"
              prepend-icon="mdi-account"
              label="帳號"
              disabled
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="[FV.required, FV.alpha_num]"
              prepend-icon="mdi-lock"
              label="原密碼"
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="[FV.required, FV.alpha_num]"
              prepend-icon="mdi-lock"
              label="新密碼"
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="user.passwordcheck"
              :rules="[FV.required, FV.alpha_num, checkPsd]"
              prepend-icon="mdi-lock"
              label="確認新密碼"
              type="password"
            ></v-text-field>
            <v-select
              v-model="user.type"
              :items="accountType"
              :rules="[FV.required]"
              item-text="name"
              item-value="value"
              label="帳戶類型"
              hint="*必填選項"
            ></v-select>
            <v-text-field
              v-model="user.nikename"
              prepend-icon="mdi-account"
              label="暱稱(選填)"
            ></v-text-field>
            <v-textarea
              v-model="user.note"
              label="備註(選填)"
              filled
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success">修改</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { userSignUp } from '~/plugins/api_route'
import formValidation from '~/plugins/form_validation.js'

export default {
  components: {
    // Logo
  },
  meta: {
    auth: { authority: 'R' }
  },
  data() {
    return {
      user: {},
      accountType: [
        {
          name: '業務',
          value: 'S'
        },
        {
          name: '客服',
          value: 'C'
        },
        {
          name: '維運',
          value: 'O'
        }
      ],
      FV: formValidation.rules
    }
  },
  computed: {
    checkPsd() {
      if (this.user.passwordcheck !== this.user.password) return '密碼不相符'
      else return true
    }
  },
  methods: {
    async signUp() {
      if (this.$refs.form.validate()) {
        await userSignUp(this.user)
          .then((response) => {
            this.user = {}
            this.$refs.form.resetValidation()
            this.$store.dispatch('alert/success', '新增成功')
          })
          .catch((error) => {
            if (error) {
              this.$store.dispatch('alert/danger', error.response.data.message)
            }
          })
      } else {
        this.$store.dispatch('alert/danger', '請確認表單資訊')
      }
    }
  }
}
</script>
