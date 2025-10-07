const slugGlobal = '/clasificacion'

const listarClasificacionAfiliado = (page,estado)=> `${slugGlobal}?page=${page}&estado=${estado}`
const crearClasificacionAfiliado = ()=>`${slugGlobal}/crear`
const actualizarClasificacionAfiliado = (id)=>`${slugGlobal}/${id}`
const actualizarEstadoClasificacionAfiliado = (id)=>`${slugGlobal}/estado/${id}`

export {
    listarClasificacionAfiliado,
    crearClasificacionAfiliado,
    actualizarClasificacionAfiliado,
    actualizarEstadoClasificacionAfiliado
}