const slugGlobal = '/temas-inducciones-especificas'

const listarTemas = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTema =()=> `${slugGlobal}/crear`
const actualizarTema =(id) => `${slugGlobal}/${id}`

export {
  listarTemas,
  guardarTema,
  actualizarTema,
}
