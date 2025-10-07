const slugGlobal = '/tipo_cita'

const listarTipoCita = (page, filas = 10) => `${slugGlobal}?page=${page}&filas=${filas}`
const crearTipoCita = () => `${slugGlobal}`
const actualizarTipoCita = (tipoCita) => `${slugGlobal}/${tipoCita}`

export {
    listarTipoCita,
    crearTipoCita,
    actualizarTipoCita
}
