const slugGlobal = '/contrato-empleado'

const listarContrato = (id) => `${slugGlobal}/${id}`
const guardarContrato =()=> `${slugGlobal}/crear`
const actualizarContrato =(id) => `${slugGlobal}/${id}`
const terminarContrato =(id) => `${slugGlobal}/terminar/${id}`

export {
  listarContrato,
  guardarContrato,
  actualizarContrato,
  terminarContrato,
}
