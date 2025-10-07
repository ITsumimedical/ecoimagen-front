const slugGlobal = '/blog'

const listarBlogs = (page,filas=10) => `${slugGlobal}?page=${page}&filas=${filas}`
const guardarBlog = () => `${slugGlobal}`
const actualizarBlog = (id) => `${slugGlobal}/${id}`

export {
  listarBlogs,
  guardarBlog,
  actualizarBlog
}
