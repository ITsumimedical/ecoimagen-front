const slugGlobal = '/citas'

export const listarCitas = (page,filas=10,relaciones = '') => `${slugGlobal}?page=${page}&filas=${filas}&with=${relaciones}`
export const crearCita = () => `${slugGlobal}/crear`
export const actualizarCita = (id) => `${slugGlobal}/${id}`
export const historiaClinicaCita = (page,filas=0,relaciones = '') => `${slugGlobal}/historiaClinicaCita?page=${page}&filas=${filas}&with=${relaciones}`
