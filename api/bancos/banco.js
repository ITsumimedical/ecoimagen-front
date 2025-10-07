const slugGlobal = '/bancos'

const listarBancos = () => `${slugGlobal}/listar`
const guardarBanco =()=> `${slugGlobal}/crear`
const actualizarBanco =(id) => `${slugGlobal}/${id}`

export {
  listarBancos,
  guardarBanco,
  actualizarBanco,
}
