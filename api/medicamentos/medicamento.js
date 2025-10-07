const slugGlobal = '/medicamentos'

const listarVademecum = (page,filas= 10,bodega = 0) => `${slugGlobal}/listarVademecum?page=${page}&filas=${filas}&bodega=${bodega}`
const listarMedicamentosBodega = (page,filas= 10,bodega = 0) => `${slugGlobal}/listarVademecum?page=${page}&filas=${filas}&bodega=${bodega}`

const listarLotesMedicamento = (medicamento,lote) => `${slugGlobal}/listarLotesMedicamento/${medicamento}/${lote}`

export {
  listarVademecum,
  listarLotesMedicamento,
  listarMedicamentosBodega
}

