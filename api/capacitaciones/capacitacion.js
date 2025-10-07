const slugGlobal = '/capacitacion-empleado'

const listarCapacitaciones = () => `${slugGlobal}/listar`
const guardarCapacitacion =()=> `${slugGlobal}/crear`
const actualizarCapacitacion =(id) => `${slugGlobal}/${id}`

export {
  listarCapacitaciones,
  guardarCapacitacion,
  actualizarCapacitacion,
}
