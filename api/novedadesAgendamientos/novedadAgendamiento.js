const slugGlobal = '/novedad-agendamiento'

export const listarNovedad = (page,filas=10) => `${slugGlobal}/listar?page=${page}&filas=${filas}`
export const crearNovedad = () => `${slugGlobal}/crear`
export const actualizar = (id) => `${slugGlobal}/${id}`
