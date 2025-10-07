export function limpiarNombreArchivo(nombreArchivo) {
	return nombreArchivo
		.replace(/[^a-zA-Z0-9-_\.]/g, '') // Remueve caracteres especiales
		.replace(/\s+/g, '_') // Reemplaza espacios por guiones bajos
		.toLowerCase(); // Convierte a minúsculas
}
