const slugGlobal = '/usuarios'

const listarUsuarios = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarUsuario = () => `${slugGlobal}/crear`
const actualizarUsuario = (id) =>`${slugGlobal}/${id}`
const asignarRoles = (usuario) => `${slugGlobal}/agregarRol/${usuario}`
const asignarEntidades = (usuario) => `${slugGlobal}/agregarEntidad/${usuario}`
const removerEntidades = (usuario) => `${slugGlobal}/removerEntidad/${usuario}`
const asignarPermiso = (usuario) => `${slugGlobal}/agregarPermiso/${usuario}`
const removerPermiso = (usuario) => `${slugGlobal}/removerPermiso/${usuario}`
const removerRol = (usuario) => `${slugGlobal}/removerRol/${usuario}`


export {
  listarUsuarios,
  guardarUsuario,
  actualizarUsuario,
  asignarRoles,
  asignarEntidades,
  asignarPermiso,
  removerPermiso,
  removerRol,
  removerEntidades
}

