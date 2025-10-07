const slugGlobal = '/beneficios'

const listarBeneficios = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarBeneficio =()=> `${slugGlobal}/crear`
const actualizarBeneficio =(id) => `${slugGlobal}/${id}`

export {
  listarBeneficios,
  guardarBeneficio,
  actualizarBeneficio,
}
