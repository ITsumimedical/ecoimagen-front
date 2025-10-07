<template>
    <v-dialog v-model="mostrarModalCambiarDireccionamiento" persistent max-width="900px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-truck-plus-outline" class="text-center">
                <b>Cambio de Direccionamiento
                    {{ ` - ${ordenCodigoPropio?.codigo_propio?.nombre} N° ${ordenCodigoPropio?.id}` }}</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formCambioDireccionamiento">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete dense outlined label="Prestador *" :loading="loading.opcionesReps"
                                            :items="opcionesReps" item-text="nombre" item-value="id"
                                            v-model="formDireccionamiento.rep_id" :rules="[rules.obligatorio]"
                                            :search-input.sync="campoBusquedaRep"
                                            no-data-text="Digite el NIT o el Nombre del Prestador para iniciar la búsqueda."
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
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
        mostrarModalCambiarDireccionamiento: {
            type: Boolean,
            default: false
        },
        ordenCodigoPropio: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            loading: {
                opcionesReps: false
            },
            formDireccionamiento: {
                rep_id: null
            },
            opcionesReps: [],
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio."
            },
            campoBusquedaRep: null
        }
    },
    watch: {
        campoBusquedaRep(newValue) {
            if (newValue && newValue.length === 5) {
                this.listarOpcionesRepsCambioDireccionamiento();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit('update:mostrarModalCambiarDireccionamiento', false);
        },

        limpiarFormulario() {
            this.formDireccionamiento = {
                rep_id: null
            };

            this.$refs.formCambioDireccionamiento.resetValidation();
        },

        async listarOpcionesRepsCambioDireccionamiento() {
            try {
                this.loading.opcionesReps = true;

                const response = await this.$axios.post('/reps/listar-reps-direccionamiento-codigos-propios', {
                    nombre_nit: this.campoBusquedaRep
                });

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
                    orden_codigos_propios: [this.ordenCodigoPropio.id]
                };

                this.setPreload(true);
                await this.$axios.post('/ordenamiento/cambiar-direccionamiento-codigos-propios', data);
                this.cerrarModal();
                this.$emit('recargarDatos');

            } catch (error) {
                console.log({error})
                this.$toast.error('Ocurrio un error al cambiar el direccionamiento.');
            } finally {
                this.setPreload(false);
            }
        }

    }
}
</script>
