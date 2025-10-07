const slugGlobal = '/categoria-historia'

const listarCategoriaHistoria = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarCategoriaHistoria =()=> `${slugGlobal}/crear`
const actualizarCategoriaHistoria =(id) => `${slugGlobal}/${id}`

export {
  listarCategoriaHistoria,
  guardarCategoriaHistoria,
  actualizarCategoriaHistoria,
}
