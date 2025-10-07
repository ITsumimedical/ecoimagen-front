<template>
    <div>
        <v-form ref="formBarthel">
            <v-alert text dense color="info" border="left" icon="mdi-brain">
                <b>ÍNDICE DE BARTHEL</b>
            </v-alert>
            <v-col cols="12" sm="12" md="12">
                <v-row justify="center" dense>
                    <v-col cols="12" md="12" sm="12">
                        <v-alert text dense color="success" border="left"
                            icon="mdi-food-drumstick-outline"><b>Comer</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_comer" :rules="CampoRequerido">
                                <v-radio label="Independiente" :value="10"></v-radio>
                                <v-radio label="Necesita ayuda para cortar el pan, carne, etc" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left"
                            icon="mdi-shower-head"><b>Bañarse</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_lavarse" :rules="CampoRequerido">
                                <v-radio label="Independiente" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left" icon="mdi-hanger"><b>Vestirse</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_vestirse" :rules="CampoRequerido">
                                <v-radio label="Independiente" :value="10"></v-radio>
                                <v-radio label="Necesita ayuda pero puede hacer la mitad" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left" icon="mdi-hanger"><b>Aseo
                                personal</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_arreglarse" :rules="CampoRequerido">
                                <v-radio label="Independiente" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>


                        <v-alert text dense color="success" border="left" icon="mdi-toilet"><b>Deposición</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_deposiciones" :rules="CampoRequerido">
                                <v-radio label="Continente(Ningún espisodio de incontinencia)" :value="10"></v-radio>
                                <v-radio label="Accidente ocasional(Menos de una vez por semana)" :value="5"></v-radio>
                                <v-radio label="Incontinente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left" icon="mdi-toilet"><b>Micción</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_miccion" :rules="CampoRequerido">
                                <v-radio label="Continente(Ningún espisodio de incontinencia, seco día y noche)"
                                    :value="10"></v-radio>
                                <v-radio label="Accidente ocasional(Menos de una vez por semana)" :value="5"></v-radio>
                                <v-radio label="Incontinente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left" icon="mdi-toilet"><b>Uso del
                                retrete</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_retrete" :rules="CampoRequerido">
                                <v-radio label="Independiente(Entra y sale solo)" :value="10"></v-radio>
                                <v-radio label="Necesita ayuda" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left" icon="mdi-seat-outline"><b>Trasladarse
                                silla/cama</b>
                        </v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_trasladarse" :rules="CampoRequerido">
                                <v-radio label="Independiente(Sin ayuda en todas las fases)" :value="15"></v-radio>
                                <v-radio label="Necesita ayuda (Supervisión o pequeña ayuda)" :value="10"></v-radio>
                                <v-radio label="Gran ayuda" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left"
                            icon="mdi-walk"><b>Desplazamiento</b></v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_deambular" :rules="CampoRequerido">
                                <v-radio label="Independiente(Puede caminar 50 metros por lo menos)"
                                    :value="15"></v-radio>
                                <v-radio label="Necesita ayuda (Supervisión o pequeña ayuda)" :value="10"></v-radio>
                                <v-radio label="Gran ayuda" :value="5"></v-radio>
                                <v-radio label="Dependiente" :value="0"></v-radio>
                            </v-radio-group>
                        </div>

                        <v-alert text dense color="success" border="left"
                            icon="mdi-elevator-passenger-outline"><b>Escalones</b>
                        </v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group row v-model="barthel.barthel_escalones" :rules="CampoRequerido">
                                <v-radio label="Independiente(Capaz de subir y bajar sin ayuda)" :value="10"></v-radio>
                                <v-radio label="Necesita ayuda (Supervisión o pequeña ayuda)" :value="6"></v-radio>
                                <v-radio label="Gran ayuda" :value="4"></v-radio>
                                <v-radio label="Dependiente(Incapaz, necesita ayuda para desplazarse)"
                                    :value="0"></v-radio>
                            </v-radio-group>
                        </div>
                        <v-alert type="info" border="left" dense align="center" v-if="clasificacionBarthel != ' '">
                            <!-- Puntaje total: {{ puntajeTotalBarthel }}<br> -->
                            Clasificación: <strong>{{ clasificacionBarthel }}</strong>
                        </v-alert>

                    </v-col>
                </v-row>
            </v-col>
        </v-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'HorusHealthIndiceBarthelComponent',
    props: ['datos', 'resumen'],


    data() {
        return {
            barthel: {
                barthel_comer: null,
                barthel_lavarse: null,
                barthel_vestirse: null,
                barthel_arreglarse: null,
                barthel_deposiciones: null,
                barthel_miccion: null,
                barthel_retrete: null,
                barthel_trasladarse: null,
                barthel_deambular: null,
                barthel_escalones: null,
            },
            interpretacion_resultado: null,
            loading: false,
            CampoRequerido: [
           v => v !== '' && v !== null && v !== undefined || 'Este campo es requerido',
         ],
        }
    },
    watch: {
        clasificacionBarthel(newVal) {
            this.interpretacion_resultado = newVal;
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),

        puntajeTotalBarthel() {
            return Object.values(this.barthel)
                .map(v => Number(v) || 0)
                .reduce((acc, val) => acc + val, 0);
        },
        clasificacionBarthel() {
            const puntaje = this.puntajeTotalBarthel;

            if (puntaje == 0) return " ";
            if (puntaje > 0 && puntaje < 20) return "Dependencia total";
            if (puntaje >= 20 && puntaje <= 35) return "Dependencia grave";
            if (puntaje >= 40 && puntaje <= 55) return "Dependencia moderada";
            if (puntaje >= 60 && puntaje < 100) return "Dependencia leve";
            if (puntaje === 100) return "Independiente";
            return "Clasificación no definida";
        }
    },

    created() {
        const datosBarthel = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/IndiceBarthelComponent');
        if (datosBarthel) {
            this.barthel = datosBarthel
        }
    },

    methods: {
        guardarPuntaje() {
            this.puntajeBarthel = this.puntajeTotalBarthel();
        },
        validarErrores() {
            return [];
        },
        obtenerDatos() {
            const data = {
                ...this.barthel,
                interpretacion_barthel: this.interpretacion_resultado
            }
            return {
                datos: data
            };
        },
        obtenerDatosBarthel() {
            this.$axios.get(`historia/obtenerDatosBarthel/${this.datos.afiliado.id}`)
                .then(res => {
                    Object.keys(res.data).forEach(key => {
                        this.$set(this.barthel, key, res.data[key]);
                    });
                })
                console.log(res)
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                    this.$toast.error('Error al cargar los datos de barthel');
                });
        },
        validarErrores() {
                const campos = {
                    ...this.barthel
                };
                delete campos.consulta_id;

                const algunCampoLleno = Object.values(campos).some(
                    valor => valor !== '' && valor !== null && valor !== undefined
                );

                // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
                if (!algunCampoLleno) {
                    return true;
                }

                // Solo si hay algún campo diligenciado, validamos todo el formulario
                return this.$refs.formBarthel.validate();
            },
    },
};

</script>

<style lang="scss" scoped></style>
