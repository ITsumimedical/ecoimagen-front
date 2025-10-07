const slugGlobal = '/cargo'

const listarCargos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarCargos =()=> `${slugGlobal}/crear`
const actualizarCargos =(id) => `${slugGlobal}/${id}`
const exportarCargo = () => `${slugGlobal}/exportar`

export {
  listarCargos,
  guardarCargos,
  actualizarCargos,
  exportarCargo,
}
