const slugGlobal = '/campo-historia'

const listarCampoHistoria = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarCampoHistoria =()=> `${slugGlobal}/crear`
const actualizarCampoHistoria =(id) => `${slugGlobal}/${id}`

export {
  listarCampoHistoria,
  guardarCampoHistoria,
  actualizarCampoHistoria,
}
