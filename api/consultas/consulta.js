const slugGlobal = '/consultas'


export const listarCitas = (page,filas=10) => `${slugGlobal}?page=${page}&filas=${filas}`
export const asignarCita = () => `${slugGlobal}/crear`
export const actualizarCita = (id) => `${slugGlobal}/${id}`
