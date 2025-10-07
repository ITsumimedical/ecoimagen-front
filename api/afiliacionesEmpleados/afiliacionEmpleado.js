const slugGlobal = '/afiliacion-empleado'

const listarAfiliacionEmpleado = (id) => `${slugGlobal}/${id}`
const guardarAfiliacionEmpleado =()=> `${slugGlobal}/crear`
const actualizarAfiliacionEmpleado =(id) => `${slugGlobal}/${id}`

export {
  listarAfiliacionEmpleado,
  guardarAfiliacionEmpleado,
  actualizarAfiliacionEmpleado,
}
