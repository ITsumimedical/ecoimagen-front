import * as XLSX from "xlsx";

function leerExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * genera un excel apartir de una matriz de una dimenscion es decir de la forma [[], [] , ...]
 * crearExcel()
 */
function crearExcel(matriz, nombreArchivo = "datos.xlsx") {
    // Crear una hoja de cálculo a partir del array de arrays
    const worksheet = XLSX.utils.aoa_to_sheet(matriz);

    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Generar el archivo Excel y forzar la descarga
    XLSX.writeFile(workbook, nombreArchivo);
}

/**
 * Convierte un JSON a una matriz de valores
 * @param {Array} jsonData - Datos en formato JSON
 * @returns {Array} matriz - Matriz de valores
 * @author Thomas
 */
function convertirJsonAMatriz(data) {

    if (!Array.isArray(data)) {
        return [];
    }
    // Obtener las cabeceras del JSON (primera fila) y convertirlas en un array de valores
    const cabeceras = Object.keys(data[0] || {});
    // Crear una matriz con las cabeceras y los valores del JSON
    return [cabeceras, ...data.map((item) => Object.values(item))];
}


function crearCSV(matriz, nombreArchivo = "datos.csv") {
	const csvContent = matriz.map(row => row.map(value => `"${value}"`).join(",")).join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", nombreArchivo);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function crearTXT(matriz, nombreArchivo = "datos.txt") {
	const txtContent = matriz.map(row => row.join("|")).join("\n");

	const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });

	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", nombreArchivo);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * 
 * @param {Array} matriz 
 * @param {String} tituloFila 
 * @returns {Object} filas_unicas, filas_duplicadas
 */
function eliminarDuplicados(matriz, tituloFila){

    if(!matriz || matriz.length < 2) { 
        console.log("No hay suficientes datos para procesar") 
        return false}

    if(!tituloFila) {
        console.error("El título de la fila debe ser una cadena de texto válida")
    }
    
    const encabezados = matriz[0].map(texto => texto.trim().toLowerCase())

    const filas = matriz.slice(1)

    const indiceDeseado = encabezados.indexOf(tituloFila)

    if (indiceDeseado === -1){
        console.error(`No se encontró la columna "${tituloFila}" en los encabezados.`)
        return false
    }

    const valoresUnicos = new Set()
    const filasUnicas = []
    const filasDuplicadas = []

    for( const fila of filas){
        const valor = fila[indiceDeseado]

        if(valoresUnicos.has(valor)){
            filasDuplicadas.push(fila)
        }else{
            valoresUnicos.add(valor)
            filasUnicas.push(fila)
        }
    }
    const resultadoFilasUnicas = [encabezados, ...filasUnicas]

        return {
            filas_unicas: resultadoFilasUnicas,
            filas_duplicadas: filasDuplicadas
        }
    }



export { leerExcel, crearExcel, convertirJsonAMatriz, crearCSV, crearTXT, eliminarDuplicados };
