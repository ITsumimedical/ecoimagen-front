export async function validarExistenciaPorNombreFecha($axios, form, $toast) {
    if (!form || typeof form !== 'object') return;
    if (!form.fecha_nacimiento) return;

    try {
        const response = await $axios.get(`afiliados/verificar-existencia-nombre-fecha`, {
            params: {
                primer_nombre: form.primer_nombre,
                segundo_nombre: form.segundo_nombre || "",
                primer_apellido: form.primer_apellido,
                segundo_apellido: form.segundo_apellido || "",
                fecha_nacimiento: form.fecha_nacimiento
            }
        });

        if (response.data.res && response.data.Afiliado) {
            $toast.error("Ya existe un afiliado con el mismo nombre y fecha de nacimiento.");
            form.fecha_nacimiento = null;
        }
    } catch (error) {
        $toast.error(error ?.response ?.data ?.mensaje || null);
    }
}

export async function validarExistenciaAfiliado($axios, form, $toast, rules) {
    if (!form.numero_documento || !form.tipo_documento) {
        return;
    }

    try {
        const response = await $axios.get(
            `afiliados/verificarExistencia/${form.numero_documento}/${form.tipo_documento}`
        );

        if (response.data.res) {
            const afiliado = response.data.afiliado;

            const mismoNombre = (
                afiliado.primer_nombre === form.primer_nombre &&
                afiliado.segundo_nombre === form.segundo_nombre &&
                afiliado.primer_apellido === form.primer_apellido &&
                afiliado.segundo_apellido === form.segundo_apellido
            );

            const mismaFechaNacimiento = afiliado.fecha_nacimiento === form.fecha_nacimiento;

            if (mismoNombre && mismaFechaNacimiento) {
                $toast.info("Ya existe un usuario con el mismo nombre y fecha de nacimiento en el sistema.");
            } else {
                $toast.info("Ya existe un usuario con el mismo tipo y número de documento en el sistema.");
            }

            rules.validarNumeroDocumento = v => !!v || "El número de documento ya está registrado.";
            form.numero_documento = "";
        }
    } catch (error) {
        console.error("Error verificando existencia del afiliado:", error);
        $toast.error("Hubo un error verificando el documento. Inténtelo de nuevo.");
    }
}


export function validarTipoDocumento(form) {
    if (!form || typeof form !== 'object') return;

    if (!form.errores) form.errores = {};

    if (!form.tipo_documento) {
        form.errores.tipo_documento = "El tipo de documento es obligatorio";
    } else {
        form.errores.tipo_documento = "";
    }

    const edad = form.edad_cumplida;
    const tipoDocumento = form.tipo_documento;
    const tipoAfiliado = form.tipo_afiliado_id;

    const esExtranjero = [5, 7, 9, 10, 11].includes(tipoDocumento);

    let documentoValido = false;

    switch (tipoDocumento) {
        case 12: // Certificado de Nacido Vivo
            documentoValido = tipoAfiliado === 1 && edad <= 0.25;
            break;
        case 3: // Registro Civil
            documentoValido = tipoAfiliado === 1 && edad <= 8;
            break;
        case 2: // Tarjeta de Identidad
            documentoValido = (tipoAfiliado === 1 || tipoAfiliado === 6) && edad >= 7 && edad <= 18;
            break;
        case 1: // Cédula de Ciudadanía (solo colombianos)
            documentoValido = (tipoAfiliado === 1 || tipoAfiliado === 2) && edad >= 18 && !esExtranjero;
            break;
        case 5: // Cédula de Extranjería (solo extranjeros)
            documentoValido = edad >= 7 && esExtranjero;
            break;
        case 9: // Permiso Especial de Permanencia
            documentoValido = tipoAfiliado === 1 && edad >= 18;
            break;
        case 13: // Menor sin Identificación
            documentoValido = tipoAfiliado === 1 && edad <= 18;
            break;
        default:
            documentoValido = true;
            break;
    }

    if (!documentoValido) {
        form.errores.tipo_documento = "El tipo de documento no es válido para la edad y el tipo de afiliado.";
    } else {
        form.errores.tipo_documento = "";
    }
}

export function calcularEdad(fecha, form, validarTipoDocumento = () => {}) {
    if (!fecha) {
        form.edad_cumplida = null;
        form.ciclo_vida_atencion = null;
        form.tipo_documento_error = "";
        return;
    }

    const fechaNacimiento = new Date(fecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edad--;
    }

    form.edad_cumplida = edad;

    form.ciclo_vida_atencion =
        edad <= 5 ? "Primera Infancia (0-5 Años)" :
        edad <= 11 ? "Infancia (6-11 Años)" :
        edad <= 18 ? "Adolescencia (12 A 17 Años)" :
        edad <= 26 ? "Joven (18 A 28 Años)" :
        edad <= 59 ? "Adulto (29 A 59 Años)" :
        "Vejez (Mayor a 60 Años)";

    validarTipoDocumento();
}

export async function verificarEstadoCotizante($axios, form, $toast) {
    if (!form.tipo_documento_cotizante || !form.numero_documento_cotizante) {
        return;
    }

    try {
        const response = await $axios.get(
            `afiliados/verificarEstado/${form.numero_documento_cotizante}/${form.tipo_documento_cotizante}`
        );

        const cotizante = response.data;

        if (!cotizante || Object.keys(cotizante).length === 0 || cotizante.error) {
            const mensaje = cotizante ?.error || "No se ha encontrado el afiliado relacionado";
            $toast.error(mensaje);
            form.cotizanteValido = false;
            form.nombre_completo = null;
        } else {
            const nombres = [
                cotizante.primer_nombre,
                cotizante.segundo_nombre,
                cotizante.primer_apellido,
                cotizante.segundo_apellido
            ].filter(Boolean).join(' ');

            $toast.success("Cotizante apto para registro de beneficiarios");
            form.cotizanteValido = true;
            form.nombre_completo = nombres;
        }

    } catch (error) {
        const mensajeError = error.response ?.data ?.mensaje || "Error al consultar el cotizante";
        $toast.error(mensajeError);
        form.cotizanteValido = false;
        form.nombre_completo = null;
    }
}
