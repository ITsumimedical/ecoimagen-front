const slugGlobal = '/cita'

const listarCita = (page, filas = 10) => `${slugGlobal}?page=${page}&filas=${filas}`
const crearCita = () => `${slugGlobal}`
const actualizarCita = (cita) => `${slugGlobal}/${cita}`

export {
    listarCita,
    crearCita,
    actualizarCita
}
