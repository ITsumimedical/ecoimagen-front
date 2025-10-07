const slugGlobal = '/afiliados'

const listarAfiliados = (page) => `${slugGlobal}/listar?page=${page}`
const guardarAfiliado = () => `${slugGlobal}/crear`
const buscarAfiliado = (cedula, tipoDocumento) => `${slugGlobal}/${cedula}/${tipoDocumento}`;
const listarAfiliadoActivo = (cedula, tipoDocumento) => `${slugGlobal}/listarActivos/${cedula}/${tipoDocumento}`
const buscarBeneficiarios = (cedula) => `${slugGlobal}/beneficiario/${cedula}`
const marcarAfiliado = (id) => `${slugGlobal}/crearMarcacion/${id}`
const actualizacionMasiva = () => `${slugGlobal}/actualizacionMasiva`

export {
  listarAfiliados,
  guardarAfiliado,
  buscarAfiliado,
  listarAfiliadoActivo,
  buscarBeneficiarios,
  marcarAfiliado,
  actualizacionMasiva
}
