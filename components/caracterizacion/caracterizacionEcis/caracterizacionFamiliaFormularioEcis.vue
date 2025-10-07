<template>
    <v-form ref="form" class="my-2">
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        2.1 ESTRUCTURA Y CONTEXTO FAMILIAR
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-select dense outlined label="Tipo de Familia *" :items="tipo_familia.opciones"
                    v-model="caracterizacion.tipo_familia" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-text-field dense outlined type="number" min="0" label="N° de Personas que Conforman la Familia *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.numero_personas_familia" />
            </v-col>
            <v-col cols="12" sm="12" md="4">
                <v-select dense outlined label="Seleccione el Tipo de Riesgo Identificado *"
                    :items="tipo_riesgo.opciones" v-model="caracterizacion.tipo_riesgo" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea auto-grow dense outlined label="Observaciones *"
                    :rules="[rules.obligatorio, rules.minCaracteres]"
                    v-model="caracterizacion.observaciones_estructura_contexto_familiar" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Funcionalidad de la Familia (APGAR Familiar) *"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.funcionalidad_familia"
                    :items="funcionalidad_familia.opciones" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined
                    label="En la Familia se identifica un Cuidador de niñós, niñas, persona con discapacidad, adulto mayor o enfermedad? *"
                    :items="opcionesSiNo" :rules="[rules.obligatorio]" v-model="caracterizacion.cuidador_principal" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined :disabled="!caracterizacion.cuidador_principal"
                    label="Si la respuesta anterior fue SI aplicar escala ZARIT y registre aquí el resultado puntaje para determinar si se requiere intervencion individual o familiar"
                    :rules="[validarEscalaZarit]" :items="escala_zarit.opciones"
                    v-model="caracterizacion.escala_zarit" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Interrelaciones de la familia con el contexto socio cultural (Diligenciar ECOMAPA) *"
                    :items="interrelaciones_familia_sociocultural.opciones" :rules="[rules.obligatorio]"
                    v-model="caracterizacion.interrelaciones_familia_sociocultural" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        2.2 SITUACIONES O CONDICIONES DE ESPECIAL PROTECCIÓN DE LA FAMILIA Y SUS INTEGRANTES
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Familias con niñas, niños y adolescentes *" :rules="[rules.obligatorio]"
                    :items="opcionesSiNo" v-model="caracterizacion.familia_ninos_adolescentes" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Gestante en la Familia *" :rules="[rules.obligatorio]"
                    :items="opcionesSiNo" v-model="caracterizacion.gestante_familia" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Familia con Adultos Mayores *" :rules="[rules.obligatorio]"
                    :items="opcionesSiNo" v-model="caracterizacion.familia_adultos_mayores" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Familia Víctima del Conflicto Armado *" :rules="[rules.obligatorio]"
                    :items="opcionesSiNo" v-model="caracterizacion.familia_victima_conflicto_armado" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined label="Familia que convive con Persona con Discapacidad *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_convive_discapacidad" />
            </v-col>
            <v-col cols="12" sm="12" md="6">
                <v-select dense outlined
                    label="Familia que convive con Personas que presenta alguna Enfermedad Crónica, Huérfana o en Estado Terminal *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_convive_enfermedad_cronica" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Familia que convive con Persona que presenta alguna Enfermedad Transmisible *"
                    :rules="[rules.obligatorio]" :items="enfermedadTransmisible.opciones"
                    v-model="caracterizacion.familia_convive_enfermedad_transmisible" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Familia con vivencia de Sucesos Vitales normativos y no normativos (Eventos significativos que inciden de manera positiva o negativa en la persona y familia por ejemplo: Ingreso de niños estudiar, Muerte Familiar, Accidente que genera discapacidad, Separación pareja, entre otros) *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_vivencia_sucesos_vitales" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Familia en situación de Vulnerabilidad Social (Consumo de SPA - Alcohol, Explotación Sexual, Trabajo Infantil, Conflictos Interpersonales, Violencia Intrafamiliar, Trastorno Mental, entre otras) *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_sitacion_vulnerabilidad_social" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Familia con prácticas de Cuidado de Salud Críticas de varios de sus Integrantes que ponen en riesgo o han afectado en la Salud (Hábitos alimentarios, Aituaciones de abandono) *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_practicas_cuidado_salud" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Familia con antecedentes de Ca, HTA, Diabetes, Asma, Enfermedad Cardíaca, otra *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_antecedentes_enfermedades" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="Si la respuesta es SI indique cuales"
                    :disabled="!caracterizacion.familia_antecedentes_enfermedades"
                    v-model="caracterizacion.familia_antecedentes_enfermedades_descripcion"
                    :rules="[validarDescripcionAntecedentes]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined :disabled="!caracterizacion.familia_antecedentes_enfermedades"
                    label="Recibe tratamiento *" :items="opcionesSiNo"
                    v-model="caracterizacion.familia_antecedentes_enfermedades_tratamiento"
                    :rules="[validarTratamientoAntecedentes]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cómo obtiene sus alimentos? *" :items="obtencionAlimento.opciones"
                    :rules="[rules.obligatorio]" v-model="caracterizacion.obtencion_alimentos" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?"
                    :disabled="caracterizacion.obtencion_alimentos !== 'Otra'"
                    v-model="caracterizacion.obtencion_alimentos_descripcion"
                    :rules="[validarDescripcionObtencionAlimento]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        2.3 PRÁCTICAS O CONDICIONES PROTECTORAS PARA EL CUIDADO DE LA SALUD PREDOMINANTES EN LA FAMILIA
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Hábitos de vida saludable adaptado a las condiciones contextuales y culturales de la familia y sus integrantes *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.habitos_vida_saludable" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Recursos socioemocionales que potencian el cuidado de la salud en la familia *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.recursos_socioemocionales" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Prácticas para el cuidado y protección de los entornos *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.practicas_cuidado_proteccion" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Prácticas que favorecen el establecimiento de relaciones sanas y constructivas *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.practicas_establecimiento_relaciones" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Recursos sociales y comunitarios para el establecimiento de redes colectivas para la promoción de la salud *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.recursos_sociales_comunitarios" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Prácticas para la conservación de la autonomía y la capacidad funcional de las personas mayores *"
                    :items="opcionesSiNo" v-model="caracterizacion.practicas_autonomia_capacidad_funcional"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Prácticas para la prevención de enfermedades en todas las edades *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.practicas_prevencion_enfermedades" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Prácticas para el cuidado desde los saberes ancestrales/tradicionales (Aplica para poblaciones y comunidades indígenas, negras afrocolombianas y palenqueras y rom) *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.practicas_cuidado_saberes_ancestrales" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Capacidades de las familias para el ejercicio y exigibilidad del derecho a la salud *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.capacidades_ejercicio_derecho_salud" />
            </v-col>
        </v-row>
    </v-form>
