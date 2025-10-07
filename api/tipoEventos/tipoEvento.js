const slugGlobal = '/tipos-eventos'

const listarTiposEventos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTipoEvento =()=> `${slugGlobal}/crear`
const actualizarTipoEvento =(id) => `${slugGlobal}/${id}`

export {
  listarTiposEventos,
  guardarTipoEvento,
  actualizarTipoEvento,
}
