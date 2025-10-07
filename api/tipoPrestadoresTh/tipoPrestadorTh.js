const slugGlobal = '/tipo-prestador-th'

const listarTipoPrestadores = (page = 1) => `${slugGlobal}/listar?page=${page}`

export {
  listarTipoPrestadores,
}
