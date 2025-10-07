const slugGlobal = '/reps'

const listarReps = (page = 0,filas=5,propias = false,relacion=0) => `${slugGlobal}/listar?page=${page}&filas=${filas}&propias=${propias}&relacion=${relacion}`


export {
  listarReps,
}
