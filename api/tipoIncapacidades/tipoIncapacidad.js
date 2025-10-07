const slugGlobal = '/tipo-incapacidad'

const listarTiposIncapacidades = (page = 1) => `${slugGlobal}/listar?page=${page}`

export {
  listarTiposIncapacidades,
}
