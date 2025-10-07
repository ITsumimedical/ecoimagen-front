const slugGlobal = '/perfil-sociodemografico'

const listarPerfil = (id) => `${slugGlobal}/${id}`
const guardarPerfil =()=> `${slugGlobal}/crear`
const actualizarPerfil =(id) => `${slugGlobal}/${id}`

export {
  listarPerfil,
  guardarPerfil,
  actualizarPerfil,
}
