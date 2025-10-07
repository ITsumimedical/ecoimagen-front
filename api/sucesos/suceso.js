const slugGlobal = '/sucesos'

const listarSucesos = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarSuceso =()=> `${slugGlobal}/crear`
const actualizarSuceso =(id) => `${slugGlobal}/${id}`

export {
  listarSucesos,
  guardarSuceso,
  actualizarSuceso,
}
