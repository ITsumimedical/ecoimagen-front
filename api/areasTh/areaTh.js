const slugGlobal = '/areasTh'

const listarAreasTh = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarAreasTh =()=> `${slugGlobal}/crear`
const actualizarAreasTh =(id) => `${slugGlobal}/${id}`
const exportarAreaTh = () => `${slugGlobal}/exportar`

export {
  listarAreasTh,
  guardarAreasTh,
  actualizarAreasTh,
  exportarAreaTh,
}
