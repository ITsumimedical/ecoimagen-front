export const state = () => ({
    prestadores: []
})

export const mutations = {
    setPrestadores(state, data) {
        state.prestadores = data
    },
}

export const actions = {
    async getPrestadores({ commit }) {
        try {
            const { data } = await this.$axios.get('/prestador')
            console.log(data)
        } catch (error) {
            console.error(error.response)
        }
    }
}
