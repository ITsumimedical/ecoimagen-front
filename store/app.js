export const state = () => ({
    preload: false,
})

export const mutations = {
    setPreload(state, data) {
        state.preload = data
    },
}

export const actions = {
    setPreload({commit}, data) {
        commit('setPreload', data)
    }
}
