<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-card flat>
                    <v-alert text dense color="info">
                        <b>CUESTIONARIO AUDIT</b>
                    </v-alert>
                    <v-form ref="form" lazy-validation>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Con qué
                                frecuencia consume alguna
                                bebida
                                alcohólica?</v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.frecuencia_consume_alcohol" row :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Una o menos veces al mes" value="1"></v-radio>
                            <v-radio label="De 2 a 4 veces al mes" value="2"></v-radio>
                            <v-radio label="De 2 a 3 más veces a la semana" value="3"></v-radio>
                            <v-radio label="4 o más veces a la semana" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cuántas bebidas
                                alcohólicas suele
                                realizar en un día
                                de consumo normal?</v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.cuantas_bebidas_consume_en_dia" row :rules="campoRequerido">
                            <v-radio label="Ninguna" value="0.0"></v-radio>
                            <v-radio label="1 o 2" value="0"></v-radio>
                            <v-radio label="3 o 4" value="1"></v-radio>
                            <v-radio label="5 o 6" value="2"></v-radio>
                            <v-radio label="De 7 a 9" value="3"></v-radio>
                            <v-radio label="10 o más" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Con qué
                                frecuencia toma 5 o más
                                bebidas
                                alcohólicas en un solo día? </v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.frecuencia_toma_5_o_mas_bebidas_alcoholicas" row
                            :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿En el último año,
                                con qué
                                frecuencia ha sido incapaz
                                de parar de beber, una vez haya iniciado? </v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.frecuencia__incapaz_beber" row :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿En el último año,
                                con qué
                                frecuencia no pudo
                                atender sus obligaciones porque había bebido? </v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.frecuencia_no_atiende_obligaciones" row :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿En el último año,
                                con qué
                                frecuencia ha necesitado
                                beber en ayunas para recuperarse después de haber
                                bebido mucho el día anterior?</v-alert>
                        </v-col>

                        <v-radio-group v-model="audit.frecuencia__necesitado_beber_ayunas" row :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿En el último año,
                                con qué
                                frecuencia ha tenido
                                remordimientos o sentimientos de culpa después de
                                haber bebido? </v-alert>
                        </v-col>

                        <v-radio-group v-model="audit.frecuencia_remordimientos_sentimientos_luego_beber" row
                            :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿En el último año,
                                con qué
                                frecuencia no ha podido
                                recordar lo que sucedió la noche anterior porque
                                había estado bebiendo?</v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.frecuencia_no_recuerda_sucedido_noche_anterior" row
                            :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>


                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Usted o alguna
                                otra persona ha
                                resultado herido
                                porque usted había bebido?</v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.persona_herida_por_beber" row :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Algún familiar,
                                amigo, médico o
                                profesional de la
                                salud ha mostrado preocupación por un consumo de
                                bebidas alcohólicas o le ha sugerido que deje de
                                beber?</v-alert>
                        </v-col>
                        <v-radio-group v-model="audit.familiar_amigo_muestra_preocupacion_por_consumo" row
                            :rules="campoRequerido">
                            <v-radio label="Nunca" value="0"></v-radio>
                            <v-radio label="Menos de una vez al mes" value="1"></v-radio>
                            <v-radio label="Mensualmente" value="2"></v-radio>
                            <v-radio label="Semanalmente" value="3"></v-radio>
                            <v-radio label="A diario o casi diario" value="4"></v-radio>
                        </v-radio-group>

                        <div v-if="interpretacion">
                            <v-divider></v-divider>
                            <v-card-title>Interpretación de resultado:</v-card-title>
                            <v-alert :color="interpretacionColor" border="top" class="text-center" dense text>
                                <b>{{ interpretacion }}</b>
                            </v-alert>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex';
