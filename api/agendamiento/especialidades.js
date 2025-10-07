const slugGlobal = '/especialidad'

const listarEspecialidad = (page, filas = 10) => `${slugGlobal}?page=${page}&filas=${filas}`
const crearEsepecialidad = () => `${slugGlobal}`
const actualizarEsepecialidad = (especialidad) => `${slugGlobal}/${especialidad}`

export {
    listarEspecialidad,
    crearEsepecialidad,
    actualizarEsepecialidad
}
