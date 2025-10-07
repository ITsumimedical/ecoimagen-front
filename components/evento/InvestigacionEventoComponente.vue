<template>
    <div>
        <div class="my-8 d-flex align-center">
            <v-divider color="#311B92"></v-divider>

            <span class="mx-4 font-weight-bold text-subtitle-1 d-flex align-center" style="color: #311B92;">
                <v-icon left color="#311B92">mdi-file-search</v-icon>
                INVESTIGACIÓN Y ANÁLISIS
            </span>

            <v-divider color="#311B92"></v-divider>
        </div>

        <v-row dense>
            <v-col cols="12" sm="6" md="3">
                <v-text-field :error-messages="errors.fecha_analisis" dense v-model="investigacionEvento.fecha_analisis"
                    label="Fecha análisis" outlined type="date">
                </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea auto-grow dense v-model="investigacionEvento.cronologia_suceso"
                    label="Cronología del suceso" outlined :error-messages="errors.cronologia_suceso">
                </v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-select dense v-model="investigacionEvento.clasificacion_analisis" :items="['Evento adverso prevenible', 'Evento adverso no prevenible', 'Incidente',
                    'Complicación', 'Indicio atención insegura', 'Centinela']" label="Clasificación evento" outlined
                    :error-messages="errors.clasificacion_analisis" @change="resetearValidacion">
                </v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="eventoAdverso.suceso_id == 139">
                <v-autocomplete dense v-model="investigacionEvento.clasif_tecnovigilancia" outlined
                    :items="['Evento adverso serio', 'Evento adverso no serio', 'Incidente serio', 'Incidente no serio']"
                    label="Clasificación tecnovigilancia" :error-messages="errors.clasif_tecnovigilancia">
                </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-select dense v-model="investigacionEvento.metodologia_analisis" :items="metodologiaAnalisisItems"
                    outlined label="Metodología de análisis" :error-messages="errors.metodologia_analisis">
                </v-select>
            </v-col>
            <v-col v-if="eventoAdverso.suceso_id == 109" cols="12" sm="6" md="4">
                <v-select dense v-model="investigacionEvento.metodologia_analisis_farmaco" outlined
                    :items="['Algoritmo OMS', 'Metodología AMEF', 'WHO AEFI (EPAV)', 'FT - VACA-DELASSALA']"
                    label="Metodología de análisis farmaco" :error-messages="errors.metodologia_analisis_farmaco">
                </v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="mt-n3"
                v-if="['Centinela', 'Evento adverso prevenible', 'Evento adverso no prevenible'].includes(investigacionEvento.clasificacion_analisis)">
                <v-switch dense v-model="requiereDiasAdicionales" label="Requirió días adicionales de hospitalización"
                    @change="cambioSwitch" />
            </v-col>
            <v-col v-if="requiereDiasAdicionales" cols="12" sm="6" md="4">
                <v-text-field v-model="investigacionEvento.cantidad_dias_adicionales" type="number"
                    label="Cantidad días adicionales" outlined dense min="1"
                    :error-messages="errors.cantidad_dias_adicionales" />
            </v-col>

            <!-- RESPUESTA INMEDIATA -->
            <v-card-text>
                <v-alert dense border="left" v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'"
                    text :value="true" type="info" icon="mdi-speedometer">
                    <b>Respuesta inmediata</b>
                </v-alert>
            </v-card-text>
            <v-col>
                <v-form ref="form">
                    <v-row v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'" dense>
                        <v-col v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'" cols="12" sm="6"
                            md="4">
                            <v-textarea rows="3" auto-grow :error-messages="errors.que_fallo" dense
                                v-model="investigacionEvento.que_fallo" label="¿Qué falló?" outlined
                                :rules="rules.respuestaInmediata">
                            </v-textarea>
                        </v-col>
                        <v-col v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'" cols="12" sm="6"
                            md="4">
                            <v-textarea rows="3" auto-grow :error-messages="errors.como_fallo" dense
                                v-model="investigacionEvento.como_fallo" label="¿Cómo? / ¿Por qué falló?" outlined
                                :rules="rules.respuestaInmediata">
                            </v-textarea>
                        </v-col>
                        <v-col v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'" cols="12" sm="6"
                            md="4">
                            <v-textarea rows="3" auto-grow :error-messages="errors.que_causo" dense
                                v-model="investigacionEvento.que_causo" label="¿Qué causó?" outlined
                                :rules="rules.respuestaInmediata">
                            </v-textarea>
                        </v-col>
                        <v-col v-if="investigacionEvento.metodologia_analisis == 'Respuesta inmediata'" cols="12" sm="6"
                            md="12">
                            <v-textarea rows="3" auto-grow :error-messages="errors.plan_accion" dense
                                v-model="investigacionEvento.plan_accion" label="Plan de acción implementado" outlined
                                :rules="rules.respuestaInmediata">
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <v-card-actions class="justify-end" v-if="![17, 5].includes(eventoAdverso.estado_id)">
            <v-btn color="blue-grey" small dark @click="guardarAnalisis()" :loading="loading">
                guardar análisis
                <v-icon dark right>
                    mdi-magnify-plus-outline
                </v-icon>
            </v-btn>
        </v-card-actions>


        <v-col cols="12" sm="12" md="12" v-if="eventoAdverso?.analisis_evento !== null">
            <analisisFarmaco :eventoAdverso="eventoAdverso"></analisisFarmaco>
        </v-col>

        <v-col cols="12" sm="12" md="12"
            v-if="eventoAdverso?.analisis_evento?.metodologia_analisis === 'Protocolo de Londres' || eventoAdverso?.analisis_evento?.clasificacion_analisis === 'Evento adverso prevenible' || eventoAdverso?.analisis_evento?.clasificacion_analisis === 'Centinela'">
            <AccionInseguraComponente :eventoAdverso="eventoAdverso" @protocoloRegistrado="emitirEvento()">
            </AccionInseguraComponente>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-if="eventoAdverso?.analisis_evento !== null">
            <ConsecuenciasComponente @consecuenciaRegistrada="emitirEvento()" :eventoAdverso="eventoAdverso">
            </ConsecuenciasComponente>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-if="eventoAdverso?.analisis_evento !== null">
            <PlanMejoraComponente ref="planMejora" :eventoAdverso="eventoAdverso"
                @accion-mejora-registrada="emitirEvento()" @plan-mejora-eliminado="emitirEvento()">
            </PlanMejoraComponente>
        </v-col>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex";
