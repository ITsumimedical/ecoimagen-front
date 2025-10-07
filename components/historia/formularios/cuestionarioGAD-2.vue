<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card flat>
                    <v-form ref="formGad2" v-model="valid" lazy-validation>
                        <v-alert text dense color="info" border="bottom" icon="mdi-alert">
                            <b>CUESTIONARIO GAD-2</b>
                        </v-alert>
                        <v-alert text dense color="blue-grey">
                            <b>DURANTE LAS ÚLTIMAS 2 SEMANAS, ¿QUÉ TAN SEGUIDO SE HA MOLESTADO POR LOS SIGUIENTES
                                PROBLEMAS?</b>
                        </v-alert>

                        <v-col cols="12" md="12" sm="12">
                            <strong>Sentirse
                                nervioso(a), ansioso(a),
                                o inquieto</strong>
                        </v-col>
                        <v-radio-group v-model="cuestionario.sentirse_nervioso_ansioso" row>
                            <v-radio label="Para nada" value="0"></v-radio>
                            <v-radio label="Algunos días" value="1"></v-radio>
                            <v-radio label="Más de la mitad de los días" value="2"></v-radio>
                            <v-radio label="Casi todos los días" value="3"></v-radio>
                        </v-radio-group>

                        <v-col cols="12" md="12" sm="12">
                            <strong>No poder parar o
                                controlar la
                                preocupación</strong>
                        </v-col>
                        <v-radio-group v-model="cuestionario.no_poder_controlar_preocupacion" row>
                            <v-radio label="Para nada" value="0"></v-radio>
                            <v-radio label="Algunos días" value="1"></v-radio>
                            <v-radio label="Más de la mitad de los días" value="2"></v-radio>
                            <v-radio label="Casi todos los días" value="3"></v-radio>
                        </v-radio-group>


                        <v-alert v-if="cuestionario.interpretacion_resultado"
                            :color="sumaValores > 3 ? 'warning' : 'success'" text dense border="left" icon="mdi-alert">
                            {{ cuestionario.interpretacion_resultado }}
                        </v-alert>

                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import { mapGetters } from 'vuex';
    export default {
        props: ['tipoTest', 'datos'],
        data() {
            return {
                preguntas: [],
                respuestas: {},
                loading: false,
                cuestionario: {
                    sentirse_nervioso_ansioso: '',
                    no_poder_controlar_preocupacion: '',
                    interpretacion_resultado: ''
                },
                sumaValores: 0,
                valid: false,
            };
        },
        watch: {
            cuestionario: {
                handler() {
                    this.evaluarResultadoGAD2();
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
        },
        mounted() {
            const datosCuestionario = this.obtenerDatosPorConsulta(this.datos.id, 'CuestionarioGad2/Model/cuestionarioGAD_2', 'historia/formularios/cuestionarioGAD-2');

            if (datosCuestionario) {
                this.cuestionario = { ...datosCuestionario }
            } else {
                this.cargarDatos();
            }
        },
        methods: {
            obtenerDatos() {
                return {
                    datos: this.cuestionario
                };
            },
            cargarDatos() {
                this.$axios.get(`cuestionarioGAD-2/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                    if (res.data) {
                        this.cuestionario.sentirse_nervioso_ansioso = res.data.sentirse_nervioso_ansioso;
                        this.cuestionario.no_poder_controlar_preocupacion = res.data
                            .no_poder_controlar_preocupacion;
                        this.evaluarResultadoGAD2();
                    }
                }).catch(error => {
                    console.log(error);
                    this.$toast.error('Error al cargar los datos');
                });
            },
            evaluarResultadoGAD2() {
                const valor1 = Number(this.cuestionario.sentirse_nervioso_ansioso);
                const valor2 = Number(this.cuestionario.no_poder_controlar_preocupacion);
                this.sumaValores = valor1 + valor2;

                if (this.sumaValores > 3) {
                    this.cuestionario.interpretacion_resultado =
                        'Se debe realizar la valoración correspondiente para confirmar un diagnóstico de ansiedad generalizada.';
                } else if (this.sumaValores <= 3) {
                    this.cuestionario.interpretacion_resultado = 'No se deben realizar valoraciones adicionales.';
                }
            }


        }
    };

</script>

<style scoped>
    .v-radio-group {
        display: flex;
        justify-content: space-between;
    }

    .v-radio {
        margin: 0 10px;
        display: flex;
        align-items: center;
    }

    .v-divider--vertical {
        margin: 0 10px;
        height: 50px;
    }

</style>
