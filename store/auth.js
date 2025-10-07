export const state = () => ({
    token: null,
    usuario: null,
});

export const mutations = {
    SET_AUTH_TOKEN(state, token) {
        state.token = token
    },
    SET_AUTH_USER(state, usuario) {
        state.usuario = usuario
    },
};

export const actions = {

    login({ commit }, form) {
        return this.$axios.post("/auth/login", form).then(({ data }) => {
            // Guarda el token en Vuex y en el localStorage
            commit('SET_AUTH_TOKEN', data.token);
            localStorage.setItem('token', data.token);

            commit('SET_AUTH_USER', data.usuario);
        });
    },

    logout({ commit }) {
        return this.$axios.post("/auth/logout").finally(() => {
            commit('SET_AUTH_TOKEN', null);
            localStorage.removeItem('token');
            return true;
        });
    },

    me({ commit, state }) {
        return this.$axios.get("/auth/me", {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(({ data }) => {
            commit('SET_AUTH_USER', data);
            return true;
        }).catch((error) => {

            if (error.response.status === 401) {
                commit('SET_AUTH_TOKEN', null);
                localStorage.removeItem('token');
            }

            if (error.response.status === 500) {
                commit('SET_AUTH_TOKEN', null);
                localStorage.removeItem('token');
            }

            return false;
        });
    },
};

export const getters = {
    isAuthenticated: (state) => !!state.token,
    userAuthenticated: (state) => state.usuario,
    tokenAuthenticated: (state) => state.token,
};
