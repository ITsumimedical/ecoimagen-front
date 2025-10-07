const slugGlobal = '/hijo-empleado'

const listarHijo = (id) => `${slugGlobal}/${id}`
const guardarHijo =()=> `${slugGlobal}/crear`
const actualizarHijo =(id) => `${slugGlobal}/${id}`

export {
  listarHijo,
  guardarHijo,
  actualizarHijo,
}
