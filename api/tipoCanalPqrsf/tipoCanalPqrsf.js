const slugGlobal = '/tipo-canal-pqrsf'

const listarTipoCanalPqrsf = (page) => `${slugGlobal}/listar?page=${page}`
const guardarTipoCanalPqrsf =()=> `${slugGlobal}/crear`
const actualizarTipoCanalPqrsf =(id) => `${slugGlobal}/${id}`

export {
  listarTipoCanalPqrsf,
  guardarTipoCanalPqrsf,
  actualizarTipoCanalPqrsf
}