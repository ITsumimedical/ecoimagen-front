const slugGlobal = '/turno-th'

const listarTurnos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarTurno =()=> `${slugGlobal}/crear`
const actualizarTurno =(id) => `${slugGlobal}/${id}`
const exportarTurno = () => `${slugGlobal}/exportar`

export {
  listarTurnos,
  guardarTurno,
  actualizarTurno,
  exportarTurno
}
