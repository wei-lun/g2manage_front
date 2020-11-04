export const state = () => ({
  user: {
    account: null,
    password: null,
    token: null,
    type: null,
    isLogin: null,
    permission: null,
    setting: null
  },
  themeDark: true
})

export const actions = {
  /* login({ commit, state }, payload) {
    commit('logined', {
      account: payload.account,
      password: payload.password,
      token: payload.token
    })
  } */
}

export const mutations = {
  logined(state, payload) {
    state.user.token = payload.token
    state.user.expires_in = payload.expires_in
    state.user.isLogin = true
    state.user.account = payload.login_data.account
    state.user.type = payload.login_data.type
    state.user.permission = payload.login_data.permission
    state.user.setting = payload.login_data.setting
    localStorage.setItem('authen_expires', payload.expires_in)
    localStorage.setItem('authen_token', payload.token)
    localStorage.setItem('authen_user', JSON.stringify(state.user))
  },
  refreshToken(state, payload) {
    state.user.token = payload.token
    state.user.expires_in = payload.expires_in
    localStorage.setItem('authen_expires', payload.expires_in)
    localStorage.setItem('authen_token', payload.token)
    localStorage.setItem('authen_user', JSON.stringify(state.user))
  },
  logout(state, payload) {
    Object.keys(state.user).forEach(function(key) {
      if (Object.prototype.hasOwnProperty.call(state.user, key)) {
        state.user[key] = null
      }
    })
    // unsetStorage()
    localStorage.removeItem('authen_expires')
    localStorage.removeItem('authen_token')
    localStorage.removeItem('authen_user')
    localStorage.setItem('logout', Date.now())
    // this.$router.push(state.route.home)
    this.$router.push('/login')
  },
  setUserToStorage(state, userToken) {
    state.user.name = userToken.name
    state.user.exp = userToken.exp * 1000 // javascript timestamp = Server timestamp * 1000
    state.user.iat = Date.now()
    state.user.groups = userToken.groups
  },
  setUserData(state, payload) {
    // localStorage to state
    state.user.expires_in = localStorage.getItem('authen_expires')
    state.user.token = localStorage.getItem('authen_token')
    state.user = JSON.parse(localStorage.getItem('authen_user'))
    state.user.isLogin = true
  },
  setTheme(state, payload) {
    state.themeDark = !state.themeDark
    localStorage.setItem('user_dark_theme', state.themeDark)
  },
  getTheme(state, payload) {
    state.themeDark = localStorage.getItem('user_dark_theme')
      ? JSON.parse(localStorage.getItem('user_dark_theme'))
      : true
  }
}
