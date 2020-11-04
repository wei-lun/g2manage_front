// eslint-disable-next-line no-unused-vars
import qs from 'qs'

export default function({ $axios, store, redirect }) {
  // $axios.defaults.baseURL =
  //   'https://574bd121-5ca2-4f94-b1f3-08b349784e8a.mock.pstmn.io'
  // $axios.defaults.baseURL = process.env.apiUrl
  // $axios.defaults.baseURL = 'http://127.0.0.1:5000'
  // $axios.defaults.baseURL = 'https://g2mb.jutainet.com'
  // $axios.defaults.timeout = 1115000

  $axios.onRequest((config) => {
    store.dispatch('loading/setProgress')
  })

  $axios.onResponse((response) => {
    store.dispatch('loading/setProgress')
  })

  $axios.onError((err) => {
    store.dispatch('loading/setProgress')
    const code = parseInt(err.response && err.response.status)

    if (!!code && err.response.status === 401) {
      store.commit('auth/logout')
      store.dispatch('alert/danger', '帳號連接逾時，請重新登入')
      return err
    } else if (!!code === false) {
      // store.commit('auth/logout')
      store.dispatch('alert/danger', '連線出錯，請聯繫管理員')
      return err
    } else {
      store.dispatch('alert/danger', err.response.data.message)
      return err
    }
  })

  // // request攔截
  // $axios.interceptors.request.use(
  //   (config) => {
  //     // config.headers['x-api-key'] = '2f39276b985a49d284629b0dcafcd980'
  //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  //     config.headers.Authorization = 'Bearer ' + store.state.auth.user.token
  //     if (config.method === 'post') {
  //       config.data = qs.stringify(config.data)
  //     }
  //     if (config.method === 'put') {
  //       config.data = qs.stringify(config.data)
  //     }
  //     return config
  //   },
  //   (error) => {
  //     Promise.reject(error)
  //   }
  // )

  // response攔截
  $axios.interceptors.response.use(
    (res) => {
      if (res.status !== 200 && res.status !== 201) {
        return Promise.reject(res)
      }
      return res
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
