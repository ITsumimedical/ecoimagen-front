<template>
    <v-dialog v-model="mostrarModalEditarCodigoPropio" persistent max-width="1200px" scrollable>
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-swap-horizontal" class="text-center">
                <b>
                    Cambiar Servicio
                    {{
                        ` - ${ordenCodigoPropioSeleccionado?.codigo_propio?.nombre} N° ${ordenCodigoPropioSeleccionado?.id}`
                    }}
                </b>
            </v-alert>
            <v-card-text>
                <v-form ref="formCambiarCodigoPropio">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="mt-2">
                            <v-autocomplete dense outlined label="Nuevo Servicio *"
                                            :loading="loading.opcionesCodigosPropios"
                                            :items="opcionesCodigosPropios" item-text="nombre" item-value="id"
                                            :rules="[rules.obligatorio]"
                                            v-model="formCambio.codigo_propio_id"
                                            :search-input.sync="campoBusquedaCodigoPropio"
                                            no-data-text="Digite el Código o nombre del Código Propio para iniciar la búsqueda."
                                            hint="Digite el Código o Nombre del Código Propio para iniciar la búsqueda."/>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Cantidad *" type="number" min="1"
                                          :rules="[rules.obligatorio]"
                                          v-model="ordenCodigoPropioSeleccionado.cantidad"/>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined auto-grow label="Observación *"
                                        v-model="ordenCodigoPropioSeleccionado.observacion"
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
        ordenCodigoPropio: {
            type: Object,
            default: () => {
            }
        },
        mostrarModalEditarCodigoPropio: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ordenCodigoPropioSeleccionado: {},
            loading: {
                opcionesCodigosPropios: false,
            },
            formCambio: {
                codigo_propio_id: null
            },
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
                minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
            },
            opcionesCodigosPropios: [],
            campoBusquedaCodigoPropio: null
        }
    },
    watch: {
        ordenCodigoPropio: {
            handler(nuevoValor) {
                this.ordenCodigoPropioSeleccionado = JSON.parse(JSON.stringify(nuevoValor))
            },
            immediate: true,
            deep: true
        },
        campoBusquedaCodigoPropio(nuevoValor) {
            if (nuevoValor && nuevoValor.length === 4) {
                this.buscarOpcionesCodigosPropios();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit('update:mostrarModalEditarCodigoPropio', false)
        },

        async buscarOpcionesCodigosPropios() {
            try {
                this.loading.opcionesCodigosPropios = true;

                const {data: {original}} = await this.$axios.get(`/codigo-propio/BuscarCodigoPropio/${this.campoBusquedaCodigoPropio}`)

                this.opcionesCodigosPropios = original

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los Códigos Propios.');
            } finally {
                this.loading.opcionesCodigosPropios = false;
            }
        },

        limpiarFormulario() {
            this.formCambio.codigo_propio_id = null;
            this.ordenCodigoPropioSeleccionado = JSON.parse(JSON.stringify(this.ordenCodigoPropio));
            this.$refs.formCambiarCodigoPropio.resetValidation();
        },

        async enviarFormulario() {
            if (!this.$refs.formCambiarCodigoPropio.validate()) return;
            try {
                this.setPreload(true);

                const payload = {
                    orden_codigo_propio_id: this.ordenCodigoPropioSeleccionado.id,
                    codigo_propio_id: this.formCambio.codigo_propio_id,
                    observacion: this.ordenCodigoPropioSeleccionado.observacion,
                    cantidad: this.ordenCodigoPropioSeleccionado.cantidad
                };

                const response = await this.$axios.patch(`/ordenamiento/cambiar-codigo-propio-orden/${this.ordenCodigoPropioSeleccionado.orden_id}`, payload);

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
