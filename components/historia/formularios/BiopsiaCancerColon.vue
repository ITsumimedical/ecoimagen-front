<template>
    <v-card flat>
        <v-alert text dense color="primary" border="left" icon="mdi-flask-empty-plus"><b>CANCER COLON</b></v-alert>

        <v-form lazy-validation ref="formColon">
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-select label="Ubicación leson" dense outlined :items="opcionesLeson"
                        v-model="cancer.ubicacion_leson" :rules="[rules.requerido]">
                    </v-select>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-select label="Laboratorio que procesa" dense outlined :items="laboratorios"
                        v-model="cancer.laboratorio_procesa" :rules="[rules.requerido]">
                    </v-select>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field label="Nombre patologo" dense outlined v-model="cancer.nombre_patologo"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center"><b>REPORTE DE IHQ</b></v-alert>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de ingreso" :rules="[rules.requerido]" dense outlined
                        v-model="cancer.fecha_ingreso_ihq" type="date"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de salida" :rules="[rules.requerido]" dense outlined
                        v-model="cancer.fecha_salida_ihq" type="date"></v-text-field>
                </v-col>

                <v-col col="12" sm="12">
                    <v-autocomplete label="Tipos de cáncer de colon" :rules="[rules.requerido]" dense outlined
                        v-model="cancer.tipo_cancer_colon" :items="opcionesCancer"></v-autocomplete>
                </v-col>

                <v-col col="12" sm="12" v-if="cancer.tipo_cancer_colon === 'Adenocarcinoma'">
                    <v-autocomplete label="Subtipos de adenocarcinoma" :rules="[rules.requerido]" dense outlined
                        v-model="cancer.subtipo_adenocarcinoma" :items="opcionesAdenocarcinoma"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion T" dense outlined v-model="cancer.clasificacion_t"
                        :items="clasificacionesT" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-alert v-if="descripcionClasificacionT" type="info" dense text outlined border="left"
                        color="primary">
                        {{ descripcionClasificacionT }}
                    </v-alert>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion N" dense outlined v-model="cancer.clasificacion_n"
                        :items="clasificacionesN" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-alert v-if="descripcionClasificacionN" type="info" dense text outlined border="left"
                        color="primary">
                        {{ descripcionClasificacionN }}
                    </v-alert>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion M" dense outlined v-model="cancer.clasificacion_m"
                        :items="clasificacionesM" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-alert v-if="descripcionClasificacionM" type="info" dense text outlined border="left"
                        color="primary">
                        {{ descripcionClasificacionM }}
                    </v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Estadio" :value="estadioFinal" readonly :rules="[rules.requerido]" dense
                        outlined></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-text-field label="Cambio de estadio" dense outlined
                        v-model="cancer.cambio_estadio"></v-text-field>
                </v-col>
            </v-row>
        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="guardarBiopsiaColon()" :loading="loading"
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
                ubicacion_leson: null,
                laboratorio_procesa: null,
                nombre_patologo: null,
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null,
                tipo_cancer_colon: null,
                subtipo_adenocarcinoma: null,
                clasificacion_n: null,
                clasificacion_t: null,
                clasificacion_m: null,
                cambio_estadio: null
            },
            loading: false,
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
            },
            opcionesLeson: [
                'Derecha',
                'Izquierda',
                'Ambas'
            ],
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
            opcionesCancer: [
                'Adenocarcinoma', 'Tumor Carcinoide', 'Linfoma Primario Colorectal', 'Tumor del Estroma Gastrointestinal (GIST)', 'Leiomiosarcoma del Colon', 'Cáncer Colorectal Metastasico'
            ],
            opcionesAdenocarcinoma: [
                'Adenocarcinoma Mucinoso', 'Adenocarcinoma en Anillo de Sello'
            ],
            clasificacionesT: [
                { text: 'TX', descripcion: 'tumor primario no evaluable' },
                { text: 'T0', descripcion: 'sin indicios de tumor primario.' },
                { text: 'Tis', descripcion: 'carcinoma in situ, carcinoma intramucoso (compromiso de la lámina propia sin diseminación a la capa muscular de la mucosa).' },
                { text: 'T1', descripcion: 'tumor con invasión de la submucosa (a través de la capa muscular de la mucosa, pero no dentro de la capa muscular propia).' },
                { text: 'T2', descripcion: 'tumor con invasión de la capa muscular propia.' },
                { text: 'T3', descripcion: 'tumor con invasión de los tejidos pericolorrectales a través de la capa muscular propia.' },
                { text: 'T4', descripcion: 'tumor con invasión del peritoneo visceral, o con invasión y adherencia a un órgano o estructura adyacente.' },
                { text: 'T4a', descripcion: 'tumor con invasión del peritoneo visceral (incluso perforación macroscópica del intestino e invasión tumoral continua de áreas inflamatorias en la superficie del peritoneo visceral).' },
                { text: 'T4b', descripcion: 'tumor con invasión directa o adherencia a órganos o estructuras adyacentes.' }
            ],
            clasificacionesN: [
                { text: 'NX', descripcion: 'ganglios linfáticos regionales no evaluables.' },
                { text: 'N0', descripcion: 'sin metástasis en ganglios linfáticos regionales.' },
                { text: 'N1', descripcion: 'compromiso de 1 a 3 ganglios linfáticos regionales (tumor en los ganglios linfáticos regionales que mide ≥0,2 mm), o cualquier cantidad de depósitos tumorales y todos los ganglios linfáticos identificables están libres de compromiso tumoral.' },
                { text: 'N1a', descripcion: 'compromiso de un ganglio linfático regional.' },
                { text: 'N1c', descripcion: 'sin compromiso de ganglios linfáticos regionales, pero con depósitos tumorales en la subserosa, el mesenterio, los tejidos pericólicos no peritonealizados o en los tejidos perirrectales o mesorrectales.' },
                { text: 'N2', descripcion: 'compromiso de 4 o más ganglios linfáticos regionales.' },
                { text: 'N2a', descripcion: 'compromiso de 4 a 6 ganglios linfáticos regionales.' },
                { text: 'N2b', descripcion: 'compromiso de 7 o más ganglios linfáticos regionales.' },
            ],
            clasificacionesM: [
                { text: 'M0', descripcion: 'sin indicios de metástasis a distancia en las pruebas con imágenes, etc.; sin indicios de tumor en sitios u órganos distantes. (Esta categoría no la asigna un patólogo).' },
                { text: 'M1a', descripcion: 'se identifica metástasis en un sitio u órgano sin metástasis peritoneal.' },
                { text: 'M1b', descripcion: 'metástasis en 2 o más sitios u órganos sin metástasis peritoneal.' },
                { text: 'M1c', descripcion: 'se identifica metástasis en la superficie peritoneal, sola o acompañada de metástasis en otros sitios u órganos.' },
            ],
        }
    },

    computed: {
        descripcionClasificacionT() {
            const item = this.clasificacionesT.find(i => i.text === this.cancer.clasificacion_t);
            return item ? item.descripcion : '';
        },

        descripcionClasificacionN() {
            const item = this.clasificacionesN.find(i => i.text === this.cancer.clasificacion_n);
            return item ? item.descripcion : '';
        },

        descripcionClasificacionM() {
            const item = this.clasificacionesM.find(i => i.text === this.cancer.clasificacion_m);
            return item ? item.descripcion : '';
        },

        estadioFinal() {
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;

            if (!t || !n || !m) return '';

            if (t === 'Tis' && n === 'N0' && m === 'M0') {
                return 'Estadio 0';
            }

            if ((t === 'T1' || t === 'T2') && n === 'N0' && m === 'M0') {
                return 'Estadio I';
            }

            if (t === 'T3' && n === 'N0' && m === 'M0') {
                return 'Estadio IIA';
            }

            if (t === 'T4a' && n === 'N0' && m === 'M0') {
                return 'Estadio IIB';
            }

            if (t === 'T4b' && n === 'N0' && m === 'M0') {
                return 'Estadio IIC';
            }

            if (t === 'T1' && n === 'N2a' && m === 'M0') {
                return 'Estadio IIA';
            }

            // Estadio IIIB
            if ((t === 'T1' || t === 'T2') && n === 'N2b' && m === 'M0') {
                return 'Estadio IIIB';
            }

            if ((t === 'T2' || t === 'T3') && n === 'N2a' && m === 'M0') {
                return 'Estadio IIIB';
            }

            if ((t === 'T3' || t === 'T4a') && (n === 'N1' || n === 'N1c') && m === 'M0') {
                return 'Estadio IIIB';
            }

            // Estadio IIIC
            if ((t === 'T3' || t === 'T4a') && n === 'N2b' && m === 'M0') {
                return 'Estadio IIIC';
            }

            if (t === 'T4a' && n === 'N2a' && m === 'M0') {
                return 'Estadio IIIC';
            }

            if (t === 'T4b' && (n === 'N1' || n === 'N1c' || n === 'N2' || n === 'N2a' || n === 'N2b') && m === 'M0') {
                return 'Estadio IIIC';
            }

            // Estadio IVA
            if (m === 'M1a') {
                return 'Estadio IVA';
            }

            // Estadio IVB
            if (m === 'M1b') {
                return 'Estadio IVB';
            }

            // Estadio IVC
            if (m === 'M1c') {
                return 'Estadio IVC';
            }

            return 'Estadio no clasificado';
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
            return this.$refs.formColon.validate();
        },
        guardarBiopsiaColon() {
            if (!this.$refs.formColon.validate()) return;

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
                estadio: this.estadioFinal
            };
            this.$axios.post('registrar-biopsias/registrar-biopsia-colon', data).then(() => {
                this.$toast.success('Registrado con éxito');
                if (!this.historia) {
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