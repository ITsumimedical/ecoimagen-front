const slugGlobal = '/municipios'

const listarMunicipios = (page = 10) => `${slugGlobal}/listar?page=${page}`

export {
  listarMunicipios,
}
