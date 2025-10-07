const slugGlobal = '/portabilidad-entrada'

const listarPortabilidadEntrada = (page,filas=10) => `${slugGlobal}?page=${page}&filas=${filas}`
const guardarPortabilidadEntrada = () => `${slugGlobal}/crear`

export {
    listarPortabilidadEntrada,
    guardarPortabilidadEntrada,
}
