<template>
    <v-dialog v-model="mostrarModalErrores" persistent max-width="900px" scrollable>
        <v-card>
            <v-alert text dense border="left" type="error" icon="mdi-truck-plus-outline" class="text-center">
                <b>Errores en el Cambio de Direccionamiento</b>
            </v-alert>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text type="info" color="blue-grey" border="left"
                                 class="text-center">
                            <b>{{ datosRespuestaError.mensaje ?? '' }}</b>
                        </v-alert>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-for="(item, index) in datosRespuestaError.elementos_invalidos"
                           :key="index">
                        <v-alert dense text type="info" color="warning" border="left">
                            {{ item.codigo }} - {{ item.nombre }}
                        </v-alert>
                        <v-divider></v-divider>
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
    methods: {
        cerrarModal() {
            this.$emit('update:mostrarModalErrores', false);
        }
    }
}
</script>
