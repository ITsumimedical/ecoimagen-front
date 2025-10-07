<template>
    <div>
        <div class="my-8 d-flex align-center">
            <v-divider color="#e64a19"></v-divider>

            <span class="mx-4 font-weight-bold text-subtitle-1 d-flex align-center" style="color: #e64a19;">
                <v-icon left color="deep-orange darken-2">mdi-alert-decagram</v-icon>
                CONSECUENCIAS Y ACCIONES DE MEJORA
            </span>

            <v-divider color="#e64a19"></v-divider>
        </div>

        <v-row dense>
            <v-col cols="12" sm="6" md="6">
                <v-textarea dense outlined v-model="investigacionEvento.descripcion_consecuencias"
                    label="Descripción de las consecuencias">
                </v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-textarea dense outlined v-model="investigacionEvento.accion_resarcimiento"
                    label="Acciones de resarcimiento">
                </v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense v-model="investigacionEvento.desenlace_evento" :items="['Recuperado / Resuelto sin secuelas', 'Recuperado / Resuelto con secuelas',
                    'Recuperando / Resolviendo', 'No recuperado / No resuelto', 'Fatal', 'Desconocido', 'Muerte']"
                    label="Desenlace del evento" outlined>
                </v-select>
            </v-col>
        </v-row>
        <v-card-actions class="justify-end" v-if="![17, 5].includes(eventoAdverso.estado_id)">
            <v-btn color="blue-grey" dark small @click="guardarAnalisisEvento()" :loading="loading">
                guardar consecuencias
                <v-icon dark right>
                    mdi-alert-circle-outline
                </v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex";
export default {
    name: 'WorkspaceJsonConsecuenciasComponente',

    data() {
        return {
            loading: false,
            investigacionEvento: {
                descripcion_consecuencias: '',
                accion_resarcimiento: '',
                desenlace_evento: '',
                evento_adverso_id: ''
            }
        };
    },

    mounted() {
        this.asignarDatosConsecuencias();
    },

    props: ['eventoAdverso'],

    methods: {
        ...mapActions("app", ["setPreload"]),

        guardarAnalisisEvento() {
            this.loading = true;
            this.investigacionEvento.evento_adverso_id = this.eventoAdverso?.analisis_evento?.id
            this.limpiarError()
            this.$axios.put('/analisis-eventos/' + this.investigacionEvento.evento_adverso_id, this
                .investigacionEvento).then(res => {
                    this.eventoAnalizado = res.data
                    this.$toast.success('Se han registrado las consecuencias correctamente!.');
                    this.emitirDatosConsecuencias()
                }).catch(error => {
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data)
                    }
                }).finally(() => {
                    this.loading = false;
                });
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        asignarDatosConsecuencias() {
            this.investigacionEvento = {
                ...this.eventoAdverso.analisis_evento
            }
        },

        emitirDatosConsecuencias() {
            this.$emit('consecuenciaRegistrada')
            this.asignarDatosCnsecuencias()
        }
    },
};

</script>
