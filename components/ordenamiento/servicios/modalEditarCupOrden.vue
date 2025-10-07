<template>
    <v-dialog v-model="mostrarModalEditarCup" persistent max-width="1200px" scrollable>
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-swap-horizontal" class="text-center">
                <b>
                    Cambiar Servicio
                    {{ ` - ${ordenProcedimientoSeleccionado?.cup?.nombre} N° ${ordenProcedimientoSeleccionado?.id}` }}
                </b>
            </v-alert>
            <v-card-text>
                <v-form ref="formCambiarCup">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="mt-2">
                            <v-autocomplete dense outlined label="Nuevo Servicio *" :loading="loading.opcionesCups"
                                            :items="opcionesCups" item-text="nombre" item-value="id"
                                            :rules="[rules.obligatorio]"
                                            v-model="formCambio.cup_id" :search-input.sync="campoBusquedaCup"
                                            no-data-text="Digite el Código o nombre del CUPS para iniciar la búsqueda."
                                            hint="Digite el Código o Nombre del CUPS para iniciar la búsqueda."/>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Cantidad *" type="number" min="1"
                                          :rules="[rules.obligatorio]"
                                          v-model="ordenProcedimientoSeleccionado.cantidad"/>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined auto-grow label="Observación *"
                                        v-model="ordenProcedimientoSeleccionado.observacion"
                                        :rules="[rules.obligatorio,rules.minCaracteres]"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                <v-btn small dark color="success" @click="enviarFormulario">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import {mapActions} from "vuex";

export default {
    props: {
        ordenProcedimiento: {
            type: Object,
            default: () => {
            }
        },
        mostrarModalEditarCup: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ordenProcedimientoSeleccionado: {},
            loading: {
                opcionesCups: false
            },
            formCambio: {
                cup_id: null,
            },
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
                minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
            },
            opcionesCups: [],
            campoBusquedaCup: null
        }
    },
    watch: {
        ordenProcedimiento: {
            handler(nuevoValor) {
                this.ordenProcedimientoSeleccionado = JSON.parse(JSON.stringify(nuevoValor));
            },
            immediate: true,
            deep: true
        },

        campoBusquedaCup(nuevoValor) {
            if (nuevoValor && nuevoValor.length === 5) {
                this.buscarOpcionesCups();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit('update:mostrarModalEditarCup', false);
        },

        async buscarOpcionesCups() {
            try {
                this.loading.opcionesCups = true;

                const {data: {original}} = await this.$axios.get(`/cup/BuscarCup/${this.campoBusquedaCup}`);

                this.opcionesCups = original;

            } catch (error) {
                this.$toast.error('Ocurrió un error al buscar los CUPS.')
            } finally {
                this.loading.opcionesCups = false;
            }
        },

        limpiarFormulario() {
            this.formCambio.cup_id = null;
            this.ordenProcedimientoSeleccionado = JSON.parse(JSON.stringify(this.ordenProcedimiento));
            this.$refs.formCambiarCup.resetValidation();
        },

        async enviarFormulario() {
            if (!this.$refs.formCambiarCup.validate()) return;
            try {
                this.setPreload(true);

                const payload = {
                    orden_procedimiento_id: this.ordenProcedimientoSeleccionado.id,
                    cup_id: this.formCambio.cup_id,
                    observacion: this.ordenProcedimientoSeleccionado.observacion,
                    cantidad: this.ordenProcedimientoSeleccionado.cantidad
                };

                const response = await this.$axios.patch(`/ordenamiento/cambiar-servicio-orden/${this.ordenProcedimientoSeleccionado.orden_id}`, payload);

                this.$toast.info(response.data.mensaje ?? 'Servicio actualizado correctamente.');
                this.$emit('recargarDatos');
                this.cerrarModal();

            } catch (error) {
                this.$swal({
                    title: 'Error',
                    text: error?.response?.data?.error ?? 'Ocurrió un error al cambiar el servicio.',
                    type: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Entendido'
                })
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
