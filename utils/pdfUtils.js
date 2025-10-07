import { PDFDocument } from "pdf-lib";

/**
 * Esta función utiliza pdf-lib para unir múltiples archivos PDF en uno solo.
 * @param Array archivos pdf para unir
 * @returns Devuelve un Uint8Array con el PDF unido
 */
export async function unirPdf(pdfs) {
    try {
        const PdfBuffers = await Promise.all(
            pdfs.map((pdf) => pdf.arrayBuffer())
        );
        const mergedPdf = await PDFDocument.create();

        for (const pdfBytes of PdfBuffers) {
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices()
            );
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        return await mergedPdf.save();
    } catch (error) {
        console.error("Error al unir PDFs:", error);
    }

}
