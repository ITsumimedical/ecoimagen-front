/**
 * Devuelve true si la contraseña está expirada
 * (más de 30 días desde el último cambio o nunca cambió).
 *
 * @param {Object} usuario – Objeto de usuario retornado por auth/me
 * @returns {boolean}
 */
export function contrasenaExpirada(usuario) {
    const fechaUltimoCambioStr = usuario.password_changed_at;

    if (!fechaUltimoCambioStr) {
        return true;
    }

    const fechaUltimoCambio = new Date(fechaUltimoCambioStr);
    const ahora = Date.now();

    const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

    return ahora - fechaUltimoCambio.getTime() > TREINTA_DIAS_MS;
}

/**
 * Inicializa la autenticación y redirige al login o al flujo de cambio de contraseña si corresponde.
 */
export async function initAuth({ store, redirect }) {
    const tokenData = localStorage.getItem("token");
    if (!tokenData || tokenData === "undefined") {
        localStorage.removeItem("token");
        return redirect("/");
    }

    store.commit("auth/SET_AUTH_TOKEN", tokenData);

    const ok = await store.dispatch("auth/me");
    if (!ok) {
        return redirect("/");
    }

    const usuario = store.state.auth.usuario;
    if (contrasenaExpirada(usuario)) {
        store.dispatch("cambioContrasena/abrirModalCambioContrasena");
        return;
    }

    console.log("Auth inicializada correctamente y contraseña vigente");
}
