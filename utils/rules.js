export const obligatorioRule = [value => !!value || 'El campo es obligatorio'];
export const correoRule = [v => /.+@.+/.test(v) || 'E-mail debe ser válido'];
export const numeroRule = [(v) => !isNaN(v) || "Este campo debe ser un número"];
export const minCaracteresRule = [(v) => (v && v.length >= 5) || "Este campo debe tener al menos 5 caracteres."];
export const textoRule = [v => typeof v === 'string' || 'El campo debe ser una cadena de texto'];
export const booleanoRule = [v => typeof v === 'boolean' || 'El campo debe ser un valor booleano (true o false)'];
export const maxSizeAdjuntosRule = file => {
    if (!file) return true;
    const maxSize = 50 * 1024 * 1024;
    return file.size <= maxSize || 'El archivo no debe superar los 50 MB.';
};
export const minAdjuntos = adjuntos => {
    if (!Array.isArray(adjuntos) || adjuntos.length === 0) {
        return 'Debe adjuntar al menos un archivo.';
    }
    return true;
};

