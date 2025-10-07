const slugGlobal = '/roles'

const listarRoles = ()=> `${slugGlobal}/listar`
const guardarRoles = ()=>`${slugGlobal}/crear`
const actualizarRol = (id)=>`${slugGlobal}/${id}`
const asignarPermisos = (rol) => `${slugGlobal}/agregarPermiso/${rol}`
const removerpermiso = (rol) => `${slugGlobal}/removerPermiso/${rol}`


export {
  listarRoles,
  guardarRoles,
  actualizarRol,
  asignarPermisos,
  removerpermiso
}
