<template>
    <v-form ref="form" class="my-2">
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <integrantes-familia-caracterizacion-ecis :caracterizacion="caracterizacion" :rules="rules" />
            </v-col>

            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        3.2 SITUACIONES O CONDICIONES DE SALUD
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Cumple con el esquema de atenciones de promoción y mantenimiento para el momento de curso de vida o para la gestación *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.cumple_esquema_atenciones" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-autocomplete multiple dense outlined small-chips chips deletable-chips
                    label="Intervenciones pendientes de promoción y mantenimiento de la salud *"
                    :items="intervenciones_pendientes.opciones" v-model="caracterizacion.intervenciones_pendientes"
                    :rules="[rules.alMenosUnElemento]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-autocomplete dense outlined
                    label="Motivo por el cual no ha recibido las atenciones de promoción y mantenimiento de la salud *"
                    :items="motivos_no_atencion.opciones" v-model="caracterizacion.motivos_no_atencion"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Realiza alguna práctica deportiva o realiza ejercicio? *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo" v-model="caracterizacion.practica_deportiva" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Si es menor de 6 meses, ¿Recibe lactancia materna exclusiva? *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo" v-model="caracterizacion.recibe_lactancia" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-text-field dense outlined type="number" min="0"
                    label="Si es menor de 2 años, ¿Hasta cuándo recibió lactancia materna? (en meses) *"
                    v-model="caracterizacion.recibe_lactancia_meses" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Es menor de 5 años?" :items="opcionesSiNo"
                    v-model="caracterizacion.es_menor_cinco_anios" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-text-field dense outlined label="Medidas Antropométricas - Peso (Kg) *" type="number" min="0.1"
                    v-model="caracterizacion.medidas_antropometricas_peso" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-text-field dense outlined label="Medidas Antropométricas - Talla (Cm) *" type="number" min="0.1"
                    v-model="caracterizacion.medidas_antropometricas_talla" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Diagnóstico nutricional indicador Peso para la talla *"
                    :items="diagnostico_nutricional.opciones" v-model="caracterizacion.diagnostico_nutricional"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined
                    label="Medida complementaria identificación de riesgo de muerte por desnutrición aguda *"
                    v-model="caracterizacion.medida_complementaria_riesgo_desnutricion"
                    :rules="[validarMedidaDesnutricion]"
                    :disabled="!['Riesgo de Desnutrición Aguda', 'Desnutrición Aguda Moderada', 'Desnutrición Aguda Severa'].includes(caracterizacion.diagnostico_nutricional)" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Se identifican signos físicos de desnutrición aguda *"
                    :disabled="!['Riesgo de Desnutrición Aguda', 'Desnutrición Aguda Moderada', 'Desnutrición Aguda Severa'].includes(caracterizacion.diagnostico_nutricional)"
                    :items="signos_fisicos_desnutricion.opciones" v-model="caracterizacion.signos_fisicos_desnutricion"
                    :rules="[validarSignosFisicosDesnutricion]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Actualmente presenta o ha presentado en el último mes alguna enfermedad como: ¿Diarrea o soltura de estómago, Tos, Resfriado, Gripa Bronquitis o Pulmonía? Problemas de piel/alergias, accidente casero, familiar o escolar. Alguna otra enfermedad *"
                    :items="opcionesSiNo" v-model="caracterizacion.enfermedades_alergias"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuáles?"
                    v-model="caracterizacion.enfermedades_alergias_cuales" :rules="[validarEnfermedadesAlergiasCuales]"
                    :disabled="!caracterizacion.enfermedades_alergias" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Está recibiendo atención y tratamiento para la enfermedad actual?"
                    :items="opcionesSiNo" v-model="caracterizacion.tratamiento_enfermedad_actual"
                    :rules="[validarAtencionEnfermedadActual]" :disabled="!caracterizacion.enfermedades_alergias" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-autocomplete dense outlined
                    label="Si la respuesta a la pregunta anterior es NO. Seleccione el motivo por el cual no ha recibido atención."
                    :items="motivos_no_atencion_enfermedad.opciones"
                    v-model="caracterizacion.motivo_no_atencion_enfermedad" :rules="[validarMotivoNoAtencion]"
                    :disabled="caracterizacion.tratamiento_enfermedad_actual !== false" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined :rules="[rules.obligatorio]"
                    v-model="caracterizacion.pertenece_poblacion_etnica" :items="opcionesSiNo"
                    label="Si pertenece a población étnica. ¿Actualmente es acompañado u orientado por algun agente de la medicina tradicional?" />
            </v-col>
        </v-row>
    </v-form>
</template>
<script>
import IntegrantesFamiliaCaracterizacionEcis from '~/components/caracterizacion/caracterizacionEcis/integrantesFamiliaCaracterizacionEcis.vue'

