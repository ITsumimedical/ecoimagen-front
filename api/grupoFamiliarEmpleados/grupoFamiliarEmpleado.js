const slugGlobal = '/grupo-familiar-empleado'

const listarGrupoFamiliar = (id) => `${slugGlobal}/${id}`
const guardarGrupoFamiliar =()=> `${slugGlobal}/crear`
const actualizarGrupoFamiliar =(id) => `${slugGlobal}/${id}`

export {
  listarGrupoFamiliar,
  guardarGrupoFamiliar,
  actualizarGrupoFamiliar,
}
