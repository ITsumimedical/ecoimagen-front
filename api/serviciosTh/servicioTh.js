const slugGlobal = '/servicio-th'

const listarServicios = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarServicio =()=> `${slugGlobal}/crear`
const actualizarServicio =(id) => `${slugGlobal}/${id}`
const exportarServicio = () => `${slugGlobal}/exportar`

export {
  listarServicios,
  guardarServicio,
  actualizarServicio,
  exportarServicio,
}
