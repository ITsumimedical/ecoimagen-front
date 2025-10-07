<template>
    <v-dialog v-model="mostrarModalVerNotas" persistent max-width="600px" scrollable>
        <v-card>
            <v-alert dense text border="left" color="primary" icon="mdi-clipboard-text-clock-outline"
                class="text-center">
                <b>Histórico de Notas</b>
            </v-alert>
            <v-card-text>
                <v-timeline dense>
                    <v-slide-x-reverse-transition group hide-on-leave>
                        <v-timeline-item v-for="(item) in notasAuditoria" :key="item.id" color="primary" fill-dot
                            icon="mdi-note-text-outline">
                            <v-alert dense text color="blue-grey">
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <b>Fecha</b>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        {{ $moment(item.created_at).format('DD/MM/YYYY') ?? '' }}
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <b>Observaciones</b>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        {{ item.observacion ?? '' }}
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <b>Usuario</b>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        {{
                                            [item.user?.operador?.nombre, item.user?.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ') || ''
                                        }}
                                    </v-col>
                                </v-row>
                            </v-alert>
                        </v-timeline-item>
                    </v-slide-x-reverse-transition>
                </v-timeline>

                <!-- Mensaje cuando no hay notas -->
                <v-alert v-if="notasAuditoria.length === 0" dense text type="info" class="text-center mt-3"
                    color="blue-grey">
                    No hay notas de auditoría registradas.
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" dark small @click="cerrarModal">Salir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarModalVerNotas: {
            type: Boolean,
            default: false
        },
        ordenCodigoPropio: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            notasAuditoria: []
        }
    },
    watch: {
        mostrarModalVerNotas(newValue) {
            if (newValue) {
                this.listarNotasAuditoria();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.notasAuditoria = [];
            this.$emit('update:mostrarModalVerNotas', false);
        },

        async listarNotasAuditoria() {
            try {
                this.setPreload(true);

                const response = await this.$axios.get(`/ordenamiento/listar-notas-adicionales-orden-codigo-propio/${this.ordenCodigoPropio.id}`);

                this.notasAuditoria = response.data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las notas');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
