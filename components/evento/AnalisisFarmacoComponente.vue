<template>
    <div>
        <v-row dense>
            <!--Metodología AMEF -->
            <v-col cols="12" v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-alert text dense border="left" color="purple" icon="mdi-protocol">Metodología AMEF</v-alert>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-textarea auto-grow dense v-model="analisisFarmaco.elemento_funcion"
                    label="Elemento/Funcion"></v-textarea>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-textarea auto-grow dense v-model="analisisFarmaco.modo_fallo" label="Modo de fallo"></v-textarea>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-textarea auto-grow dense v-model="analisisFarmaco.efecto" label="Efecto"></v-textarea>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-text-field type="number" dense v-model="analisisFarmaco.npr" label="NPR"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Metodología AMEF'">
                <v-textarea auto-grow dense v-model="analisisFarmaco.acciones_propuestas" label="Acciones propuestas">
                </v-textarea>
            </v-col>

            <!-- Metodolgía WHO AEFI (EPAV) -->
            <v-col cols="12" v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-alert text dense border="left" color="purple" icon="mdi-protocol">Metodología WHO AEFI
                    (EPAV)</v-alert>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.causas_esavi"
                    label="¿Hay evidencia determinante que indique que otras causas originaron el ESAVI?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.asociacion_esavi"
                    label="¿Hay una asociación descrita en la literatura, entre el ESAVI y la vacuna o la vacunación?">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.ventana_mayoriesgo"
                    label="¿El evento estuvo dentro de la ventana de tiempo de mayor riesgo?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.evidencia_asociacioncausal"
                    label="¿Hay evidencia en contra de una asociación causal?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.factores_esavi"
                    label="¿Existen otros factores que pudieron haber impactado en el desarrollo del ESAVI?"></v-autocomplete>
            </v-col>

            <!-- FARMACOVIGILANCIA -->
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete dense
                    :items="['Reacción relacionada con la vacuna', 'Reacción relacionada con defectos en la calidad de la vacuna', 'Reacción relacionada con un error en la inmunización', 'Reacción relacionada con la ansiedad generalizada por la inmunización', 'La relación temporal es coherente, pero la evidencia no es concluyente', 'Tendencias contradictorias de coherencia e inconsistencia para una sociación', 'Coincidente (condiciones subyacentes o emergentes)', 'Inclasificable']"
                    v-model="analisisFarmaco.evaluacion_causalidad" label="Evaluación de causalidad">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'WHO AEFI (EPAV)'">
                <v-autocomplete dense :items="['Serio', 'No Serio']" v-model="analisisFarmaco.clasificacion_invima"
                    label="Clasificación Invima">
                </v-autocomplete>
            </v-col>
            <!-- <v-col cols="12" sm="3" md="3" v-if="eventoAdverso.analisis_evento?.seriedad == 'Muerte'">
        <v-text-field type="date" dense v-model="analisisFarmaco.fecha_muerte" label="Fecha de muerte"></v-text-field>
      </v-col> -->

            <!-- Algoritmo OMS -->
            <v-col cols="12" v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-alert text dense border="left" color="purple" icon="mdi-protocol">Algoritmo OMS</v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete label="El evento se presentó después de la administración de un medicamento" dense
                    outlined :items="algoritmoOms" v-model="analisisFarmaco.administrar_medicamento_evento">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete label="Existen otros factores que puedan explicar el evento(medicamento,patologías,etc)"
                    dense outlined :items="algoritmoOms" v-model="analisisFarmaco.factores_explicar_evento">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete label="¿El evento desapareció al disminuir o suspender el medicamento sospechoso?" dense
                    outlined :items="algoritmoOms" v-model="analisisFarmaco.evento_desaparecio_suspender_medicamento">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete label="¿El paciente ya habia presentado la misma reaccion al medicamento sospechoso?"
                    dense outlined :items="algoritmoOms" v-model="analisisFarmaco.paciente_presenta_misma_reaccion">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete label="¿Se puede ampliar la información del paciente relacionado con el evento?" dense
                    outlined :items="algoritmoOms" v-model="analisisFarmaco.ampliar_informacion_relacionada_evento">
                </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete dense outlined
                    :items="['Definitiva', 'Probable', 'Posible', 'Improbable', 'Condicional/No clasificada', 'No evaluable/ Inclasificable']"
                    v-model="analisisFarmaco.evaluacion_causalidad" label="Evaluación de causalidad">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'Algoritmo OMS'">
                <v-autocomplete dense :items="['Serio', 'No Serio']" v-model="analisisFarmaco.clasificacion_invima"
                    outlined label="Clasificación Invima">
                </v-autocomplete>
            </v-col>

            <!-- VACA -->
            <v-col cols="12"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-alert text dense border="left" color="purple" icon="mdi-protocol">FT - VACA-DELASSALA</v-alert>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.farmaco_cinetica"
                    label="¿El FT se refiere a un fármaco de cinética compleja?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.condiciones_farmacocinetica"
                    label="¿El paciente presenta condiciones clínicas que alteren la farmacocinética?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.prescribio_manerainadecuada"
                    label="¿El medicamento se prescribió de manera inadecuada?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.medicamento_manerainadecuada"
                    label="¿El medicamento se usó de manera inadecuada?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.medicamento_entrenamiento"
                    label="¿La administracion del medicamento requiere un entrenamiento especial del paciente?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.potenciales_interacciones"
                    label="¿Existen potenciales interacciones?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.notificacion_refieremedicamento"
                    label="¿La notificación de FT se refiere a un medicamento genérico o una marca comercial?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.problema_biofarmaceutico"
                    label="¿Existe algún problema biofarmacéutico estudiado?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.deficiencias_sistemas"
                    label="¿Existen deficiencias en los sistemas de almacenamiento del medicamento?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="respuestas" dense v-model="analisisFarmaco.factores_asociados"
                    label="¿Existen otros factores asociados que pudieran explicar el FT?"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete
                    :items="['Posiblemente asociado al uso inadecuado del medicamento', 'Notificación posiblemente inducida', 'Posiblemente asociado a un problema biofarmacéutico (calidad)', 'Posiblemente asociado a respuesta idiosincrática u otras razones no establecidas', 'No se cuenta con información suficiente para el análisis']"
                    dense v-model="analisisFarmaco.evaluacion_causalidad"
                    label="Evaluación de causalidad"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4"
                v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco == 'FT - VACA-DELASSALA'">
                <v-autocomplete :items="['Serio', 'No Serio']" dense v-model="analisisFarmaco.clasificacion_invima"
                    label="Clasificación Invima"></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3" v-if="eventoAdverso.analisis_evento?.clasificacion_invima == 'Serio'">
                <v-autocomplete
                    :items="['Produjo o prolongó hospitalización', 'Anomalía congénita', 'Amenaza de vida', 'Muerte', 'Produjo discapacidad o incapacidad permanente / condición médica importante']"
                    dense v-model="analisisFarmaco.seriedad" label="Seriedad" outlined></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="3" md="3" v-if="eventoAdverso.analisis_evento?.seriedad == 'Muerte'">
                <v-text-field type="date" dense v-model="analisisFarmaco.fecha_muerte"
                    label="Fecha de muerte"></v-text-field>
            </v-col>
        </v-row>
        <v-card-actions v-if="eventoAdverso.analisis_evento?.metodologia_analisis_farmaco" class="justify-center">
            <v-btn color="info" dark @click="actualizarAnalisis()">
                Guardar metodología farmacovigilancia
                <v-icon dark right>
                    mdi-check
                </v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonAnalisisFarmacoComponente',

    data() {
        return {
            respuestas: ['SI', 'NO', 'NO SABE'],
            analisisFarmaco: {},
            algoritmoOms: ['Si', 'No', 'No sabe']
        };
    },

    mounted() {
        this.asignacionDatos()
    },

    props: {
        eventoAdverso: Object,
    },

    methods: {
        actualizarAnalisis() {
            this.preload = true
            this.analisisFarmaco.metodologia_analisis_farmaco = this.eventoAdverso.analisis_evento?.metodologia_analisis_farmaco
            this.$axios.put('/analisis-eventos/' + this.eventoAdverso.analisis_evento?.id, this.analisisFarmaco).then(
                res => {
                    return this.$toast.success('Metodología actualizada correctamente!.')
                }).catch(
                    error => {
                        this.preload = false
                        if (error.response.data.mensaje) {
                            this.$toast.error(error.response.data.mensaje)
                        } else if (error.response.data) {
                            this.ErrorEntrada(error.response.data)
                        }
                    },
                ).finally(() => {
                    this.limpiarError()
                    this.preload = false;
                });

        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        asignacionDatos() {
            this.analisisFarmaco = { ...this.eventoAdverso?.analisis_evento };
        }

    },
};

</script>
