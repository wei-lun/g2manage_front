export const state = () => ({
  text: ''
})

export const actions = {}

export const mutations = {
  setBreadCrumb(state, payload) {
    state.text = payload
  }
}
