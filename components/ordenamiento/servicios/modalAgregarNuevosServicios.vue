<template>
    <div>
        <v-dialog v-model="mostrarModalAgregarServicios" persistent max-width="1200px">
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-file-plus-outline"
                         class="text-center">
                    <b>Agregar Servicios {{ `- Orden N° ${ordenId}` }}</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formAgregarServicios">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense outlined label="Servicio *" :loading="loading.opcionesCups"
                                                v-model="formAgregarCup.cup"
                                                :items="opcionesCups" item-text="cups" return-object
                                                :rules="[rules.obligatorio]" :search-input.sync="campoBusquedaCup"
                                                no-data-text="Digite el Código o Nombre del Servicio para iniciar la búsqueda..."
                                />
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field
                                    dense
                                    outlined
                                    :disabled="!formAgregarCup.cup"
                                    label="Cantidad *"
                                    type="number"
                                    v-model="formAgregarCup.cantidad"
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
                                            v-model="formAgregarCup.fecha_vigencia"
                                            readonly
                                            :rules="[rules.obligatorio]"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        :min="fechaMinimaVigencia ? fechaMinimaVigencia.toISOString().split('T')[0] : null"
                                        v-model="formAgregarCup.fecha_vigencia"
                                        @input="menu.fecha_vigencia = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow label="Observación(es) *"
                                            v-model="formAgregarCup.observacion"
                                            :rules="[rules.obligatorio, rules.minCaracteres]"/>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn block dark color="primary" @click="agregarServicio">
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
                            <v-data-table dense :items="serviciosParaOrdenar"
                                          :headers="headersServiciosParaOrdenar"
                                          no-data-text="Seleccione servicios para agregar a la orden.">
                                <template v-slot:[`item.acciones`]="{ item, index }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="error" v-on="on" v-bind="attrs"
                                                    @click="eliminarServicio(item,index)">
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
                    <v-btn small dark color="success" :disabled="serviciosParaOrdenar.length === 0"
                           @click="ordenarServicios">Ordenar ({{ serviciosParaOrdenar.length }})
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
        mostrarModalAgregarServicios: {
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
        afiliadoId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            loading: {
                opcionesCups: false,
            },
            menu: {
                fecha_vigencia: false
            },
            formAgregarCup: {
                cup: null,
                cantidad: null,
                fecha_vigencia: null,
                observacion: null
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.',
                valorMinimo: v => v > 0 || 'La cantidad debe ser mayor a 0.',
                valorMaximo: v =>
                    !this.formAgregarCup.cup || v <= this.formAgregarCup.cup.cantidad_max_ordenamiento ||
                    `La cantidad máxima de ordenamiento para este servicio es ${this.formAgregarCup.cup.cantidad_max_ordenamiento}.`,
                minCaracteres: v => !!v && v.length >= 10 || 'Este campo debe tener al menos 10 caracteres.',
            },
            campoBusquedaCup: null,
            opcionesCups: [],
            serviciosParaOrdenar: [],
            headersServiciosParaOrdenar: [
                {text: "N°", value: "cup.id", align: "center"},
                {text: "Código", value: "cup.codigo", align: "center"},
                {text: "Servicio", value: "cup.nombre", align: "center"},
                {text: "Cantidad", value: "cantidad", align: "center"},
                {text: "Fecha de Vigencia", value: "fecha_vigencia", align: "center"},
                {text: "Acciones", value: "acciones", align: "center", sortable: false},
            ],
            mostrarModalErrores: false,
            datosRespuestaError: {}
        };
    },
    watch: {
        campoBusquedaCup(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarOpcionesCups();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.limpiarFormulario();
            this.serviciosParaOrdenar = [];
            this.$emit('update:mostrarModalAgregarServicios', false);
        },

        limpiarFormulario() {
            this.formAgregarCup = {
                cup: null,
                cantidad: null,
                fecha_vigencia: null,
                observacion: null
            };
            this.$refs.formAgregarServicios.resetValidation();
        },

        async buscarOpcionesCups() {
            try {
                this.loading.opcionesCups = true;

                const response = await this.$axios.post('/cup/buscarCupsNombre', {
                    nombre: this.campoBusquedaCup,
                    idAfiliado: this.afiliadoId
                });

                this.opcionesCups = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los Servicios.');
            } finally {
                this.loading.opcionesCups = false;
            }
        },

        agregarServicio() {
            if (!this.$refs.formAgregarServicios.validate()) return;

            const cupExistente = this.serviciosParaOrdenar.some(servicio => servicio.cup.id === this.formAgregarCup.cup.id);

            if (cupExistente) {
                this.$toast.error('Este servicio ya se ha sido agregado.');
                return;
            }

            this.serviciosParaOrdenar.push({...this.formAgregarCup});

            this.limpiarFormulario();
        },

        async eliminarServicio(item, index) {
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
                    this.serviciosParaOrdenar.splice(index, 1);
                    this.$toast.success('Servicio eliminado correctamente.');
                });
            }
        },

        async ordenarServicios() {
            try {
                const data = {
                    orden_id: this.ordenId,
                    servicios: this.serviciosParaOrdenar.map(servicio => {
                        return {
                            cup_id: servicio.cup.id,
                            cantidad: servicio.cantidad,
                            fecha_vigencia: servicio.fecha_vigencia,
                            observacion: servicio.observacion
                        }
                    })
                };

                this.setPreload(true);
                const response = await this.$axios.post('/ordenamiento/agregar-nuevos-servicios', data);

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
};
</script>