export default {
    props: {
        caracterizacion: {
            type: Object,
            default: null
        },
        rules: {
            type: Object,
            default: null
        }
    },
    components: {
        IntegrantesFamiliaCaracterizacionEcis
    },
    data() {
        return {
            opcionesSiNo: [
                { text: 'SI', value: true },
                { text: 'NO', value: false }
            ],
            intervenciones_pendientes: {
                opciones: [
                    'Valoración Integral para la PYMS',
                    'Valoración Integral por profesional en odontologia para la PYMS',
                    'Promoción y apoyo a lactancia materna',
                    'Aplicación de flúor',
                    'Profilaxis y remoción de placa bacteriana',
                    'Vacunación de acuerdo con el esquema',
                    'Fortificación casera con micronutrientes en polvo',
                    'Suplementación con micronutrientes',
                    'Desparasitación intestinal antihelminitica',
                    'Tamizaje para anemia - Hemoglobina y hematocrito',
                    'Planificación familiar y anticoncepción',
                    'Tamizaje de riesgo cardiovascular',
                    'Tamizaje para ITS',
                    'Tamizaje para cáncer de cuello uterino',
                    'Tamizaje para cáncer de mama',
                    'Tamizaje para cáncer de próstata',
                    'Tamizaje para cáncer de colon y recto',
                    'Atención para el cuidado preconcepcional',
                    'Atención para el cuidado prenatal - Controles prenatales',
                    'Curso de preparación para la maternidad y paternidad',
                    'Interrupción Voluntaria del Embarazo',
                    'Atención del puerperio',
                    'Atención para el seguimiento del recién nacido',
                    'Preparación para la maternidad y paternidad',
                    'Educación para la salud',
                    'Ninguna',
                ]
            },
            motivos_no_atencion: {
                opciones: [
                    'Lugar de atención lejano, cerrado o ausencia del profesional de la salud',
                    'Horarios de atención restringidos',
                    'Largos tiempos de espera',
                    'No había disponibilidad de la tecnología',
                    'Desconocimiento del derecho a las intervenciones de DTPE',
                    'Desconocimiento que las intervenciones son gratuitas',
                    'Persona enferma',
                    'Persona hospitalizada',
                    'Orden médica por enfermedad',
                    'Falta de tiempo del cuidador',
                    'Rechazo de la atención por tradición o cultura',
                    'No afiliado',
                ]
            },
            diagnostico_nutricional: {
                opciones: [
                    'Obsesidad', 'Sobrepeso', 'Riesgo Sobrepeso', 'Peso adecuado para la Talla', 'Riesgo de Desnutrición Aguda', 'Desnutrición Aguda Moderada', 'Desnutrición Aguda Severa'
                ]
            },
            signos_fisicos_desnutricion: {
                opciones: [
                    'Cabeza', 'Cara', 'Piel', 'Tórax y abdomen', 'Extremidades', 'Comportamiento'
                ]
            },
            motivos_no_atencion_enfermedad: {
                opciones: [
                    'Lugar de atención lejano, cerrado o ausencia del profesional de la salud',
                    'Horarios de atención restringidos',
                    'Largos tiempos de espera',
                    'No había disponibilidad de la tecnología',
                    'Falta de tiempo del cuidador',
                    'Tratamiento de remedios caseros',
                    'Rechazo de la atención por tradición o cultura',
                    'No afiliado',
                ]
            }
        }
    },
    computed: {
        validarMedidaDesnutricion() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.diagnostico_nutricional,
                opcionesValidas: [
                    'Riesgo de Desnutrición Aguda',
                    'Desnutrición Aguda Moderada',
                    'Desnutrición Aguda Severa'
                ],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Este campo es obligatorio y debe tener al menos 5 caracteres.'
            });
        },

        validarSignosFisicosDesnutricion() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.diagnostico_nutricional,
                opcionesValidas: [
                    'Riesgo de Desnutrición Aguda',
                    'Desnutrición Aguda Moderada',
                    'Desnutrición Aguda Severa'
                ],
                reglaBase: v => v !== null && v !== undefined && v !== '',
                mensaje: 'Este campo es obligatorio.'
            });
        },

        validarEnfermedadesAlergiasCuales() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.enfermedades_alergias,
                opcionesValidas: [true],
                reglaBase: v => !!v && v.length >= 10,
                mensaje: 'Debe especificar al menos 10 caracteres si respondió que sí.'
            });
        },

        validarAtencionEnfermedadActual() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.enfermedades_alergias,
                opcionesValidas: [true],
                reglaBase: v => v !== null && v !== undefined,
                mensaje: 'Debe seleccionar una opción si hay enfermedades actuales.'
            });
        },

        validarMotivoNoAtencion() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.tratamiento_enfermedad_actual,
                opcionesValidas: [false],
                reglaBase: v => !!v && v.length >= 3,
                mensaje: 'Debe seleccionar un motivo si no está recibiendo atención.'
            });
        }
    },
    watch: {
        'caracterizacion.diagnostico_nutricional'(nuevoValor) {
            const desnutricionOpciones = [
                'Riesgo de Desnutrición Aguda',
                'Desnutrición Aguda Moderada',
                'Desnutrición Aguda Severa'
            ];

            if (!desnutricionOpciones.includes(nuevoValor)) {
                this.caracterizacion.medida_complementaria_riesgo_desnutricion = '';
                this.caracterizacion.signos_fisicos_desnutricion = null;
            }
        },
        'caracterizacion.enfermedades_alergias'(valor) {
            if (!valor) {
                this.caracterizacion.enfermedades_alergias_cuales = '';
                this.caracterizacion.tratamiento_enfermedad_actual = null;
            }
        },
        'caracterizacion.tratamiento_enfermedad_actual'(valor) {
            if (valor !== false) {
                this.caracterizacion.motivo_no_atencion_enfermedad = null;
            }
        }
    },
    methods: {
        campoCondicional({ valorControlador, opcionesValidas, reglaBase, mensaje }) {
            return v => {
                if (!opcionesValidas.includes(valorControlador)) return true;
                if (typeof reglaBase === 'function') {
                    return reglaBase(v) || mensaje;
                }
                return v !== null && v !== undefined && v !== '' || mensaje;
            };
        }
    }

}
</script>