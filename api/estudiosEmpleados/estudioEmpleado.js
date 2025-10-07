const slugGlobal = '/estudio-empleado'

const listarEstudio = (id) => `${slugGlobal}/${id}`
const guardarEstudio =()=> `${slugGlobal}/crear`
const actualizarEstudio =(id) => `${slugGlobal}/${id}`

export {
  listarEstudio,
  guardarEstudio,
  actualizarEstudio,
}