export default {
    props: ['datos'],
    data() {
        return {
            campoRequerido: [
                v => !!v || 'Campo requerido',
            ],
            audit: {
                frecuencia_consume_alcohol: null,
                cuantas_bebidas_consume_en_dia: null,
                frecuencia_toma_5_o_mas_bebidas_alcoholicas: null,
                frecuencia__incapaz_beber: null,
                frecuencia_no_atiende_obligaciones: null,
                frecuencia__necesitado_beber_ayunas: null,
                frecuencia_remordimientos_sentimientos_luego_beber: null,
                frecuencia_no_recuerda_sucedido_noche_anterior: null,
                persona_herida_por_beber: null,
                familiar_amigo_muestra_preocupacion_por_consumo: null,
            },
            loading: false,
            interpretacion: '',
            interpretacionColor: 'warning'
        };
    },

    mounted() {
        const datosAudit = this.obtenerDatosPorConsulta(this.datos.id, 'Audit/Model/audit', 'historia/formularios/testAudit');
        if (datosAudit) {
            this.audit = { ...datosAudit }
        } else {
            this.cargarDatos();

        }
    },
    watch: {
        audit: {
            handler(nuevoValor) {
                const camposAEvaluar = [
                    'frecuencia_consume_alcohol',
                    'cuantas_bebidas_consume_en_dia',
                    'frecuencia_toma_5_o_mas_bebidas_alcoholicas',
                    'frecuencia__incapaz_beber',
                    'frecuencia_no_atiende_obligaciones',
                    'frecuencia__necesitado_beber_ayunas',
                    'frecuencia_remordimientos_sentimientos_luego_beber',
                    'frecuencia_no_recuerda_sucedido_noche_anterior',
                    'persona_herida_por_beber',
                    'familiar_amigo_muestra_preocupacion_por_consumo',
                ];
                const preguntasClaves = Object.keys(nuevoValor).filter(key => camposAEvaluar.includes(key));
                const respuestasNumericas = preguntasClaves.map(key => Number(nuevoValor[key])).filter(n => !isNaN(
                    n));
                const puntajeTotal = respuestasNumericas.reduce((a, b) => a + b, 0);
                if (respuestasNumericas.length > 0) {
                    const sexo = this.datos.afiliado?.sexo || 'M';
                    this.interpretarResultado(puntajeTotal, sexo);
                } else {
                    this.interpretacion = '';
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
            const data = {
                ...this.audit,
                interpretacion_resultados: this.interpretacion,
            };
            return {
                datos: data
            };
        },
        interpretarResultado(puntaje, sexo) {
            if (puntaje === 0) {
                this.interpretacion = 'Bajo riesgo de problemas con el alcohol';
                this.interpretacionColor = 'success';
                return;
            }

            if (sexo === 'M') {
                if (puntaje >= 20) {
                    this.interpretacion = 'Dependencia del alcohol';
                    this.interpretacionColor = 'error';
                } else if (puntaje >= 15) {
                    this.interpretacion = 'Indicativo de una probable dependencia';
                    this.interpretacionColor = 'warning';
                } else if (puntaje >= 8) {
                    this.interpretacion = 'Fuerte probabilidad de daños debido al consumo de alcohol';
                    this.interpretacionColor = 'info';
                } else {
                    this.interpretacion = 'Bajo riesgo de problemas con el alcohol';
                    this.interpretacionColor = 'success';
                }
            } else if (sexo === 'F') {
                if (puntaje >= 20) {
                    this.interpretacion = 'Dependencia del alcohol';
                    this.interpretacionColor = 'error';
                } else if (puntaje >= 13) {
                    this.interpretacion = 'Indicativo de una probable dependencia';
                    this.interpretacionColor = 'warning';
                } else if (puntaje >= 7) {
                    this.interpretacion = 'Fuerte probabilidad de daños debido al consumo de alcohol';
                    this.interpretacionColor = 'info';
                } else {
                    this.interpretacion = 'Bajo riesgo de problemas con el alcohol';
                    this.interpretacionColor = 'success';
                }
            }
        },

        cargarDatos() {
            this.$axios.get(`audit/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.audit = {
                    ...this.audit,
                    ...res.data
                }
                this.interpretacion = this.audit.interpretacion_resultados
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos del test audit');
            });
        },
        validarErrores() {
            const campos = { ...this.audit };

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.form.validate();
        },
    }
};

</script>
