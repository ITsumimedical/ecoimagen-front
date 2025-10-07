<template>
    <div>
        <v-dialog v-model="mostrarModal" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Gestionar N° {{ barreraSelecionada?.id }}</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <EditarAfiliadoComponente v-if="barreraSelecionada?.afiliado"
                                    :afiliado="barreraSelecionada?.afiliado" />
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-row>
                    <v-form>
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <v-alert text dense color="blue-grey" border="left" type="info"
                                    icon="mdi-file-document-alert-outline" class="text-center">
                                    <b>Detalles de la Radicación</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="Nombre - Quien Registra" :value="barreraSelecionada?.user_crea
                                    ? [barreraSelecionada.user_crea.operador?.nombre, barreraSelecionada.user_crea.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                    : 'SIN PERSONA REGISTRA'" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="N° Documento - Quien Registra" :value="barreraSelecionada?.user_crea?.operador?.documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="Correo - Quien Registra" :value="barreraSelecionada?.user_crea?.email || 'SIN CORREO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5 || barreraSelecionada?.estado_id === 18">
                                <v-text-field dense outlined label="Nombre - Quien Cierra" :value="barreraSelecionada?.user_cierra
                                    ? [barreraSelecionada.user_cierra.operador?.nombre, barreraSelecionada.user_cierra.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                    : 'SIN PERSONA CIERRA'" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5 || barreraSelecionada?.estado_id === 18">
                                <v-text-field dense outlined label="N° Documento - Quien Cierra" :value="barreraSelecionada?.user_cierra?.operador?.documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5 || barreraSelecionada?.estado_id === 18">
                                <v-text-field dense outlined label="Correo - Quien Cierra" :value="barreraSelecionada?.user_cierra?.email || 'SIN CORREO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6" v-if="barreraSelecionada?.afiliado">
                                <v-text-field dense outlined label="Nombre Afiliado" :value="nombreAfiliadoSeleccionado"
                                    readonly />
                            </v-col>
                            <v-col cols="12" md="6" sm="6" v-if="barreraSelecionada?.afiliado">
                                <v-text-field dense outlined label="Documento Afiliado" :value="barreraSelecionada?.afiliado?.numero_documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" v-if="barreraSelecionada?.rep">
                                <v-text-field dense outlined label="Centro Atención" :value="barreraSelecionada?.rep?.nombre || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field dense outlined label="Tipo Barrera Acceso"
                                    :value="barreraSelecionada?.barrera" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea filled label="Observación" :value="barreraSelecionada?.observacion"
                                    readonly>
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-checkbox :value="barreraSelecionada?.barrera_general"
                                    label="¿Es una barrera General?" :disabled="true"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-checkbox :value="barreraSelecionada?.prioridad" label="¿Es prioritario?"
                                    :disabled="true"></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarModal">
                        CERRAR
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import EditarAfiliadoComponente from '~/components/afiliado/FormularioAfiliadoComponente.vue';
import { mapActions } from 'vuex'

export default {
    components: {
        EditarAfiliadoComponente
    },

    props: {
        mostrarModal: {
            type: Boolean,
            default: false,
        },
        barreraSelecionada: Object,
    },

    data() {
        return {

        }
    },

    computed: {
        nombreAfiliadoSeleccionado() {
            const a = this.barreraSelecionada?.afiliado || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.$emit("update:mostrarModal", false);
            this.$emit('listar');
        },

    }
}
</script>
