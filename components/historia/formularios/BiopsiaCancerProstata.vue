<template>
    <v-card flat>
        <v-alert text dense color="primary" class="text-center" icon="mdi-clipboard-pulse-outline"
            border="left"><b>CÁNCER DE PROSTATA</b></v-alert>
        <v-form lazy-validation ref="formBiopsia">
            <v-row dense>

                <v-col cols="12" sm="12">
                    <v-text-field label="PSA" dense outlined type="number"
                        :rules="[rules.requerido, rules.enteroPositivo]" v-model="cancer.psa"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center" border="left"><b>GLEASON</b></v-alert>
                </v-col>

                <v-col cols="12" sm="12" class="d-flex justify-center">
                    <v-radio-group v-model="cancer.lobulo" row :rules="[rules.requerido]">
                        <v-radio label="Próstata lobulo derecho" value="derecho"></v-radio>
                        <v-radio label="Próstata lobulo izquierdo" value="izquierdo"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-col cols="12" sm="12" v-if="cancer.lobulo == 'derecho'">
                    <v-select label="Próstata lobulo derecho" v-model="cancer.lobulo_derecho" :rules="[rules.requerido]"
                        dense outlined :items="opcionesGleason"></v-select>
                </v-col>

                <v-col cols="12" sm="12" v-if="cancer.lobulo == 'izquierdo'">
                    <v-select label="Próstata lobulo izquierdo" v-model="cancer.lobulo_izquierdo"
                        :rules="[rules.requerido]" dense outlined :items="opcionesGleason"></v-select>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center" border="left"><b>REPORTE DE
                            IHQ</b></v-alert>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de ingreso ihq" :rules="[rules.requerido]"
                        v-model="cancer.fecha_ingreso_ihq" dense outlined type="date"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de salida ihq" v-model="cancer.fecha_salida_ihq"
                        :rules="[rules.requerido]" dense outlined type="date"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-text-field label="Grado" :rules="[rules.requerido]" dense outlined
                        :value="descripcionClasificacionGleason" readonly></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-text-field label="Riesgo" :rules="[rules.requerido]" dense outlined :value="riesgoCalculado"
                        readonly></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="T" :rules="[rules.requerido]" dense outlined :items="opcionesT"
                        v-model="cancer.clasificacion_t"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Descripción clasifiación T" :rules="[rules.requerido]"
                        :value="descripcionClasificacionT" readonly dense outlined auto-grow></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Metástasis a distancia" :rules="[rules.requerido]" dense outlined
                        :items="opcionesM" v-model="cancer.clasificacion_m"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Descripción clasificación M" :rules="[rules.requerido]"
                        :value="descripcionClasificacionM" readonly dense outlined auto-grow></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Metástasis en ganglios linfáticos regionales" :rules="[rules.requerido]"
                        dense outlined :items="opcionesN" v-model="cancer.clasificacion_n"></v-autocomplete>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-textarea label="Descripción clasifiación N" :rules="[rules.requerido]"
                        :value="descripcionClasificacionN" readonly dense outlined auto-grow></v-textarea>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-textarea label="Estadio" :rules="[rules.requerido]" dense outlined auto-grow
                        :value="estadioCalculado" readonly></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Extensión" :rules="[rules.requerido]" dense outlined auto-grow
                        :value="extensionCalculadaPorEstadio" readonly></v-textarea>
                </v-col>

            </v-row>

        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="guardarBiopsiaCancer()" :loading="loading"
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
        cancerProp: {
            type: Object,
            default: () => ({})
        },
        historia: {
            type: Boolean,
            default: true
        },
            botonVisible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cancer: {
                psa: null,
                clasificacion_t: null,
                clasificacion_m: null,
                clasificacion_n: null,
                lobulo: null,
                lobulo_derecho: null,
                lobulo_izquierdo: null,
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null
            },
            loading: false,
            opcionesGleason: [
                {
                    text: '2-6',
                    descripcion: 'Grado 1 - Solo glandulas individuales, discretas y bien formadas'
                },
                {
                    text: '3+4=7',
                    descripcion: 'Grado 2 - Predominantemente glándulas bien formadascon un menor componente de glándulas cribiformes, fusinadas o pobremente formadas'
                },
                {
                    text: '4+3=7',
                    descripcion: 'Grado 3 - Predominantemente glándulascribiformes, fusionadas y mal formadas con un menor componente de glándulas bien formadas'
                },
                {
                    text: '4+4=8',
                    descripcion: 'Grado 4 - Solo glándulas cribiformes, mal formadas, fusionadas.'
                },
                {
                    text: '3+5=8',
                    descripcion: 'Grado 4 - Predominantemente glándulas bien formadas y un menor componente sin glándulas o con necrosis.'
                },
                {
                    text: '5+3=8',
                    descripcion: 'Grado 4 - Predominantemente ausencia de diferenciación glandular o necrosis y un menor componente de glándulas bien formadas'
                },
                {
                    text: '9-10',
                    descripcion: 'Grado 5 - Ausencia de diferenciación glandular o necrosis con o sin glándulas cribiformes, mal formadas o fusionadas '
                },

            ],
            opcionesT: [{
                text: 'Tx',
                descripcion: 'No se puede evaluar el tumor primario'
            },
            {
                text: 'TO',
                descripcion: 'No hay evidencia de tumor primario'
            },
            {
                text: 'T1',
                descripcion: 'No palpable ni visible en pruebas de diagnóstico por imágenes como ecografía transrectal'
            },
            {
                text: 'T2',
                descripcion: 'El tumor puede palparse mediante un tacto rectal. Limitado a la próstata'
            },
            {
                text: 'T2a',
                descripcion: 'Compromete ≤ mitad del lóbulo'
            },
            {
                text: 'T2b',
                descripcion: 'Compromete > mitad de 1 lóbulo, pero no ambos lóbulos'
            },
            {
                text: 'T2c',
                descripcion: 'El tumor compromete ambos lóbulos'
            },
            {
                text: 'T3',
                descripcion: 'Extensión extraprostática'
            },
            {
                text: 'T3a',
                descripcion: 'Se extiende a través de la cápsula prostática, unilateral o bilateralmente; invasión microscópica del cuello vesical'
            },
            {
                text: 'T3b',
                descripcion: 'Invade las vesículas seminales'
            },
            {
                text: 'T4',
                descripcion: 'Está fijo o invade estructuras adyacentes diferentes de las vesículas seminales'
            },
            ],
            opcionesM: [
                {
                    text: 'M0',
                    descripcion: 'Ninguna'
                },
                {
                    text: 'M1',
                    descripcion: 'Presente'
                },
                {
                    text: 'M1a',
                    descripcion: 'Ganglios linfáticos regionales'
                },
                {
                    text: 'M1b',
                    descripcion: 'Hueso(s)'
                },
                {
                    text: 'M1c',
                    descripcion: 'Otros sitios con o sin enfermedad ósea'
                }
            ],
            opcionesN: [
                {
                    text: 'NX',
                    descripcion: 'No evaluado'
                },
                {
                    text: 'N0',
                    descripcion: 'Ninguna'
                },
                {
                    text: 'N1',
                    descripcion: 'Presente'
                },
            ],
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
                enteroPositivo: v =>
                    Number.isInteger(+v) && +v > 0
                        ? true
                        : 'Debe ser un número entero positivo'
            },
        }
    },

    computed: {
        descripcionClasificacionT() {
            const seleccion = this.opcionesT.find(op => op.text === this.cancer.clasificacion_t);
            return seleccion ? seleccion.descripcion : '';
        },

        descripcionClasificacionM() {
            const seleccion = this.opcionesM.find(op => op.text === this.cancer.clasificacion_m);
            return seleccion ? seleccion.descripcion : '';
        },

        descripcionClasificacionN() {
            const seleccion = this.opcionesN.find(op => op.text === this.cancer.clasificacion_n);
            return seleccion ? seleccion.descripcion : '';
        },
        descripcionClasificacionGleason() {
            let seleccion = null;
            if (this.cancer.lobulo === 'derecho') {
                seleccion = this.opcionesGleason.find(op => op.text === this.cancer.lobulo_derecho);
            } else if (this.cancer.lobulo === 'izquierdo') {
                seleccion = this.opcionesGleason.find(op => op.text === this.cancer.lobulo_izquierdo);
            }
            return seleccion ? seleccion.descripcion : '';
        },

        riesgoCalculado() {
            if (!this.cancer) return '';
            const psa = parseFloat(this.cancer.psa);
            let gleason = null;

            if (this.cancer.lobulo === 'derecho') {
                gleason = this.cancer.lobulo_derecho;
            } else if (this.cancer.lobulo === 'izquierdo') {
                gleason = this.cancer.lobulo_izquierdo;
            }

            if (!gleason || isNaN(psa)) return '';

            const altoGleason = ['4+4=8', '3+5=8', '5+3=8', '9-10'];
            const intermedioGleason = ['3+4=7', '4+3=7'];
            const bajoGleason = ['2-6'];

            if (psa > 20 || altoGleason.includes(gleason)) {
                return 'Alto';
            } else if ((psa >= 10 && psa <= 20) || intermedioGleason.includes(gleason)) {
                return 'Intermedio';
            } else if (psa <= 10 && bajoGleason.includes(gleason)) {
                return 'Bajo';
            }

            return '';
        },

        estadioCalculado() {
            if (!this.cancer) return '';
            const psa = parseInt(this.cancer.psa);
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;

            const nValido = ['NX', 'N0'].includes(n);
            const mValido = m === 'M0';

            // Estadio IV
            if (
                t === 'T4' ||
                n === 'N1' ||
                ['M1a', 'M1b', 'M1c'].includes(m)
            ) {
                return 'Estadio IV';
            }

            // Estadio I
            if (psa < 10 && ['Tx', 'T0', 'T1'].includes(t) && nValido && mValido) {
                return 'Estadio I';
            }

            // Estadio IIA
            if (['T2', 'T2a', 'T2b'].includes(t) && nValido && mValido) {
                return 'Estadio IIA';
            }

            // Estadio IIB
            if (t === 'T2c' && nValido && mValido) {
                return 'Estadio IIB';
            }

            // Estadio III
            if (['T3', 'T3a', 'T3b'].includes(t) && nValido && ['M0', 'M1'].includes(m)) {
                return 'Estadio III';
            }

            return '';
        },

        extensionCalculadaPorEstadio() {
            const estadio = this.estadioCalculado;

            if (['Estadio I', 'Estadio IIA', 'Estadio IIB'].includes(estadio)) {
                return 'Localizado';
            }

            if (estadio === 'Estadio III') {
                return 'Localmente avanzado';
            }

            if (estadio === 'Estadio IV') {
                return 'Metastásico';
            }

            return 'Indeterminado';
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
            return this.$refs.formBiopsia.validate();
        },
        async guardarBiopsiaCancer() {
            if (!this.$refs.formBiopsia.validate()) {
                this.$toast.error('Diligencia todos los campos requeridos por favor.');
                return;
            }

            this.loading = true;

            try {
                let afiliado = this.historia === true ? this.afiliado.afiliado_id : this.afiliado.id;
                let consulta = this.historia === true ? this.afiliado.id : null;
                let id = this.historia === true ? this.cancer.registro_biopsias_patologia_id : null;

                const data = {
                    ...this.cancer,
                    ...this.resultadoBiopsia,
                    descripcion_clasificacion_n: this.descripcionClasificacionN,
                    descripcion_clasificacion_t: this.descripcionClasificacionT,
                    descripcion_clasificacion_m: this.descripcionClasificacionM,
                    afiliado_id: afiliado,
                    grado: this.descripcionClasificacionGleason,
                    riesgo: this.riesgoCalculado,
                    estadio: this.estadioCalculado,
                    extension: this.extensionCalculadaPorEstadio,
                    cie10_id: this.resultadoBiopsia.cie10_id,
                    fecha_inicial_biopsia: this.resultadoBiopsia?.fecha_inicio,
                    fecha_final_biopsia: this.resultadoBiopsia?.fecha_final,
                    consulta_id: consulta,
                    id: id
                };

                await this.$axios.post('registrar-biopsias/registrar-biopsia-prostata', data);

                this.$toast.success('Cáncer de próstata registrado');
                if (!this.historia) {
                    this.$emit('limpiarFormulario');
                }

            } catch (error) {
                console.error(error);
                this.$toast.error('Ocurrió un error al registrar la biopsia.');
            } finally {
                this.loading = false;
            }
        }

    }
}
</script>