const slugGlobal = '/juzgado'

const listarjuzgado = (page) => `${slugGlobal}?page=${page}`
const guardarjuzgado = () => `${slugGlobal}`
const actualizarjuzgado =(id) => `${slugGlobal}/${id}`

export {
  listarjuzgado,
  guardarjuzgado,
  actualizarjuzgado
}
