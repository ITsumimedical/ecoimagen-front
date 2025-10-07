const slugGlobal = '/tipo-solicitud'

const listarTipoSolicitud = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTipoSolicitud =()=> `${slugGlobal}/crear`
const actualizarTipoSolicitud =(id) => `${slugGlobal}/${id}`
const listarActivos = (page = 1) => `${slugGlobal}/listarActivos?page=${page}`

export {
  listarTipoSolicitud,
  guardarTipoSolicitud,
  actualizarTipoSolicitud,
  listarActivos
}
