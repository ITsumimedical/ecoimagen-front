function descargarArchivoEnBase64(base64, nombreArchivo, extension) {
    
    // Decodificar el base64 en un Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: extension });

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;

    // Simular un clic para descargar el archivo
    link.click();
    link.remove();
    // Liberar memoria del Blob
    URL.revokeObjectURL(link.href);
}

export { descargarArchivoEnBase64 }