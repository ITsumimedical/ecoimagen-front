const slugGlobal = '/sede'

const listarSedes = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarSede =()=> `${slugGlobal}/crear`
const actualizarSede =(id) => `${slugGlobal}/${id}`

export {
  listarSedes,
  guardarSede,
  actualizarSede,
}
