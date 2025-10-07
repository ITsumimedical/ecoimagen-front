const slugGlobal = '/tipo-documento'

const listarTipoDocumento = (page =0,filas=0) => `${slugGlobal}/listar?page=${page}&filas=${filas}`

export {
  listarTipoDocumento
}
