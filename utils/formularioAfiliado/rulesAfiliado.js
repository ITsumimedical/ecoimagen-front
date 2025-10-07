export default function (formulario, $axios, verificarConyuge, $swal) {
    return {
        requerido: value => !!value || "Este campo es obligatorio",

        celular: v => /^[0-9]{10}$/.test(v) || 'Debe tener exactamente 10 dígitos numéricos',

        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Debe ser un correo válido',

        reglasNombres: value => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(value) || "Solo se permiten letras y apóstrofes",

        validarNumeroDocumento: value => {
            if (!value) return "Este campo es obligatorio";
            const tipo = formulario.tipo_documento || 0;
            const longitud = value.length;

            const reglas = {
                3: {
                    min: 10,
                    max: 11,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe tener entre 10 y 11 dígitos numéricos"
                },
                2: {
                    min: 10,
                    max: 11,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe tener entre 10 y 11 dígitos numéricos"
                },
                1: {
                    min: 3,
                    max: 11,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe tener entre 3 y 11 dígitos numéricos"
                },
                5: {
                    min: 3,
                    max: 7,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe tener entre 3 y 7 dígitos numéricos"
                },
                11: {
                    min: 9,
                    max: 16,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe tener entre 9 y 16 dígitos numéricos"
                },
                7: {
                    min: 3,
                    max: 16,
                    regex: /^[a-zA-Z0-9]+$/,
                    mensaje: "Debe tener entre 3 y 16 caracteres alfanuméricos"
                },
                12: {
                    min: 14,
                    max: 14,
                    regex: /^[0-9]+$/,
                    mensaje: "Debe contener exactamente 14 números"
                }
            };

            if (reglas[tipo]) {
                const {
                    min,
                    max,
                    regex,
                    mensaje
                } = reglas[tipo];
                if (longitud < min || longitud > max || !regex.test(value)) {
                    return mensaje;
                }
                return true;
            }

            return /^[0-9]+$/.test(value) ? true : "Solo se permiten números";
        },

        validarFechaNacimiento: v => {
            if (!v) return "Este campo es requerido";
            const fecha = new Date(v);
            const hoy = new Date();
            const fechaMinima = new Date("1900-01-01");

            if (fecha < fechaMinima) return "La fecha no puede ser menor a 1900";
            if (fecha > hoy) return "La fecha no puede ser superior a hoy";
            return true;
        },

        validarParentesco: async value => {
            if (formulario.tipo_afiliado_id === 1 && formulario.numero_documento_cotizante && value) {
                try {
                    await $axios.post('/afiliados/validar-parentesco', {
                        parentesco: value,
                        numero_documento_cotizante: formulario.numero_documento_cotizante
                    });
                } catch (error) {
                    return error.response ?.data ?.mensaje || 'Parentesco inválido';
                }
            }
            return true;
        },

        requeridoNieto: value => {
            if (formulario.parentesco === 'Nieto menor o igual a 60 días' || formulario.parentesco === 'Nieto') {
                return !!value || "Este campo es obligatorio para nietos";
            }
            return true;
        },

        requeridoSiEsCotizante: v => {
            if (formulario.tipo_afiliado_id === 2 && !v) return "Este campo es obligatorio para cotizantes docentes";
            return true;
        },

        requeridoSiEsBeneficiario: v => {
            if (formulario.tipo_afiliado_id === 1 && !v) return "Este campo es obligatorio para beneficiarios";
            return true;
        },

        requeridoSiEsFemenino: v => {
            if (formulario.sexo === 'F' && !v) return "Este campo es obligatorio para afiliados con sexo Femenino";
            return true;
        },

        requeridoSiPositivaGestante: v => {
            if (formulario.gestante === 'Si' && (!v || v === '')) return "Este campo es obligatorio para afiliados gestantes";
            return true;
        },

        requeridoSiEsDiscapacitado: v => {
            if (formulario.discapacidad && formulario.discapacidad !== 'Sin discapacidad' && !v) {
                return "Este campo es obligatorio para afiliados con discapacidad";
            }
            return true;
        },

        requeridoSiAfiliacionJudicial: v => {
            if (formulario.orden_judicial === 'Si' && (!v || v === '')) return "Este campo es obligatorio para afiliaciones judiciales";
            return true;
        },

        requeridoEsAfiliadoJudicial: v => {
            if (formulario.esAfiliadoJudicial == true && (!v || v === '')) return "Este campo es obligatorio para afiliaciones judiciales";
            return true;
        },

        validarConyuge: async value => {
            if (
                value === 'Conyugue o Compañero' &&
                formulario.numero_documento_cotizante &&
                formulario.tipo_documento_cotizante
            ) {
                const response = await verificarConyuge();
                if (Array.isArray(response.conyuges) && response.conyuges.length > 0) {
                    const conyuges = response.conyuges.map(c =>
                        `<li>${c.primer_nombre ?? ''} ${c.segundo_nombre ?? ''} ${c.primer_apellido ?? ''} ${c.segundo_apellido ?? ''}</li>`
                    ).join('');

                    $swal({
                        title: "Cónyuge(s) ya registrado(s)",
                        html: `<p>El cotizante ya tiene registrado(s):</p><ul>${conyuges}</ul>`,
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                    });

                    formulario.parentesco = null;

                    return 'Este cotizante ya tiene un beneficiario con parentesco Conyugue o Compañero';
                }
            }
            return true;
        },

        adjuntoRequeridoBase: v => {
            if (formulario.tipo_afiliado_id === 1 || formulario.tipo_afiliado_id === 3 || formulario.tipo_afiliado_id === 6 &&  !v) return "Este campo es obligatorio";
            return true;
        },

        adjuntoRequeridoBenCotDepen: v => {
            if (formulario.tipo_afiliado_id === 1 || formulario.tipo_afiliado_id === 3 &&  !v) return "Este campo es obligatorio";
            return true;
        },

        adjuntoRequeridoHijoDocente: v => {
            if (
                (formulario.tipo_afiliado_id === 1 || formulario.tipo_afiliado_id === 3 || formulario.tipo_afiliado_id === 6) &&
                (formulario.parentesco === 'Hijo del Docente' || formulario.parentesco === 'Hijo Discapacitado') &&
                !v
            ) {
                return "Este campo es obligatorio para hijos de docentes";
            }
            return true;
        },

        adjuntoRequeridoPadreMadre: v => {
            if (formulario.tipo_afiliado_id === 1 || formulario.tipo_afiliado_id === 3 || formulario.tipo_afiliado_id === 6 && formulario.parentesco === 'Padre o Madre' && !v) return "Este campo es obligatorio para padres o madres de docentes";
            return true;
        },

        adjuntoRequeridoHijoDiscapacitado: v => {
            if (formulario.tipo_afiliado_id === 1 || formulario.tipo_afiliado_id === 3 || formulario.tipo_afiliado_id === 6 && formulario.parentesco === 'Hijo Discapacitado' && !v) return "Este campo es obligatorio para hijos discapacitados";
            return true;
        },
    };
}
