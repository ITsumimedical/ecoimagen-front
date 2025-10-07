const slugGlobal = '/etiqueta-th'

const listarEtiquetas = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarEtiqueta =()=> `${slugGlobal}/crear`
const actualizarEtiqueta =(id) => `${slugGlobal}/${id}`
const exportarEtiqueta = () => `${slugGlobal}/exportar`

export {
  listarEtiquetas,
  guardarEtiqueta,
  actualizarEtiqueta,
  exportarEtiqueta,
}
