const slugGlobal = '/tipos-cuentas-bancarias'

const listarTipoCuentaBancaria = () => `${slugGlobal}/listar`
const guardarTipoCuentaBancaria =()=> `${slugGlobal}/crear`
const actualizarTipoCuentaBancaria =(id) => `${slugGlobal}/${id}`

export {
  listarTipoCuentaBancaria,
  guardarTipoCuentaBancaria,
  actualizarTipoCuentaBancaria,
}
