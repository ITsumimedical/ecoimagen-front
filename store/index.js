


export const state = () => ({
    loading: false,
})

export const getters = {
    isAuthenticated(state) {
        return state.auth.loggedIn;
    },
    getUserInfo(state) {
        return state.auth.user;
    }
};

export const mutations = {
    setLoading(state, data) {
        state.loading = data
    },
}


export const strict = false;