</template>
<script>
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
    data() {
        return {
            tipo_familia: {
                opciones: [
                    'Nuclear Biparental', 'Nuclear Monoparental', 'Extenso Biparental', 'Extenso Monoparental', 'Compuesto Biparental', 'Compuesto Monoparental', 'Unipersonal']
            },
            tipo_riesgo: {
                opciones: [
                    'Riesgo Biológico', 'Riesgo Psicológico', 'Riesgo Social']
            },
            funcionalidad_familia: {
                opciones: [
                    '0 a 3 Puntos - Disfunción Familiar',
                    '4 a 6 Puntos - Funcionalidad Moderada',
                    '4 o 6 Puntos - Funcionalidad Normal'
                ]
            },
            opcionesSiNo: [
                { text: 'SI', value: true },
                { text: 'NO', value: false }
            ],
            escala_zarit: {
                opciones: [
                    { text: 'No aplica', value: null },
                    { text: 'Ausencia de Sobrecarga (<= 46)', value: 'Ausencia de Sobrecarga (<= 46)' },
                    { text: 'Sobrecarga Ligera (47 - 55)', value: 'Sobrecarga Ligera (47 - 55)' },
                    { text: 'Sobrecarga Intensa (>56)', value: 'Sobrecarga Intensa (>56)' },
                ]
            },
            interrelaciones_familia_sociocultural: {
                opciones: ['Positivo', 'Tenue', 'Estresante', 'Energía Fluye', 'Intenso',],
            },
            enfermedadTransmisible: {
                opciones: [
                    'TB', 'Lepra', 'Escabiosos, Enfermedades Infecciosas de la Piel u Otras', 'Malaria', 'Dengue', 'Chagas', 'Hepatitis A', 'Alguna Enfermedad Inmunoprevenible (Varicela, Parotidis, Otra)', 'Otras', 'Ninguna'
                ],
            },
            obtencionAlimento: {
                opciones: [
                    'Cultiva', 'Cría de animales', 'Cacería', 'Recolección de alimentos', 'Trueque o Intercambio', 'Compra', 'Asistencia del Estado', 'Ayuda humanitaria', 'Otra'
                ]
            }
        }
    },
    computed: {
        validarEscalaZarit() {
            return v => {
                if (!this.caracterizacion.cuidador_principal) return true;
                return v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio';
            };
        },
        validarDescripcionAntecedentes() {
            return v => {
                if (!this.caracterizacion.familia_antecedentes_enfermedades) return true;
                if (!v || v.length < 10) return 'Debe tener al menos 10 caracteres';
                return true;
            };
        },
        validarTratamientoAntecedentes() {
            return v => {
                if (!this.caracterizacion.familia_antecedentes_enfermedades) return true;
                return v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio';
            };
        },
        validarDescripcionObtencionAlimento() {
            return v => {
                if (this.caracterizacion.obtencion_alimentos !== 'Otra') return true;
                if (!v || v.length < 10) return 'Debe tener al menos 10 caracteres';
                return true;
            };
        }
    },
    watch: {
        'caracterizacion.cuidador_principal'(nuevoValor) {
            if (!nuevoValor) {
                this.caracterizacion.escala_zarit = null;
            }
        },
        'caracterizacion.familia_antecedentes_enfermedades'(nuevoValor) {
            if (!nuevoValor) {
                this.caracterizacion.familia_antecedentes_enfermedades_descripcion = '';
                this.caracterizacion.familia_antecedentes_enfermedades_tratamiento = null;
            }
        },
        'caracterizacion.obtencion_alimentos'(nuevo) {
            if (nuevo !== 'Otra') {
                this.caracterizacion.obtencion_alimentos_descripcion = '';
            }
        }
    }
}
</script>