const slugGlobal = '/clasificaciones-areas'

const listarClasificaciones = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarClasificacion =()=> `${slugGlobal}/crear`
const actualizarClasificacion =(id) => `${slugGlobal}/${id}`

export {
  listarClasificaciones,
  guardarClasificacion,
  actualizarClasificacion,
}
