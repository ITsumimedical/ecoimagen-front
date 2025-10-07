<template>
    <v-dialog v-model="mostrarModalErrores" persistent max-width="900px" scrollable>
        <v-card>
            <v-alert text dense border="left" type="error" icon="mdi-file-alert-outline" class="text-center">
                <b>Errores al agregar Servicios</b>
            </v-alert>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12">
                        <v-alert dense text type="info" color="blue-grey" border="left" class="text-center">
                            <b>{{ datosRespuestaError.error ?? 'Se encontraron errores en la solicitud.' }}</b>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" v-if="tieneErrores">
                        <v-list dense>
                            <template v-for="(item, index) in listaErrores">
                                <v-list-item :key="index">
                                    <v-list-item-icon>
                                        <v-icon color="warning">mdi-alert-circle-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="font-weight-bold">
                                            {{ item.codigo }} - {{ item.nombre }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle v-if="item.cantidad_maxima">
                                            Cantidad máxima permitida: <b>{{ item.cantidad_maxima }}</b> |
                                            Intentado: <b>{{ item.cantidad_intentada }}</b>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider v-if="index !== listaErrores.length - 1"></v-divider>
                            </template>
                        </v-list>
                    </v-col>

                    <v-col cols="12" v-else>
                        <v-alert dense text type="success" color="green" border="left" class="text-center">
                            No se encontraron errores.
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="error" dark small @click="cerrarModal">Salir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarModalErrores: {
            type: Boolean,
            default: false
        },
        datosRespuestaError: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        listaErrores() {
            return [
                ...(this.datosRespuestaError.servicios_duplicados ?? []),
                ...(this.datosRespuestaError.servicios_excedidos ?? [])
            ];
        },
        tieneErrores() {
            return this.listaErrores.length > 0;
        }
    },
    methods: {
        cerrarModal() {
            this.$emit('update:mostrarModalErrores', false);
        }
    }
}
</script>
