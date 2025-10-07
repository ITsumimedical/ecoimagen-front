const slugGlobal = '/canales-pqrsf'

const guardarCanal =()=> `${slugGlobal}/crear`
const actualizarCanal =(id) => `${slugGlobal}/${id}`

export {
  guardarCanal,
  actualizarCanal,
}
