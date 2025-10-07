<template>
    <v-card flat>
        <v-alert text dense color="primary" border="left" icon="mdi-bacteria-outline"><b>CANCER DE OVARIO</b></v-alert>

        <v-form lazy-validation ref="formOvario">
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-autocomplete label="Lateralidad 1" dense outlined :items="opcioneslateralidad"
                        v-model="cancer.lateralidad_1" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-autocomplete label="Lateralidad 2" dense outlined :items="opcioneslateralidad"
                        v-model="cancer.lateralidad_2" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-autocomplete label="Laboratorio que procesa" dense outlined :items="laboratorios"
                        v-model="cancer.laboratorio_procesa" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>
                <v-col>
                    <v-text-field label="Nombre patologo" dense outlined v-model="cancer.nombre_patologo"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center"><b>REPORTE DE IHQ</b></v-alert>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de ingreso" dense outlined type="date" v-model="cancer.fecha_ingreso_ihq"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de salida" dense outlined type="date" v-model="cancer.fecha_salida_ihq"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>

                <v-col>
                    <v-autocomplete label="Clasificación T" :items="opcionesT" dense outlined
                        v-model="cancer.clasificacion_t" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col>
                    <v-autocomplete label="Clasificación N" :items="opcionesN" dense outlined
                        v-model="cancer.clasificacion_n" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>


                <v-col>
                    <v-autocomplete label="Clasificación M" :items="opcionesM" dense outlined
                        v-model="cancer.clasificacion_m" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Estadio FIGO" dense outlined auto-grow :rules="[rules.requerido]"
                        :value="estadioFigo.estadio" readonly></v-textarea>
                </v-col>


                <v-col cols="12" sm="12">
                    <v-textarea label="Descripción estadio figo" dense outlined auto-grow :rules="[rules.requerido]"
                        :value="estadioFigo.descripcion" readonly></v-textarea>
                </v-col>
            </v-row>
        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="guardarCancerOvario()" :loading="loading"
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
            opcioneslateralidad: [
                'Derecho',
                'Izquierdo',
                'Ambos'
            ],
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
            },
            loading: false,
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
            opcionesT: ['T0', 'T1', 'T1a', 'T1b', 'T1c', 'T2', 'T2a', 'T2b', 'T3', 'T3a', 'T3b', 'T3c'],
            opcionesN: ['Nx', 'N0', 'N1'],
            opcionesM: ['M0', 'M1a', 'M1b'],
            cancer: {
                registro_biopsias_patologia_id: null,
                lateralidad_1: null,
                lateralidad_2: null,
                laboratorio_procesa: null,
                nombre_patologo: null,
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null,
                clasificacion_t: null,
                clasificacion_n: null,
                clasificacion_m: null,
                descripcion_estadio_figo: null,
                estadio_figo: null,
            }
        }
    },

    computed: {
        estadioFigo() {
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;

            if (!t || !n || !m) {
                return { estadio: '', descripcion: '' };
            }

            // Estadio IV - diseminación a distancia
            if (m === 'M1a') {
                return {
                    estadio: 'Estadio IVA',
                    descripcion: 'Diseminación a la cavidad pleural con citología positiva. (Cualquier T, cualquier N, M1a).'
                };
            }

            if (m === 'M1b') {
                return {
                    estadio: 'Estadio IVB',
                    descripcion: 'Metástasis a órganos parenquimatosos (como hígado o pulmones) o ganglios inguinales. (Cualquier T, cualquier N, M1b).'
                };
            }

            // FIGO IIIA1
            if ((t === 'T1' || t === 'T2') && n === 'N1' && m === 'M0') {
                return {
                    estadio: 'Estadio IIIA1',
                    descripcion: 'Metástasis únicamente a ganglios linfáticos retroperitoneales. (T1 o T2, N1, M0).'
                };
            }

            // FIGO IIIB
            if (t === 'T3b' && (n === 'N0' || n === 'N1') && m === 'M0') {
                return {
                    estadio: 'Estadio IIIB',
                    descripcion: 'Metástasis peritoneales macroscópicas fuera de la pelvis ≤ 2 cm. (T3b, N0 o N1, M0).'
                };
            }

            // FIGO IIIC
            if (t === 'T3c' && (n === 'N0' || n === 'N1') && m === 'M0') {
                return {
                    estadio: 'Estadio IIIC',
                    descripcion: 'Metástasis peritoneales > 2 cm, incluyendo cápsula hepática o esplénica. (T3c, N0 o N1, M0).'
                };
            }

            // FIGO II y subtipos
            if (n === 'N0' && m === 'M0') {
                switch (t) {
                    case 'T1a':
                        return {
                            estadio: 'Estadio IA',
                            descripcion: 'El cáncer está limitado a un ovario o trompa de Falopio sin tumor en la superficie, sin ruptura y sin ascitis positiva. (T1a, N0, M0).'
                        };
                    case 'T1b':
                        return {
                            estadio: 'Estadio IB',
                            descripcion: 'El cáncer está en ambos ovarios o trompas de Falopio, sin tumor en la superficie, sin ruptura y sin ascitis positiva. (T1b, N0, M0).'
                        };
                    case 'T1c':
                        return {
                            estadio: 'Estadio IC',
                            descripcion: 'El cáncer está limitado a uno o ambos ovarios o trompas de Falopio, pero con ruptura quirúrgica, cápsula rota o tumor en la superficie. (T1c, N0, M0).'
                        };
                    case 'T2':
                        return {
                            estadio: 'Estadio II',
                            descripcion: 'El cáncer afecta uno o ambos ovarios o trompas de Falopio con extensión pélvica. (T2, N0, M0).'
                        };
                    case 'T2a':
                        return {
                            estadio: 'Estadio IIA',
                            descripcion: 'El cáncer se ha diseminado al útero y/o trompas de Falopio o ambos. (T2a, N0, M0).'
                        };
                    case 'T2b':
                        return {
                            estadio: 'Estadio IIB',
                            descripcion: 'El cáncer se ha diseminado a otros tejidos pélvicos. (T2b, N0, M0).'
                        };
                    case 'T1':
                        return {
                            estadio: 'Estadio I',
                            descripcion: 'El cáncer está limitado al ovario o trompa de Falopio. (T1, N0, M0).'
                        };
                }
            }

            // Si no se cumple ninguna regla
            return {
                estadio: '',
                descripcion: ''
            };
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
            return this.$refs.formOvario.validate();
        },
        guardarCancerOvario() {
            if (!this.$refs.formOvario.validate()) {
                return this.$toast.error('Diligencia todos los campos requeridos')
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
                estadio_figo: this.estadioFigo.estadio,
                descripcion_estadio_figo: this.estadioFigo.descripcion,
                consulta_id: consulta,
                id: id
            };

            this.$axios.post('registrar-biopsias/registrar-biopsia-ovarios', data).then(() => {
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