<template>
    <div>
        <v-dialog v-model="mostrarModalAgregarCodigosPropios" persistent max-width="1200px">
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-file-plus-outline"
                         class="text-center">
                    <b>Agregar Servicios {{ `- Orden N° ${ordenId}` }}</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formAgregarCodigosPropios">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense outlined label="Servicio *"
                                                :loading="loading.opcionesCodigosPropios"
                                                v-model="formAgregarCodigoPropio.codigo_propio"
                                                :items="opcionesCodigosPropios" item-text="cups" return-object
                                                :rules="[rules.obligatorio]"
                                                :search-input.sync="campoBusquedaCodigoPropio"
                                                no-data-text="Digite el Código o Nombre del Servicio para iniciar la búsqueda..."
                                />
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field
                                    dense
                                    outlined
                                    :disabled="!formAgregarCodigoPropio.codigo_propio"
                                    label="Cantidad *"
                                    type="number"
                                    v-model="formAgregarCodigoPropio.cantidad"
                                    :rules="[rules.obligatorio, rules.valorMinimo, rules.valorMaximo]"
                                />
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-menu
                                    dense
                                    v-model="menu.fecha_vigencia"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            dense
                                            outlined
                                            label="Vigencia Desde *"
                                            append-icon="mdi-calendar"
                                            v-bind="attrs"
                                            v-on="on"
                                            v-model="formAgregarCodigoPropio.fecha_vigencia"
                                            readonly
                                            :rules="[rules.obligatorio]"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        :min="fechaMinimaVigencia ? fechaMinimaVigencia.toISOString().split('T')[0] : null"
                                        v-model="formAgregarCodigoPropio.fecha_vigencia"
                                        @input="menu.fecha_vigencia = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow label="Observación(es) *"
                                            v-model="formAgregarCodigoPropio.observacion"
                                            :rules="[rules.obligatorio, rules.minCaracteres]"/>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn block dark color="primary" @click="agregarCodigoPropio">
                                    Agregar
                                    <v-icon dark right>mdi-plus-circle-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="mt-4">
                            <v-divider/>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :items="codigosPropiosParaOrdenar"
                                          :headers="headersCodigosPropiosParaOrdenar"
                                          no-data-text="Seleccione servicios para agregar a la orden.">
                                <template v-slot:[`item.acciones`]="{ item, index }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="error" v-on="on" v-bind="attrs"
                                                    @click="eliminarCodigoPropio(item,index)">
                                                mdi-close-circle-outline
                                            </v-icon>
                                        </template>
                                        <span>Eliminar</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                    <v-btn small dark color="success" :disabled="codigosPropiosParaOrdenar.length === 0"
                           @click="ordenarCodigosPropios">Ordenar ({{ codigosPropiosParaOrdenar.length }})
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <modal-errores-agregar-servicios :mostrar-modal-errores.sync="mostrarModalErrores"
                                         :datos-respuesta-error="datosRespuestaError"/>
    </div>
</template>
<script>
import {mapActions} from "vuex";
import ModalErroresAgregarServicios from "~/components/ordenamiento/servicios/modalErroresAgregarServicios.vue";

