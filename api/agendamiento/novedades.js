const slugGlobal = '/novedades'

const listarNovedades = (page, filas = 10) => `${slugGlobal}?page=${page}&filas=${filas}`
const crearNovedades = () => `${slugGlobal}`
const actualizarNovedad = (novedad) => `${slugGlobal}/${novedad}`

export {
  listarNovedades,
  crearNovedades,
  actualizarNovedad
}
