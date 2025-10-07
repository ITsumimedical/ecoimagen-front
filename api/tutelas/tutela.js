const slugGlobal = '/tutela'

const listarTutela = (page) => `${slugGlobal}?page=${page}`
const guardarTutela = () => `${slugGlobal}`
const actualizarTutela =(id) => `${slugGlobal}/${id}`

export {
  listarTutela,
  guardarTutela,
  actualizarTutela
}
