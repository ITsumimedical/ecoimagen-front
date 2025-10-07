const slugGlobal = '/contacto-empleado'

const listarContacto = (id) => `${slugGlobal}/${id}`
const guardarContacto =()=> `${slugGlobal}/crear`
const actualizarContacto =(id) => `${slugGlobal}/${id}`

export {
  listarContacto,
  guardarContacto,
  actualizarContacto,
}
