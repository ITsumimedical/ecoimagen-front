const slugGlobal = '/tipo-campo'

const listarTipoCampo = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTipoCampo =()=> `${slugGlobal}/crear`
const actualizarTipoCampo =(id) => `${slugGlobal}/${id}`

export {
  listarTipoCampo,
  guardarTipoCampo,
  actualizarTipoCampo,
}
