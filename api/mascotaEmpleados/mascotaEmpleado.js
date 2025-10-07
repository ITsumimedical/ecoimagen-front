const slugGlobal = '/mascota-empleado'

const listarMascota = (id) => `${slugGlobal}/${id}`
const guardarMascota =()=> `${slugGlobal}/crear`
const actualizarMascota =(id) => `${slugGlobal}/${id}`

export {
  listarMascota,
  guardarMascota,
  actualizarMascota,
}
