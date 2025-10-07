const slugGlobal = '/vacacion-empleado'

const listarVacaciones = (id) => `${slugGlobal}/${id}`
const guardarVacacion =()=> `${slugGlobal}/crear`
const actualizarVacacion =(id) => `${slugGlobal}/${id}`

export {
  listarVacaciones,
  guardarVacacion,
  actualizarVacacion,
}
