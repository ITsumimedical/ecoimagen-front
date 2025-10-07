const slugGlobal = '/permisos'

const listarPermisos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarPermisos =()=> `${slugGlobal}/crear`
const actualizarPermisos =(id) => `${slugGlobal}/${id}`

export {
  listarPermisos,
  guardarPermisos,
  actualizarPermisos,
}
