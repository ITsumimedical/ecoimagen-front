const slugGlobal = '/estados'

const listarEstados = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarEstados =()=> `${slugGlobal}/crear`
const actualizarEstados =(id) => `${slugGlobal}/${id}`

export {
  listarEstados,
  guardarEstados,
  actualizarEstados,
}
