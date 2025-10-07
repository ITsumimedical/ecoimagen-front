const slugGlobal = '/tipo-afiliacion'

const listarTipoAfiliacion = (page) => `${slugGlobal}?page=${page}`
const crearTipoAfiliacion = () => `${slugGlobal}/crear`
const actualizarTipoAfiliacion = (id) => `${slugGlobal}/${id}`
const actualizarEstadoTipoAfiliacion = (id) => `${slugGlobal}/estado/${id}`

export{
    listarTipoAfiliacion,
    crearTipoAfiliacion,
    actualizarTipoAfiliacion,
    actualizarEstadoTipoAfiliacion
}