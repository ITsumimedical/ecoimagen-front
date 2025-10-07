const slugGlobal = '/tipo-citas'

const listarTipoCitas = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTipoCitas =()=> `${slugGlobal}/crear`
const actualizarTipoCitas =(id) => `${slugGlobal}/${id}`

export {
  listarTipoCitas,
  guardarTipoCitas,
  actualizarTipoCitas,
}
