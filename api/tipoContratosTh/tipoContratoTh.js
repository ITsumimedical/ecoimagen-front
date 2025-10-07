const slugGlobal = '/tipo-contratos-ths'

const listarTiposContratos = (page = 1) => `${slugGlobal}/listar?page=${page}`

export {
  listarTiposContratos,
}
