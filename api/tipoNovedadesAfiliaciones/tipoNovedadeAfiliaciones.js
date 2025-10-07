const slugGlobal = '/tipo-novedad-afiliado'

const listarNovedadesAfiliado = (page)=> `${slugGlobal}?page=${page}`
const guardarNovedadesAfiliado = ()=>`${slugGlobal}/crear`
const actualizarNovedadesAfiliado = (id)=>`${slugGlobal}/${id}`
const actualizarEstadoNovedadesAfiliado = (id)=>`${slugGlobal}/estado/${id}`

export {
    listarNovedadesAfiliado,
    guardarNovedadesAfiliado,
    actualizarNovedadesAfiliado,
    actualizarEstadoNovedadesAfiliado
}