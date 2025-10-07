<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card flat>
                    <v-alert text dense color="info">
                        <b>CUESTIONARIO WHOOLEY</b>
                    </v-alert>

                    <v-col cols="12" md="12" sm="12">
                        <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Durante los últimos
                            30 días se ha
                            sentido a menudo desanimado, deprimido o con pocas esperanzas?</v-alert>
                    </v-col>
                    <v-radio-group v-model="whooley.desanimado_deprimido" row>
                        <v-radio label="Si" value="Si"></v-radio>
                        <v-radio label="No" value="No"></v-radio>
                    </v-radio-group>

                    <v-col cols="12" md="12" sm="12">
                        <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Durante los últimos
                            30 días ha
                            sentido poco interés o placer al hacer cosas que habitualmente disfrutaba?</v-alert>
                    </v-col>
                    <v-radio-group v-model="whooley.poco_placer_interes" row>
                        <v-radio label="Si" value="Si"></v-radio>
                        <v-radio label="No" value="No"></v-radio>
                    </v-radio-group>

                    <!-- <v-card-actions class="justify-center">
            <v-btn color="success" small @click="agregarRespuesta()" :loading="loading" :disabled="loading">Agregar
              respuestas</v-btn>
          </v-card-actions> -->

                    <!-- Alerta para resultado -->
                    <v-alert v-if="mostrarAlerta" text dense :color="alertaColor" border="left" icon="mdi-alert">
                        {{ mensajeAlerta }}
                    </v-alert>
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
                loading: false,
                whooley: {
                    desanimado_deprimido: '',
                    poco_placer_interes: ''
                },
                mostrarAlerta: false,
                mensajeAlerta: '',
                alertaColor: '',
            };
        },

        mounted() {
            const datosWhooley = this.obtenerDatosPorConsulta(this.datos.id, 'Whooley/Model/whooley', 'historia/formularios/whooley');

            if (datosWhooley) {
                this.whooley = { ...datosWhooley }
            } else {
            this.cargarDatos();
        }
        },
        computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
        watch: {
            whooley: {
                handler() {
                    this.evaluarResultadoWhooley();
                },
                deep: true
            }
        },

        methods: {
            obtenerDatos() {
                const data = {
                    ...this.whooley,
                    interpretacion_resultado: this.mensajeAlerta
                }
                return {
                    datos: data
                };
            },

            evaluarResultadoWhooley() {
                const {
                    desanimado_deprimido,
                    poco_placer_interes
                } = this.whooley;

                if (desanimado_deprimido === 'Si' || poco_placer_interes === 'Si') {
                    this.mostrarAlerta = true;
                    this.mensajeAlerta =
                        'Se debe realizar la valoración correspondiente para confirmar el diagnóstico de un episodio depresivo único o recurrente.';
                    this.alertaColor = 'warning';
                } else if (desanimado_deprimido === 'No' && poco_placer_interes === 'No') {
                    this.mostrarAlerta = true;
                    this.mensajeAlerta = 'No se deben realizar exámenes adicionales.';
                    this.alertaColor = 'success';
                } else {
                    this.mostrarAlerta = false;
                    this.mensajeAlerta = '';
                    this.alertaColor = '';
                }
            },

            cargarDatos() {
                this.$axios.get(`whooley/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                    if (res.data) {
                        this.whooley.desanimado_deprimido = res.data.desanimado_deprimido;
                        this.whooley.poco_placer_interes = res.data.poco_placer_interes;
                        this.evaluarResultadoWhooley();
                    }
                }).catch(error => {
                    console.log(error);
                    this.$toast.error('Error al cargar los datos');
                });
            }
        }
    };

</script>
