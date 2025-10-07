const slugGlobal = '/incapacidad-empleado'

const listarIncapacidades = (id) => `${slugGlobal}/${id}`
const guardarIncapacidad =()=> `${slugGlobal}/crear`
const actualizarIncapacidad =(id) => `${slugGlobal}/${id}`

export {
  listarIncapacidades,
  guardarIncapacidad,
  actualizarIncapacidad,
}
