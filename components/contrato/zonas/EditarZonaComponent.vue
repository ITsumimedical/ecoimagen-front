<template>
    <div>
        <v-container fluid class="pa-0">
            <v-card>
                <v-card-title class="titulo black--text">Editar Zona {{ zonaSeleccionada?.id }} </v-card-title>
                <v-form ref="editarForm">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field label="Nombre *" v-model="zonaSeleccionada.nombre" :rules="[rules.obligatorio]">

                                </v-text-field>
                            </v-col>
                        </v-row>

                        <p>Campo obligatorio *</p>

                        <v-card-actions class="justify-end">
                            <v-btn color="error" @click="cerrarModal">cerrar
                            </v-btn>
                            <v-btn color="boton" dark @click="editarZona()">Guardar</v-btn>
                        </v-card-actions>

                    </v-card-text>
                </v-form>

                <!-- Preload -->
                <template>
                    <div class="text-center">
                        <v-dialog v-model="preload" persistent width="300">
                            <v-card color="primary" dark>
                                <v-card-text>
                                    Tranquilo procesamos tu solicitud !
                                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>

            </v-card>
        </v-container>
    </div>
</template>
<script>
export default {
    props: {
        zonaSeleccionada: {
            type: Object,
            default: () => { },
        },
        crearModal: {
            value: Boolean,
        }
    },

    data() {
        return {
            preload: false,
            zona: {
                nombre: "",
            },

            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio",
            }
        }
    },




    methods: {
        cerrarModal() {
            this.$emit('cerrar')
        },


        async editarZona() {
            try {
                this.preload = true;
                await this.$axios.put(`/zonas/actualizar/${this.zonaSeleccionada.id}`, this.zonaSeleccionada);
                this.$toast.success("Se ha actualizado la Zona Correctamente");
                this.cerrarModal();
                this.$emit("recargarDatos");
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al Actualizar esta Zona");
            } finally {
                this.preload = false;
            }

        },

        // limpiarFormulario() {
        //     this.zonaSeleccionada.nombre = ''
        // },

    }


}
</script>
