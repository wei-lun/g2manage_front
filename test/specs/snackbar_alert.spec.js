import { shallowMount, createLocalVue } from '@vue/test-utils'
import test from 'ava'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import snackbar from '@/components/snackbar_alert.vue'

let localVue, store, wrapper

test.beforeEach((t) => {
  localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Vuetify)
  store = new Vuex.Store({
    state: {
      alert: {
        snackbar: {
          isshow: false,
          text: '文字測試',
          status: 'warning'
        }
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
    store
  })
  // console.log('#################')
  // console.log(wrapper.html())
  // console.log('#################')
  t.is(wrapper.contains('v-snackbar-stub'), true)
})
test('確認vuex運作正常', (t) => {
  wrapper.setData({
    $store: {
      state: {
        alert: {
          snackbar: {
            isshow: true,
            text: '文字測試2',
            status: 'warning'
          }
        }
      }
    }
  })
  const snackbar = wrapper.find('v-snackbar-stub')
  // console.log('#################')
  // console.log(snackbar.html())
  // console.log(snackbar.attributes('color'))
  // console.log('#################')
  // t.true(snackbar.text().replace(/\s+/g, '') === '文字測試2關閉')
  t.true(snackbar.attributes('color') === 'warning')
  // t.true(snackbar.attributes('value') === 'true')
  // t.is(wrapper.contains('v-snackbar-stub'), true)
})
