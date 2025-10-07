<template>

    <v-card flat>
        <v-alert text dense color="primary" border="left" icon="mdi-lungs"><b>CANCER PULMÓN</b></v-alert>

        <v-form lazy-validation ref="formPulmon">
            <v-row dense>
                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center"><b>REPORTE DE IHQ</b></v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="laboratorio que procesa" :rules="[rules.requerido]" dense outlined
                        :items="laboratorios" v-model="cancer.laboratorio_procesa"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de ingreso" :rules="[rules.requerido]" dense outlined type="date"
                        v-model="cancer.fecha_ingreso_ihq"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de salida" :rules="[rules.requerido]" dense outlined type="date"
                        v-model="cancer.fecha_salida_ihq"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Tipo de cancer de pulmón" :rules="[rules.requerido]" dense outlined
                        :items="tiposCancer" v-model="cancer.tipo_cancer_pulmon"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12"
                    v-if="cancer.tipo_cancer_pulmon === 'Carcinoma de Pulon de Celulas no Pequeñas'">
                    <v-autocomplete label="Subtipo histologico" dense outlined v-model="cancer.subtipo_histologico"
                        :items="opcionesSubtipos"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12"
                    v-if="cancer.tipo_cancer_pulmon === 'Carcinoma de Pulon de Celulas no Pequeñas'">
                    <v-textarea label="Nota subtipo histologico" dense outlined auto-grow
                        v-model="cancer.nota_subtipo_histologico"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificación T" :rules="[rules.requerido]" dense outlined :items="opcionesT"
                        v-model="cancer.clasificacion_t"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert v-if="descripcionClasificacionT" type="info" dense text outlined border="left"
                        color="primary">
                        <pre style="white-space: pre-wrap;">{{ descripcionClasificacionT }}</pre>
                    </v-alert>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificación N" :rules="[rules.requerido]" dense outlined :items="opcionesN"
                        v-model="cancer.clasificacion_n"></v-autocomplete>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-alert v-if="descripcionClasificacionN" type="info" dense text outlined border="left"
                        color="primary">
                        <pre style="white-space: pre-wrap;">{{ descripcionClasificacionN }}</pre>
                    </v-alert>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificación M" :rules="[rules.requerido]" dense outlined :items="opcionesM"
                        v-model="cancer.clasificacion_m"></v-autocomplete>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-alert v-if="descripcionClasificacionM" type="info" dense text outlined border="left"
                        color="primary">
                        <pre style="white-space: pre-wrap;">{{ descripcionClasificacionM }}</pre>
                    </v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-text-field label="Estadio inicial" dense outlined :value="estadioInicial"
                        readonly></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-textarea label="Panel molecular" dense outlined auto-grow
                        v-model="cancer.panel_molecular"></v-textarea>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-textarea label="EGFR" dense outlined auto-grow v-model="cancer.egfr"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-textarea label="ALK" dense outlined auto-grow v-model="cancer.alk"></v-textarea>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-textarea label="ROS-1" dense outlined auto-grow v-model="cancer.ros_1"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="PD-L1" dense outlined auto-grow v-model="cancer.pd_l1"></v-textarea>
                </v-col>
            </v-row>
        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="guardarBiopsiaPulmon()" :loading="loading"
                :disabled="loading">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        resultadoBiopsia: {
            type: Object,
            default: () => ({})
        },
        afiliado: {
            type: Object,
            default: null
        },
        historia: {
            type: Boolean,
            default: true
        },
        cancerProp: {
            type: Object,
            default: () => ({})
        },
        botonVisible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cancer: {
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null,
                tipo_cancer_pulmon: null,
                laboratorio_procesa: null,
                nota_subtipo_histologico: null,
                clasificacion_t: null,
                clasificacion_n: null,
                clasificacion_m: null,
                panel_molecular: null,
                egfr: null,
                alk: null,
                ros_1: null,
                pd_l1: null
            },
            tiposCancer: [
                'Carcinoma de Pulon de Celulas no Pequeñas',
                'Cancer Pulmonar de Celulas Pequeñas '
            ],
            opcionesSubtipos: [
                'Adenocarcinoma',
                'carcinoma de células grandes',
                'carcinoma de células escamosas'
            ],
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
            },
            opcionesT: ['Tx', 'T0', 'Tis', 'T1', 'T1a', 'T1b', 'T1c', 'T2', 'T2a', 'T2b', 'T3', 'T4 '],
            descripcionTMap: {
                Tx: `Tumor Primario\n- No evaluable\n- Positivo para células malignas pero NO evidenciado en pruebas de imágenes`,
                T0: 'Sin evidencia de Tumor Primario',
                Tis: 'Carcinoma in situ',
                T1: 'Tumor limitado a un órgano o sitio',
                T1a: 'Tamaño o extensión mínima del tumor',
                T1b: 'Tumor con mayor invasión pero aún limitado',
                T1c: 'Tumor visible o palpable clínicamente',
                T2: 'Tumor con invasión local moderada',
                T2a: 'Afecta parcialmente tejidos locales',
                T2b: 'Mayor extensión pero sin invadir estructuras distantes',
                T3: 'Invasión de estructuras adyacentes',
                T4: 'Invasión extensa o estructuras críticas afectadas'
            },
            opcionesN: ['Nx', 'N0', 'N1', 'N2', 'N3'],
            descripcionNMap: {
                Nx: 'No se puede evaluar la afectación ganglionar',
                N0: 'No existe afectación ganglionar',
                N1: 'Mts en ganglios peribronquiales / hiliares ipsilaterales',
                N2: 'Mts en ganglios mediastínicos ipsilaterales y/o subcarinales',
                N3: `Mts en ganglios: - Mediastínicos / hiliares contralaterales - Supraclaviculares / escalenos (ipsi o contralaterales)`
            },
            opcionesM: ['M1', 'M0', 'M1a', 'M1b', 'M1c'],
            descripcionMMap: {
                M0: 'No existe metástasis a distancia',
                M1: 'Presencia de metástasis a distancia',
                M1a: `Nódulos en lóbulo contralateral al tumor primario
                   Nódulos pleurales / pericárdicos
                   Derrame pleural / pericárdico malignos`,
                M1b: 'Metástasis única extratorácica',
                M1c: 'Metástasis múltiples extratorácicas'
            },
            laboratorios: [
                'Lapaci',
                'Symlab',
                'Colcan',
                'IPS Hospital Alma Mater',
                'Hernan Ocazionez',
                'Citopec',
                'Fundación Hospital San Vicente de Paúl',
                'Hospital Pablo Tobón Uribe',
                'IPS Universidad de Antioquia',
            ],
            loading: false
        }
    },

    computed: {
        estadioInicial() {
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;

            if (!t || !n || !m) return '';

            // Estadio IVB (más prioritario que IVA)
            if (m === 'M1c') {
                return 'ESTADIO - IVB';
            }

            // Estadio IVA
            if (['M1a', 'M1b'].includes(m)) {
                return 'ESTADIO - IVA';
            }

            // Estadio IIIC: T3 - T4, N3, M0
            const tIIIC = ['T3', 'T3a', 'T3b', 'T4'];
            if (tIIIC.includes(t) && n === 'N3' && m === 'M0') {
                return 'ESTADIO - IIIC';
            }

            // Estadio IIIB: T1a - T4, N2 - N3, M0
            const tIII = ['T1a', 'T1b', 'T1c', 'T2a', 'T2b', 'T3a', 'T3b', 'T3', 'T4'];
            const nIIIB = ['N2', 'N3'];
            if (tIII.includes(t) && nIIIB.includes(n) && m === 'M0') {
                return 'ESTADIO - IIIB';
            }

            // Estadio IIIA: T1a - T4, N0 - N2, M0
            const nIIIA = ['N0', 'N1', 'N2'];
            if (tIII.includes(t) && nIIIA.includes(n) && m === 'M0') {
                return 'ESTADIO - IIIA';
            }

            // Estadio IIB: T1a - T3, N0 - N1, M0
            const tIIB = ['T1a', 'T1b', 'T1c', 'T2a', 'T2b', 'T3a', 'T3b', 'T3'];
            const nIIB = ['N0', 'N1'];
            if (tIIB.includes(t) && nIIB.includes(n) && m === 'M0') {
                return 'ESTADIO - IIB';
            }

            // Estadio IIA
            if (t === 'T2b' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - IIA';
            }

            // Estadio IB
            if (t === 'T2a' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - IB';
            }

            // Estadio IA3
            if (t === 'T1c' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - IA3';
            }

            // Estadio IA2
            if (t === 'T1b' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - IA2';
            }

            // Estadio IA1
            if (t === 'T1a' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - IA1';
            }

            // Carcinoma Oculto
            if (t === 'Tx' && n === 'N0' && m === 'M0') {
                return 'ESTADIO - Carcinoma Oculto';
            }

            return '';
        },

        descripcionClasificacionT() {
            return this.descripcionTMap[this.cancer.clasificacion_t] || '';
        },

        descripcionClasificacionN() {
            return this.descripcionNMap[this.cancer.clasificacion_n] || '';
        },

        descripcionClasificacionM() {
            return this.descripcionMMap[this.cancer.clasificacion_m] || '';
        }
    },

    watch: {
        cancerProp: {
            handler(nuevo) {
                if (nuevo) {
                    this.cancer = JSON.parse(JSON.stringify(nuevo));
                }
            },
            immediate: true,
            deep: true
        }
    },

    methods: {
        validarErrores() {
            return this.$refs.formPulmon.validate();
        },
        guardarBiopsiaPulmon() {
            if (!this.$refs.formPulmon.validate()) {
                return this.$toast.error('Campos obligatorios sin diligenciar')
            }

            this.loading = true;
            let afiliado = this.historia === true ? this.afiliado.afiliado_id : this.afiliado.id;
            let consulta = this.historia === true ? this.afiliado.id : null;
            let id = this.historia === true ? this.cancer.registro_biopsias_patologia_id : null;
            const data = {
                ...this.cancer,
                ...this.resultadoBiopsia,
                afiliado_id: afiliado,
                cie10_id: this.resultadoBiopsia.cie10_id,
                fecha_inicial_biopsia: this.resultadoBiopsia?.fecha_inicio,
                fecha_final_biopsia: this.resultadoBiopsia?.fecha_final,
                consulta_id: consulta,
                id: id,
                estadio_inicial: this.estadioInicial
            };
            this.$axios.post('registrar-biopsias/registrar-biopsia-pulmon', data).then(() => {
                this.$toast.success('Registrado con éxito');
                if (this.historia) {
                    this.$emit('limpiarFormulario');
                }
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loading = false;
            })
        }

    }

}
</script>