const slugGlobal = '/licencias-empleados'

const listarLicencias = (id) => `${slugGlobal}/${id}`
const guardarLicencia =()=> `${slugGlobal}/crear`
const actualizarLicencias =(id) => `${slugGlobal}/${id}`

export {
  listarLicencias,
  guardarLicencia,
  actualizarLicencias,
}
