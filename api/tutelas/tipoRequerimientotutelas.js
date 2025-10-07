const slugGlobal = '/tipo-requerimiento'

const listarTiposRequerimientos = (page) => `${slugGlobal}?page=${page}`
const guardarTipoRequerimientos = () => `${slugGlobal}`
const actualizarTipoRequerimientos =(id) => `${slugGlobal}/${id}`

export {
  listarTiposRequerimientos,
  guardarTipoRequerimientos,
  actualizarTipoRequerimientos
}
