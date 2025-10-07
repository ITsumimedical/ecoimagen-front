const slugGlobal = '/tipos-solicitudes-pqrsf'

const guardarTipoSolicitud =()=> `${slugGlobal}/crear`
const actualizarTipoSolicitud =(id) => `${slugGlobal}/${id}`

export {
  guardarTipoSolicitud,
  actualizarTipoSolicitud,
}