import PlanMejoraComponente from "~/components/evento/PlanMejoraComponente.vue";
import analisisFarmaco from "~/components/evento/AnalisisFarmacoComponente.vue";
import AccionInseguraComponente from "~/components/evento/AccionInseguraComponente.vue";
import ConsecuenciasComponente from './ConsecuenciasComponente.vue';



export default {
    name: 'WorkspaceJsonInvestigacionEventoComponente',

    components: {
        PlanMejoraComponente,
        analisisFarmaco,
        AccionInseguraComponente,
        ConsecuenciasComponente
    },

    data() {
        return {
            requiereDiasAdicionales: false,
            errors: {
                cantidad_dias_adicionales: '',
                fecha_analisis: '',
                cronologia_suceso: '',
                clasificacion_analisis: '',
                clasif_tecnovigilancia: '',
                // respuesta inmediata
                que_fallo: '',
                como_fallo: '',
                que_causo: '',
                plan_accion: '',
                // desenlace
                metodologia_analisis: '',
                metodologia_analisis_farmaco: ''
            },
            loading: false,
            investigacionEvento: {},
            rules: {
                respuestaInmediata: [
                    (v) => {
                        if (this.investigacionEvento.clasificacion_analisis !== 'Complicación' && this.investigacionEvento.clasificacion_analisis !== 'Evento adverso no prevenible') {
                            return !!v || 'El campo es requerido cuando la metodología de análisis es Respuesta Inmediata  '
                        }
                        return true
                    }
                ]
            },
        };
    },

    mounted() {

    },

    props: ['eventoAdverso'],

    computed: {
        metodologiaAnalisisItems() {
            const { suceso_id, clasificacion_analisis } = this.investigacionEvento;

            if (clasificacion_analisis === 'Centinela') {
                return ['Protocolo de Londres'];
            }

            if (suceso_id === 139) return ['Respuesta inmediata', 'Protocolo de Londres'];
            if (suceso_id === 109) return ['Respuesta inmediata', 'Protocolo de Londres'];
            if (clasificacion_analisis === 'Evento adverso prevenible') return ['Protocolo de Londres'];
            if (clasificacion_analisis === 'Evento adverso no prevenible') return ['Respuesta inmediata'];

            return ['Respuesta inmediata', 'Protocolo de Londres'];
        },
    },

    watch: {
        metodologiaAnalisisItems(newItems) {
            if (!newItems.includes(this.investigacionEvento.metodologia_analisis)) {
                this.investigacionEvento.metodologia_analisis = null;
            }
        }
    },

    methods: {

        ...mapActions("app", ["setPreload"]),
        guardarAnalisis() {

            if (this.$refs.form.validate()) {
                this.guardarAnalisisEvento()
                this.$refs.form.resetValidation()
            }
        },
        resetearValidacion() {
            this.$nextTick(() => this.$refs.form.reset())
        },
        guardarAnalisisEvento() {
            this.loading = true;
            this.investigacionEvento.evento_adverso_id = this.eventoAdverso.id
            this.investigacionEvento.estado_id = 16

            const payload = { ...this.investigacionEvento };
            delete payload.requiere_dias_adicionales;

            this.limpiarError()
            this.$axios.post('/analisis-eventos/crear', payload).then(res => {
                this.eventoAnalizado = res.data
                this.$toast.success('Se ha registrado la investigación correctamente!.');
                this.emitirEvento();
                this.asignacionDatos();
            }).catch(error => {
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje)
                } else if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            }).finally(() => {
                this.loading = false;
                this.investigacionEvento.cantidad_dias_adicionales = null;
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

        emitirEvento() {
            this.$emit('analisisRegistrado');
        },

        asignacionDatos() {
            this.investigacionEvento = {
                ...this.eventoAdverso.analisis_evento
            };

            this.requiereDiasAdicionales = !!this.investigacionEvento.cantidad_dias_adicionales;

            if (this.eventoAdverso?.analisis_evento !== null) {
                this.$nextTick(() => {
                    this.$refs.planMejora.listarAccionesMejora();
                });
            }
        },
        cambioSwitch(value) {
            if (!value) {
                this.investigacionEvento.cantidad_dias_adicionales = null;
            }
        },
    },
};

</script>
