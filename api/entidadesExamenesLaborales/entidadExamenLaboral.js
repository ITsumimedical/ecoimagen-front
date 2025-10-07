const slugGlobal = '/entidad-examen-laboral'

const listarEntidades = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarEntidad =()=> `${slugGlobal}/crear`
const actualizarEntidad =(id) => `${slugGlobal}/${id}`

export {
  listarEntidades,
  guardarEntidad,
  actualizarEntidad,
}
