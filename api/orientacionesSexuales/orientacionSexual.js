const slugGlobal = '/orientaciones-sexuales'

const listarOrientaciones = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarOrientacion =()=> `${slugGlobal}/crear`
const actualizarOrientacion =(id) => `${slugGlobal}/${id}`
const exportarOrientacion = () => `${slugGlobal}/exportar`

export {
  listarOrientaciones,
  guardarOrientacion,
  actualizarOrientacion,
  exportarOrientacion
}