export default {
    components: {ModalErroresAgregarServicios},
    props: {
        mostrarModalAgregarCodigosPropios: {
            type: Boolean,
            default: false
        },
        ordenId: {
            type: Number,
            default: null
        },
        fechaMinimaVigencia: {
            type: Date,
            default: null
        },
    },
    data() {
        return {
            loading: {
                opcionesCodigosPropios: false
            },
            menu: {
                fecha_vigencia: false
            },
            formAgregarCodigoPropio: {
                codigo_propio: null,
                cantidad: null,
                fecha_vigencia: null,
                observacion: null
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.',
                valorMinimo: v => v > 0 || 'La cantidad debe ser mayor a 0.',
                valorMaximo: v =>
                    !this.formAgregarCodigoPropio.codigo_propio || v <= this.formAgregarCodigoPropio.codigo_propio.cantidad_max_ordenamiento ||
                    `La cantidad máxima de ordenamiento para este servicio es ${this.formAgregarCodigoPropio.codigo_propio.cantidad_max_ordenamiento}.`,
                minCaracteres: v => !!v && v.length >= 10 || 'Este campo debe tener al menos 10 caracteres.',
            },
            campoBusquedaCodigoPropio: null,
            opcionesCodigosPropios: [],
            codigosPropiosParaOrdenar: [],
            headersCodigosPropiosParaOrdenar: [
                {text: "N°", value: "cup.id", align: "center"},
                {text: "Código", value: "codigo_propio.codigo", align: "center"},
                {text: "Servicio", value: "codigo_propio.nombre", align: "center"},
                {text: "Cantidad", value: "cantidad", align: "center"},
                {text: "Fecha de Vigencia", value: "fecha_vigencia", align: "center"},
                {text: "Acciones", value: "acciones", align: "center", sortable: false},
            ],
            mostrarModalErrores: false,
            datosRespuestaError: {}
        }
    },
    watch: {
        campoBusquedaCodigoPropio(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarOpcionesCodigosPropios();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.codigosPropiosParaOrdenar = [];
            this.$emit('update:mostrarModalAgregarCodigosPropios', false);
        },

        limpiarFormulario() {
            this.formAgregarCodigoPropio = {
                codigo_propio: null,
                cantidad: null,
                fecha_vigencia: null,
                observacion: null
            };
            this.$refs.formAgregarCodigosPropios.resetValidation();
        },

        async buscarOpcionesCodigosPropios() {
            try {
                this.loading.opcionesCodigosPropios = true;

                const response = await this.$axios.get(`/codigo-propio/BuscarCodigoPropio/${this.campoBusquedaCodigoPropio}`)

                this.opcionesCodigosPropios = response.data.original;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los Servicios.');
            } finally {
                this.loading.opcionesCodigosPropios = false;
            }
        },

        agregarCodigoPropio() {
            if (!this.$refs.formAgregarCodigosPropios.validate()) return;

            const codigoPropioExistente = this.codigosPropiosParaOrdenar.some(servicio => servicio.codigo_propio.id === this.formAgregarCodigoPropio.codigo_propio.id);

            if (codigoPropioExistente) {
                this.$toast.error('Este servicio ya se ha sido agregado.');
                return;
            }

            this.codigosPropiosParaOrdenar.push({...this.formAgregarCodigoPropio});

            this.limpiarFormulario();
        },

        async eliminarCodigoPropio(item, index) {
            const response = await this.$swal({
                title: 'Eliminar',
                text: '¿Está segur@ de eliminar el servicio?',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (response.value) {
                this.$nextTick(() => {
                    this.codigosPropiosParaOrdenar.splice(index, 1);
                    this.$toast.success('Servicio eliminado correctamente.');
                });
            }
        },

        async ordenarCodigosPropios() {
            try {
                const data = {
                    orden_id: this.ordenId,
                    codigos_propios: this.codigosPropiosParaOrdenar.map(item => {
                        return {
                            codigo_propio_id: item.codigo_propio.id,
                            cantidad: item.cantidad,
                            fecha_vigencia: item.fecha_vigencia,
                            observacion: item.observacion
                        }
                    })
                };

                this.setPreload(true);
                const response = await this.$axios.post('/ordenamiento/agregar-nuevos-codigos-propios', data);

                this.$toast.success(response.data.mensaje ?? 'Servicios agregados correctamente.');

                this.$emit('recargarDatos');
                this.cerrarModal();

            } catch (error) {
                if (error.response && error.response.data.error) {
                    try {
                        const datosRespuestaError = JSON.parse(error.response.data.error);

                        if (datosRespuestaError.error) {
                            this.abrirModalErrores(datosRespuestaError);
                        }
                    } catch (parseError) {
                        console.error("Error al parsear los errores del servidor:", parseError);
                        this.$toast.error('Ocurrió un error inesperado al procesar los errores.');
                    }
                } else {
                    this.$toast.error('Ocurrió un error al agregar los servicios.');
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
