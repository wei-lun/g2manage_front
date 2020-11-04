import { shallowMount, createLocalVue } from '@vue/test-utils'
import test from 'ava'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import snackbar from '@/pages/platform/sitestatus.vue'

let localVue, store, wrapper, vuetify

test.beforeEach((t) => {
  localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Vuetify)
  vuetify = new Vuetify({
    breakpoint: { width: 1000, xsOnly: true }
  })
  store = new Vuex.Store({
    state: {
      alert: {
        snackbar: {
          isshow: false,
          text: '文字測試',
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
test('首次Mount正常', (t) => {
  wrapper = shallowMount(snackbar, {
    propsData: {
      isshow: false
    },
    localVue,
    store,
    vuetify
  })
  // console.log('#################')
  // console.log(wrapper.html())
  // console.log('#################')
  // t.is(wrapper.contains('v-snackbar-stub'), true)
  t.is(wrapper.isVueInstance(), true)
})
// test('確認vuex運作正常', (t) => {
//   wrapper.setData({
//     $store: {
//       state: {
//         alert: {
//           snackbar: {
//             isshow: true,
//             text: '文字測試2',
//             status: 'warning'
//           }
//         }
//       }
//     }
//   })
//   const snackbar = wrapper.find('v-snackbar-stub')
//   console.log('#################')
//   console.log(snackbar.html())
//   console.log('#################')
//   t.true(snackbar.text().replace(/\s+/g, '') === '文字測試2關閉')
//   t.true(snackbar.attributes('color') === 'warning')
//   t.true(snackbar.attributes('value') === 'true')
//   // t.is(wrapper.contains('v-snackbar-stub'), true)
// })
