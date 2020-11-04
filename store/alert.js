export const state = () => ({
  timeOutObject: null,
  snackbar: {
    isshow: false,
    status: 'success',
    text: null
  }
})

export const actions = {
  alert({ commit, state }, { status, text }) {
    if (state.timeOutObject != null) {
      commit('clearTimeout')
    }
    commit({
      type: 'alert',
      alertData: { status, text }
    })
    const timeOutObject = setTimeout(() => {
      commit('disableAlert')
    }, 4000)
    commit({
      type: 'timeOutObj',
      timeOutObject
    })
  },
  success({ dispatch }, payload) {
    dispatch('alert', { status: 'success', text: payload })
  },
  danger({ dispatch }, payload) {
    dispatch('alert', { status: 'danger', text: payload })
  },
  warning({ dispatch }, payload) {
    dispatch('alert', { status: 'warning', text: payload })
  }
}

export const mutations = {
  timeOutObj(state, { timeOutObject }) {
    state.timeOutObject = timeOutObject
  },
  clearTimeout(state) {
    clearTimeout(state.timeOutObject)
    state.timeOutObject = null
  },
  alert(state, { alertData }) {
    state.snackbar.status = alertData.status
    state.snackbar.text = alertData.text
    state.snackbar.isshow = true
  },
  disableAlert(state) {
    state.snackbar.isshow = false
    // state.snackbar.status = null
    // state.snackbar.text = null
    clearTimeout(state.timeOutObject)
    state.timeOutObject = null
  }
}
