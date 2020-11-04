import moment from 'moment'
import { refreshToken } from '~/plugins/api_route'

export default async ({ store, redirect, route, error }) => {
  // if (store.state.menu.menulist.length === 0) {
  //   store.commit('menu/setMenulist', store.state.auth.user.setting)
  //   console.log(store.state.menu.menulist)
  // }
  // console.log(route)

  // return error({
  //         message: '帳號權限不足,請聯繫管理員',
  //         statusCode: 401
  //       })
  // localStorage 登入判定
  let logined = true
  const storageKey = ['authen_expires', 'authen_token', 'authen_user']

  storageKey.every(function(element) {
    if (!!localStorage.getItem(element) === false) {
      logined = false
    }
    return !!localStorage.getItem(element)
  })

  // 判定登入並寫入state
  if (logined) {
    if (!store.state.auth.user.isLogin) store.commit('auth/setUserData')
    // token過期前30分鐘若有活躍 主動刷新token
    const diff = moment(
      parseInt(store.state.auth.user.expires_in + '000')
    ).diff(moment(), 'minutes', true)

    if (diff < 30) {
      await refreshToken({ account: store.state.auth.user.account })
        .then(function(response) {
          store.commit('auth/refreshToken', response.data)
        })
        .catch(function(error) {
          if (error) {
            store.commit('auth/logout')
            store.dispatch('alert/danger', '登入驗證過期')
          }
        })
    }
  } else if (route.path.replace(/\/$/, '') !== '/login') {
    // 判定未登入，導到登入畫面
    // store.commit('auth/logout')
    // store.dispatch('alert/danger', '帳號驗證錯誤，請重新登入')
    // redirect('/login')
  }
}
