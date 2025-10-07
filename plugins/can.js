export default ({ store }, inject) => {
    inject('can', (permiso) => {
        const autenticado = store.getters['auth/isAuthenticated']
        if (!autenticado) return false
        
        const usuario = store.getters['auth/userAuthenticated']
        if (usuario.permissions.length > 0) {
            return usuario.permissions.includes(permiso)
        }
    })
}
