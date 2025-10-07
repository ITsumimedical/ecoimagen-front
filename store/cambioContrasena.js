export const state = () => ({
    mostrarModalCambioContrasena: false,
    usuarioObjetivo: null,
    obligatorio: false,
});

export const mutations = {
    SET_MOSTRRAR_MODAL(state, valor) {
        state.mostrarModalCambioContrasena = valor;
    },
    SET_USUARIO_OBJETIVO(state, usuario) {
        state.usuarioObjetivo = usuario;
    },
    SET_OBLIGATORIO(state, valor) {
        state.obligatorio = valor;
    }
};

export const actions = {
    abrirModalCambioContrasena({ commit }, { usuario, obligatorio } = {}) {
        commit("SET_USUARIO_OBJETIVO", usuario);
        commit("SET_OBLIGATORIO", obligatorio);
        commit("SET_MOSTRRAR_MODAL", true);
    },
    cerrarModalCambioContrasena({ commit }) {
        commit("SET_USUARIO_OBJETIVO", null);
        commit("SET_MOSTRRAR_MODAL", false);
    },
};
