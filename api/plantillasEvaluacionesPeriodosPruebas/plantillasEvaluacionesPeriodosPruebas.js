const slugGlobal = '/plantillas-evaluaciones-periodos-pruebas'

const listarPlantillas = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarPlantilla =()=> `${slugGlobal}/crear`
const actualizarPlantilla =(id) => `${slugGlobal}/${id}`

export {
  listarPlantillas,
  guardarPlantilla,
  actualizarPlantilla,
}
