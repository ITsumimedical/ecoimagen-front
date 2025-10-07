const slugGlobal = '/proyectos'

const listarProyectos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarProyecto =()=> `${slugGlobal}/crear`
const actualizarProyecto =(id) => `${slugGlobal}/${id}`

export {
  listarProyectos,
  guardarProyecto,
  actualizarProyecto,
}
