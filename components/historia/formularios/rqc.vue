<template>
    <div>
        <v-alert text dense color="info" border="left" class="text-center" icon="mdi-head-question-outline">
            <b>CUESTIONARIO RQC</b>
        </v-alert>
        <v-form ref="formRqc" lazy-validation>
            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <strong>
                        1. ¿El lenguaje del niño es anormal en alguna forma?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.lenguaje_normal" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <strong>
                        2. ¿El niño duerme mal?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.duerme_mal" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        3. ¿Ha tenido el niño en algunas ocasiones convulsiones o caídas al suelo sin razón?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.tenido_convulsiones" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        4. ¿Sufre el niño de dolores frecuentes de cabeza?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.dolores_cabeza" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        5. ¿El niño ha huido de casa frecuentemente?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.huido_casa" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        6. ¿Ha robado algo de la casa?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.robado_casa" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        7. ¿Se asusta o se pone nervioso sin razón?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.nervioso" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-divider></v-divider>

                <v-col cols="12" sm="6" md="6">
                    <strong>
                        8. ¿Parece como retardado o lento para aprender?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.lento_responder" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>

                <v-divider></v-divider>
                <v-col cols="12" sm="6" md="6">
                    <strong>
                        9. ¿El niño casi nunca juega con otros niños?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.no_juega_amigos" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>


                <v-divider></v-divider>
                <v-col cols="12" sm="6" md="6">
                    <strong>
                        10. ¿El niño se orina o defeca en la ropa?
                    </strong>
                    <v-radio-group v-model="cuestionarioRqc.orina_defeca" row :rules="requerido">
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                </v-col>

            </v-row>
        </v-form>
        <!-- <v-card-actions class="justify-center">
            <v-btn color="success" small @click="cargarDatos" :loading="loading">
                Guardar Respuestas
            </v-btn>
        </v-card-actions> -->

        <v-alert v-if="cuestionarioRqc.interpretacion_resultado" :color="alertaTipo" dense text :icon="typeIcon">
            <b> {{ cuestionarioRqc.interpretacion_resultado }}</b>
        </v-alert>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    props: ['datos'],
    data() {
        return {
            cuestionarioRqc: {
                lenguaje_normal: null,
                duerme_mal: null,
                tenido_convulsiones: null,
                dolores_cabeza: null,
                huido_casa: null,
                robado_casa: null,
                nervioso: null,
                lento_responder: null,
                no_juega_amigos: null,
                orina_defeca: null,
                consulta_id: this.datos.id,
                interpretacion_resultado: ''
            },
            requerido: [
                v => v === true || v === false || 'Este campo es obligatorio',
            ],
            resultado_test: '',
            loading: false,
        }
    },

    watch: {
        cuestionarioRqc: {
            handler(nuevoValor) {
                const todosCamposCompletos = Object.values(nuevoValor).slice(0, 10).every(v => typeof v === 'boolean');
                if (todosCamposCompletos) {
                    this.verificarAlerta();
                }
            },
            deep: true,
        }
    },


    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
        const datosrqc = this.obtenerDatosPorConsulta(this.datos.id, 'rqc/model/rqc', 'historia/formularios/rqc');
        if (datosrqc) {
            this.cuestionarioRqc = { ...datosrqc }
        } else {
            this.cargarDatos();
        }
    },
    methods: {

        obtenerDatos() {
            const data = {
                ...this.cuestionarioRqc,
            }
            return { datos: data };
        },

        cargarDatos() {
            this.$axios.get(`rqc/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
                this.cuestionarioRqc = {
                    ...this.cuestionarioRqc,
                    ...res.data
                }
                this.verificarAlerta()
            }).catch(error => {
                console.log(error);
                this.$toast.error('Error al cargar los datos');
            });
        },
        verificarAlerta() {
            const respuestas = Object.values(this.cuestionarioRqc).slice(0, 10);

            const todosCompletos = respuestas.every(v => typeof v === 'boolean');

            if (!todosCompletos) {
                this.cuestionarioRqc.interpretacion_resultado = '';
                return;
            }

            const hayRespuestasPositivas = respuestas.some(v => v === true);

            if (hayRespuestasPositivas) {
                this.alertaTipo = 'warning';
                this.typeIcon = 'mdi-information-outline';
                this.cuestionarioRqc.interpretacion_resultado =
                    'Necesidad de evaluación integral, diagnóstico, tratamiento y seguimiento por parte de profesional en medicina especializada o profesional en psicología o trabajo social, según sea el caso, para el manejo respectivo.';
            } else {
                this.alertaTipo = 'success';
                this.typeIcon = 'mdi-check-circle-outline';
                this.cuestionarioRqc.interpretacion_resultado = 'No se debe realizar una interpretación.';
            }
        },

          validarErrores() {
            const campos = { ...this.cuestionarioRqc };
            delete campos.consulta_id;
            delete campos.interpretacion_resultado;

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.formRqc.validate();
        },
    }
}

</script>
