export const state = () => ({
  inprogress: false,
  progressFlag: false
})

export const actions = {
  setProgress({ commit, state }) {
    if (state.progressFlag === true) {
      commit('progressFlag')
      setTimeout(() => {
        commit('complete')
      }, 300)
    } else {
      commit('start')
    }
  }
}

export const mutations = {
  start(state) {
    state.inprogress = true
    state.progressFlag = true
  },
  complete(state) {
    state.inprogress = false
  },
  progressFlag(state) {
    state.progressFlag = false
  }
}
