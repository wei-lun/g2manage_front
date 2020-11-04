<template>
  <v-layout justify-center align-center fill-height>
    <v-flex xs12 sm6 align="center">
      <v-card flat>
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>請輸入登錄信息</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" lazy-validation @keyup.native.enter="login()">
          <v-card-text>
            <v-alert
              :value="alertError"
              type="error"
              transition="scale-transition"
              class="mb-3"
            >
              {{ errorMessage }}
            </v-alert>
            <v-text-field
              v-model="user.account"
              :rules="[FV.required]"
              prepend-icon="mdi-account"
              name="login"
              label="帳戶"
            ></v-text-field>
            <v-text-field
              ref="psd"
              v-model="user.password"
              :rules="[FV.required]"
              prepend-icon="mdi-lock"
              name="password"
              label="密碼"
              type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="$store.state.loading.inprogress"
              :disabled="$store.state.loading.inprogress"
              color="primary"
              @click="login()"
              >登入</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { userLogin } from '~/plugins/api_route'
import formValidation from '~/plugins/form_validation.js'

export default {
  data() {
    return {
      user: {
        account: '',
        password: ''
      },
      FV: formValidation.rules,
      // alertError: false,
      // errorMessage: '帳號或密碼錯誤',
      logined: true
    }
  },
  computed: {
    alertError() {
      if (
        !!this.$store.state.alert.snackbar.text === true &&
        this.$store.state.alert.snackbar.status !== 'success'
      )
        return true
      else return false
    },
    errorMessage() {
      if (
        !!this.$store.state.alert.snackbar.text === true &&
        this.$store.state.alert.snackbar.status !== 'success'
      )
        return this.$store.state.alert.snackbar.text
      else return ''
    }
  },
  created() {
    // localStorage 已登入判定
    const storageKey = ['authen_expires', 'authen_token', 'authen_user']

    storageKey.every((element) => {
      if (!!localStorage.getItem(element) === false) {
        this.logined = false
      }
      return !!localStorage.getItem(element)
    })

    // 判定登入並寫入state
    if (this.logined) {
      this.$store.commit('auth/setUserData')
      // 之後改成不主動跳轉
      this.$router.push('/')
    }
  },
  methods: {
    async loginPost() {
      await userLogin(this.user)
        .then((response) => {
          this.$store.commit('auth/logined', {
            expires_in: response.data.expires_in,
            token: response.data.token,
            login_data: response.data.login_data
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
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.loginPost()
      } else {
        this.$store.dispatch('alert/danger', '必填選項未填')
      }
    }
  }
}
</script>
