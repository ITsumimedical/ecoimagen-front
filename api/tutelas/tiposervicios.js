const slugGlobal = '/tipo-servicio'

const listarTipoServicio = (page) => `${slugGlobal}?page=${page}`
const guardarTipoServicio = () => `${slugGlobal}`
const actualizarTipoServicio =(id) => `${slugGlobal}/${id}`

export {
  listarTipoServicio,
  guardarTipoServicio,
  actualizarTipoServicio
}
