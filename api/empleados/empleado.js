const slugGlobal = '/empleados'

const listarEmpleados = (page = 1) => `${slugGlobal}/listar?page=${page}`
const guardarEmpleados =()=> `${slugGlobal}/crear`
const actualizarEmpleados =(id) => `${slugGlobal}/${id}`
const buscarEmpleado = (documento) => `${slugGlobal}/${documento}`
const exportarEmpleado = () => `${slugGlobal}/exportar`

export {
  listarEmpleados,
  guardarEmpleados,
  actualizarEmpleados,
  buscarEmpleado,
  exportarEmpleado,
}
