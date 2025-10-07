<template>
    <v-card flat>
        <v-alert text dense color="primary" border="left" icon="mdi-stomach"><b>CANCER GASTRICO</b></v-alert>

        <v-form lazy-validation ref="formGastrico">
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

                <v-col cols="12" sm="12">
                    <v-select label="Tipo de cancer gastrico" dense outlined :items="TiposCancer"
                        v-model="cancer.tipo_cancer_gastrico" :rules="[rules.requerido]">
                    </v-select>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion T" dense outlined v-model="cancer.clasificacion_t"
                        :items="clasificacionesT" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" v-if="descripcionClasificacionT">
                    <v-alert type="info" dense text outlined border="left" color="primary">
                        {{ descripcionClasificacionT }}
                    </v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion N" dense outlined v-model="cancer.clasificacion_n"
                        :items="clasificacionesN" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" v-if="descripcionClasificacionN">
                    <v-alert type="info" dense text outlined border="left" color="primary">
                        {{ descripcionClasificacionN }}
                    </v-alert>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-autocomplete label="Clasificacion M" :rules="[rules.requerido]" dense outlined
                        v-model="cancer.clasificacion_m" :items="clasificacionesM"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" v-if="descripcionClasificacionM">
                    <v-alert type="info" dense text outlined border="left" color="primary">
                        {{ descripcionClasificacionM }}
                    </v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Estadio" readonly :value="estadioCalculado" dense outlined
                        auto-grow></v-textarea>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field label="HER-2" dense outlined v-model="cancer.her_2"></v-text-field>
                </v-col>


                <v-col cols="12" sm="4">
                    <v-text-field label="PD-L1" dense outlined v-model="cancer.pd_l1"></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field label="INESTABILIDAD MICROSATELITAL" dense outlined
                        v-model="cancer.inestabilidad_microsatelital"></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field label="Gen NTRK (tirosina cinasa neurotrófica)" dense outlined
                        v-model="cancer.gen_ntrk"></v-text-field>
                </v-col>
            </v-row>
        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="guardarBiopsiaGastrico()" :loading="loading"
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
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
            },
            TiposCancer: [
                'Adenocarcinoma',
                'Tumores del Estroma Gastrointesinal (GIST)',
                'Tumores Carcinoides',
                'Linfomas '
            ],
            cancer: {
                laboratorio_procesa: null,
                ubicacion_leson: null,
                nombre_patologo: null,
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null,
                tipo_cancer_gastrico: null,
                clasificacion_t: null,
                clasificacion_m: null,
                clasificacion_n: null,
                pd_l1: null,
                inestabilidad_microsatelital: null,
                gen_ntrk: null,
                her_2: null
            },
            clasificacionesT: [
                { text: 'TX', descripcion: 'Tumor primario no evaluable.' },
                { text: 'T0', descripcion: 'Sin indicios de tumor primario.' },
                { text: 'Tis', descripcion: 'Carcinoma in situ: tumor intraepitelial sin invasión de la lámina propia, displasia de grado alto.' },
                { text: 'T1', descripcion: 'Tumor con invasión de la lámina propia, la capa muscular de la mucosa o la submucosa.' },
                { text: 'T1a', descripcion: 'Tumor con invasión de la lámina propia o la capa muscular de la mucosa.' },
                { text: 'T1b', descripcion: 'Tumor con invasión de la submucosa.' },
                { text: 'T2', descripcion: 'Tumor con invasión de la capa muscular propia.' },
                { text: 'T3', descripcion: 'Tumor con penetración del tejido conjuntivo subseroso sin invasión del peritoneo visceral o las estructuras adyacentes.' },
                { text: 'T4', descripcion: 'Tumor con invasión de la serosa (peritoneo visceral) o estructuras adyacentes.' },
                { text: 'T4a', descripcion: 'Tumor con invasión de la serosa (peritoneo visceral).' },
                { text: 'T4b', descripcion: 'Tumor con invasión de las estructuras u órganos adyacentes.' },
            ],
            clasificacionesN: [
                { text: 'NX', descripcion: 'Ganglios linfáticos regionales no evaluables.' },
                { text: 'N0', descripcion: 'Sin metástasis en ganglios linfáticos regionales.' },
                { text: 'N1', descripcion: 'Metástasis en 1 o 2 ganglios linfáticos regionales.' },
                { text: 'N2', descripcion: 'Metástasis en 3 a 6 ganglios linfáticos regionales.' },
                { text: 'N3', descripcion: 'Metástasis en ≥7 ganglios linfáticos regionales.' },
                { text: 'N3a', descripcion: 'Metástasis en 7 a 15 ganglios linfáticos regionales.' },
                { text: 'N3b', descripcion: 'Metástasis en 16 o más ganglios linfáticos regionales.' },
            ],
            clasificacionesM: [
                { text: 'M0', descripcion: 'Sin metástasis a distancia.' },
                { text: 'M1', descripcion: 'Metástasis a distancia.' },
            ],
            loading: false
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

        estadioCalculado() {
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;

            if (!t || !n || !m) return '';

            // Estadio 0
            if (t === 'Tis' && n === 'N0' && m === 'M0') return 'Estadio 0';

            // Estadio IA
            if (t === 'T1' && n === 'N0' && m === 'M0') return 'Estadio IA';

            // Estadio IB
            if (
                (t === 'T1' && n === 'N1' && m === 'M0') ||
                (t === 'T2' && n === 'N0' && m === 'M0')
            ) return 'Estadio IB';

            // Estadio IIA
            if (
                (t === 'T1' && n === 'N2' && m === 'M0') ||
                (t === 'T2' && n === 'N1' && m === 'M0') ||
                (t === 'T3' && n === 'N0' && m === 'M0')
            ) return 'Estadio IIA';

            // Estadio IIB
            if (
                (t === 'T1' && n === 'N3a' && m === 'M0') ||
                (t === 'T2' && n === 'N2' && m === 'M0') ||
                (t === 'T3' && n === 'N1' && m === 'M0') ||
                (t === 'T4a' && n === 'N0' && m === 'M0')
            ) return 'Estadio IIB';

            // Estadio IIIA
            if (
                (t === 'T2' && n === 'N3a' && m === 'M0') ||
                (t === 'T3' && n === 'N2' && m === 'M0') ||
                (t === 'T4a' && n === 'N1' && m === 'M0') ||
                (t === 'T4a' && n === 'N2' && m === 'M0') ||
                (t === 'T4b' && n === 'N0' && m === 'M0')
            ) return 'Estadio IIIA';

            // Estadio IIIB
            if (
                (t === 'T1' && n === 'N3b' && m === 'M0') ||
                (t === 'T2' && n === 'N3b' && m === 'M0') ||
                (t === 'T3' && n === 'N3a' && m === 'M0') ||
                (t === 'T4a' && n === 'N3a' && m === 'M0') ||
                (t === 'T4b' && n === 'N1' && m === 'M0') ||
                (t === 'T4b' && n === 'N2' && m === 'M0')
            ) return 'Estadio IIIB';

            // Estadio IIIC
            if (
                (t === 'T3' && n === 'N3b' && m === 'M0') ||
                (t === 'T4a' && n === 'N3b' && m === 'M0') ||
                (t === 'T4b' && n === 'N3a' && m === 'M0') ||
                (t === 'T4b' && n === 'N3b' && m === 'M0')
            ) return 'Estadio IIIC';

            // Estadio IV - cualquier T, cualquier N, M1
            if (m === 'M1') return 'Estadio IV';

            // Por defecto
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
            return this.$refs.formGastrico.validate();
        },
        guardarBiopsiaGastrico() {
            if (!this.$refs.formGastrico.validate()) {
                return this.$toast.error('Campos requeridos sin diligenciar')
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
                estadio: this.estadioCalculado
            };

            this.$axios.post('registrar-biopsias/registrar-biopsia-gastrico', data).then(() => {
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