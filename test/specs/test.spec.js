import { mount, createLocalVue } from '@vue/test-utils'
import test from 'ava'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
// import Axios from 'axios'
// import index from '@/pages/platform/sitestatus.vue'
import index from '@/pages/index.vue'

let localVue, vuetify, store

test.beforeEach((t) => {
  localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Vuetify)
  // localVue.use(Axios)
  // axios = new Axios()
  vuetify = new Vuetify({
    breakpoint: { width: 1000 }
  })
  store = new Vuex.Store({
    state: {
      alert: {
        snackbar: {
          test: '我在這',
          status: 'warning'
        }
      },
      loading: {
        inprogress: false
      },
      auth: {
        user: {
          account: null,
          password: null,
          token: null,
          type: null,
          isLogin: null
        },
        userPermission: {
          Root: false,
          Operation: false,
          CS: false,
          Sales: false
        }
      },
      breadcrumb: {
        text: ''
      }
    }
  })
})
test('is a Vue instance', (t) => {
  const wrapper = mount(index, {
    localVue,
    vuetify,
    store
  })
  // console.log('#################')
  // console.log(wrapper.html())
  // console.log('#################')
  t.is(wrapper.isVueInstance(), true)
})
