const slugGlobal = '/responsable'

const listarResponsable = (page) => `${slugGlobal}?page=${page}`
const guardarResponsable = () => `${slugGlobal}`
const actualizarResponsable =(id) => `${slugGlobal}/${id}`

export {
  listarResponsable,
  guardarResponsable,
  actualizarResponsable
}
