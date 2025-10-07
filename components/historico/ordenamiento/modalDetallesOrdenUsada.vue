<template>
    <v-dialog v-model="mostrarModalDetallesOrdenUsada" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Detalles de la Orden Usada</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>

                </v-toolbar>
            </v-card-title>
            <v-card-text v-if="detallesOrden">
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" sm="6" md="6">
                            <b>Fecha de uso</b>
                            <div>
                                {{ $moment(detallesOrden?.created_at).format('DD/MM/YYYY') || '' }}
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <b>Usada por</b>
                            <div>
                                {{ detallesOrden?.user?.operador?.nombre_completo || '' }}
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-divider />
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" sm="6" md="6">
                            <b>Fecha de consulta</b>
                            <div>
                                {{ $moment(detallesOrden?.orden_procedimiento?.orden?.consulta?.fecha_hora_inicio).format('DD/MM/YYYY') || '' }}
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <b>Especialidad</b>
                            <div>
                                {{ detallesOrden?.orden_procedimiento?.orden?.consulta?.especialidad?.nombre || '' }}
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="cerrarModal">
                    Salir
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: {
        mostrarModalDetallesOrdenUsada: {
            type: Boolean,
            default: false
        },
        ordenSeleccionada: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            detallesOrden: null
        }
    },
    watch: {
        mostrarModalDetallesOrdenUsada(nuevoValor) {
            if (nuevoValor) {
                this.listarDetallesConsulta();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.detallesOrden = null;
            this.$emit("update:mostrarModalDetallesOrdenUsada", false);
        },

        async listarDetallesConsulta() {
            try {
                this.setPreload(true);
                const { data } = await this.$axios.get(`/ordenamiento/listar-detalles-orden-usada/${this.ordenSeleccionada?.id}`);
                this.detallesOrden = data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los detalles de la consulta');
            } finally {
                this.setPreload(false);
            }

        }
    },
}
</script>