const slugGlobal = '/tipo-solicitud-pqrsf'

const listarTipoSolicitudPqrsf = (page) => `${slugGlobal}/listar?page=${page}`
const guardarTipoSolicitudPqrsf =()=> `${slugGlobal}/crear`
const actualizarTipoSolicitudPqrsf =(id) => `${slugGlobal}/${id}`

export {
  listarTipoSolicitudPqrsf,
  guardarTipoSolicitudPqrsf,
  actualizarTipoSolicitudPqrsf
}