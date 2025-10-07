const slugGlobal = '/consultorios'

const listarConsultorios = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarConsultorio =()=> `${slugGlobal}/crear`
const actualizarConsultorio =(id) => `${slugGlobal}/${id}`

export {
  listarConsultorios,
  guardarConsultorio,
  actualizarConsultorio,
}
