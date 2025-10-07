<template>
    <v-dialog v-model="mostrarModalCambioDireccionamiento" persistent max-width="900px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-truck-plus-outline" class="text-center">
                <b>Cambio de Direccionamiento</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formCambioDireccionamiento">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete dense outlined label="Prestador *" :loading="loading.opcionesReps"
                                            :items="opcionesReps" item-text="nombre" item-value="id"
                                            v-model="formDireccionamiento.rep_id" :rules="[rules.obligatorio]"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="error" dark small @click="cerrarModal">Salir</v-btn>
                <v-btn color="success" dark small @click="enviarFormulario">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
    props: {
        mostrarModalCambioDireccionamiento: {
            type: Boolean,
            default: false
        },
        ordenArticulos: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            formDireccionamiento: {
                rep_id: null
            },
            opcionesReps: [],
            loading: {
                opcionesReps: false
            },
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio."
            }
        }
    },
    watch: {
        mostrarModalCambioDireccionamiento(newValue) {
            if (newValue) {
                this.listarOpcionesRepsMedicamentos();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.formDireccionamiento = {
                rep_id: null
            };
            this.$refs.formCambioDireccionamiento.resetValidation();
            this.$emit('update:mostrarModalCambioDireccionamiento', false);
        },

        async listarOpcionesRepsMedicamentos() {
            try {
                this.loading.opcionesReps = true;

                const response = await this.$axios.post('/reps/listar-reps-direccionamiento-medicamentos');

                this.opcionesReps = response.data.map(rep => {
                    return {
                        id: rep.id,
                        nombre: `${rep.prestadores.nit} - ${rep.nombre} | ${rep.municipio.nombre}`,
                    }
                });

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los prestadores.');
            } finally {
                this.loading.opcionesReps = false;
            }
        },

        async enviarFormulario() {
            if (!this.$refs.formCambioDireccionamiento.validate()) return;
            try {
                const data = {
                    rep_id: this.formDireccionamiento.rep_id,
                    orden_articulos: this.ordenArticulos.map(item => item.id)
                };

                this.setPreload(true);

                await this.$axios.post('/ordenamiento/cambiar-direccionamiento-medicamentos', data);
                this.cerrarModal();
                this.$emit('recargarDatos');

            } catch (error) {
                this.$toast.error('Ocurrió un error al cambiar el direccionamiento.');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
