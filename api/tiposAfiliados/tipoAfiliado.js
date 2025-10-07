const slugGlobal = '/tipo-afiliados'

const listarTipoAfiliado = (page) => `${slugGlobal}/listar?page=${page}`
const crearTipoAfiliado = () => `${slugGlobal}/crear`
const actualizarTipoAfiliado = (id) => `${slugGlobal}/${id}`
const actualizarEstadoTipoAfiliado = (id) => `${slugGlobal}/estado/${id}`

export{
    listarTipoAfiliado,
    crearTipoAfiliado,
    actualizarTipoAfiliado,
    actualizarEstadoTipoAfiliado
}