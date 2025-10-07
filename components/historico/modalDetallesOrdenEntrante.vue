<template>
    <v-dialog v-model="mostrarModalDetalles" max-width="800px" persistent scrollable>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Detalles {{ `Orden N° ${ordenSeleccionada?.orden_articulo_interoperabilidad_id ===
                                null
                                ?
                                ordenSeleccionada?.orden_procedimiento_interoperabilidad_id
                                : ordenSeleccionada?.orden_articulo_interoperabilidad_id}` }}</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-chip small dark label :color="ordenSeleccionada?.estado === true ? 'success' : 'error'">
                        <b>
                            {{ ordenSeleccionada?.estado === true ? 'EXITOSO' : 'FALLIDO' }}
                        </b>
                    </v-chip>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text border="left" color="blue-grey" icon="mdi-code-block-braces"
                            class="text-center">
                            <b>Payload</b>
                        </v-alert>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <div class="pa-4"
                            style="border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
                            <pre>{{ ordenSeleccionada?.payload }}</pre>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        mostrarModalDetalles: {
            type: Boolean,
            default: false
        },
        ordenSeleccionada: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {}
    },
    methods: {
        cerrarModal() {
            this.$emit("update:mostrarModalDetalles", false);
        },
    }
}
</script>