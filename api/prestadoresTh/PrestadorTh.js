const slugGlobal = '/prestador-th'

const listarPrestadores = () => `${slugGlobal}/listar`
const guardarPrestadores =()=> `${slugGlobal}/crear`
const actualizarPrestadores =(id) => `${slugGlobal}/${id}`

export {
  listarPrestadores,
  guardarPrestadores,
  actualizarPrestadores,
}
