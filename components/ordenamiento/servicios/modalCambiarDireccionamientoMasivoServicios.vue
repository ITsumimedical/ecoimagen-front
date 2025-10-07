<template>
    <div>
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
                                                v-model="formDireccionamiento.rep_id" :rules="[rules.obligatorio]"
                                                :search-input.sync="campoBusquedaRep"
                                                no-data-text="Digite el NIT o el Nombre del Prestador para iniciar la búsqueda."
                                />
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

        <!-- Modal de Errores -->
        <modal-errores-cambio-direccionamiento :datos-respuesta-error="datosRespuestaError"
                                               :mostrar-modal-errores.sync="mostrarModalErrores"/>

    </div>
</template>
<script>
import {mapActions} from "vuex";
import ModalErroresCambioDireccionamiento from "~/components/ordenamiento/modalErroresCambioDireccionamiento.vue";

export default {
    components: {ModalErroresCambioDireccionamiento},
    props: {
        mostrarModalCambioDireccionamiento: {
            type: Boolean,
            default: false
        },
        ordenProcedimientos: {
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
            },
            campoBusquedaRep: null,
            datosRespuestaError: {},
            mostrarModalErrores: false
        }
    },
    watch: {
        campoBusquedaRep(newValue) {
            if (newValue && newValue.length === 5) {
                this.listarOpcionesRepsServicios();
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

        async listarOpcionesRepsServicios() {
            try {
                this.loading.opcionesReps = true;

                const response = await this.$axios.post('/reps/listar-reps-direccionamiento-servicios', {
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
                    orden_procedimientos: this.ordenProcedimientos.map(item => item.id)
                };

                this.setPreload(true);

                await this.$axios.post('/ordenamiento/cambiar-direccionamiento-servicios', data);
                this.cerrarModal();
                this.$emit('recargarDatos');

            } catch (error) {
                if (error.response && error.response.data.error) {
                    try {
                        const datosRespuestaError = JSON.parse(error.response.data.error);

                        if (datosRespuestaError.mensaje && datosRespuestaError.mensaje.length > 0) {
                            this.abrirModalErrores(datosRespuestaError);
                        }

                    } catch (parseError) {
                        console.error("Error al parsear los errores del servidor:", parseError);
                        this.$toast.error('Ocurrió un error inesperado al procesar los errores.');
                    }
                } else {
                    this.$toast.error('Ocurrió un error al cambiar el direccionamiento.');
                }
            } finally {
                this.setPreload(false);
            }
        },

        abrirModalErrores(datosRespuestaError) {
            this.datosRespuestaError = datosRespuestaError;
            this.mostrarModalErrores = true;
        }
    }
}
</script>
