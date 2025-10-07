const slugGlobal = '/criterios-evaluaciones-periodos-pruebas'

const listarCriterios = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarCriterio =()=> `${slugGlobal}/crear`
const actualizarCriterio =(id) => `${slugGlobal}/${id}`

export {
  listarCriterios,
  guardarCriterio,
  actualizarCriterio,
}
