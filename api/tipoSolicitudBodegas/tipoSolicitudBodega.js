const slugGlobal = '/tipo-solicitud-bodegas'

const listarTiposSolicitudBodegas = (page = 0,filas=5,tipo =0) => `${slugGlobal}/listar?page=${page}&filas=${filas}&tipo=${tipo}`

export {
  listarTiposSolicitudBodegas
}
