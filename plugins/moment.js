import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-tw'
/*
export default ({ app }, inject) => {
  inject('moment', args => moment(args))
}
*/
// moment.locale('zh-tw')
/*
const common = {
  install(Vue) {
    Vue.prototype.$moment = {
      moment: date => {
        const newMoment = new Moment(date)
        newMoment.locale('zh-cn')
        return newMoment
      }
    }
  }
} */
moment.locale('zh-tw')
Vue.use(moment)
