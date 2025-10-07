<template>
    <div>
        <v-dialog v-model="mostrarModalGestionarCums" persistent max-width="900px" scrollable>
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-medication-outline" class="text-center">
                    <b>Gestionar CUM's {{ ` - Tarifa N° ${tarifaSeleccionada?.id}` }}</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formularioAgregarCums" class="mt-2">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense outlined label="CUM *" :items="opcionesCums"
                                    v-model="formAgregarCum.cum_validacion" :loading="loading.opcionesCums"
                                    :search-input.sync="campoBusquedaCum"
                                    no-data-text="Digite el CUM Validación para iniciar búsqueda." item-text="nombre"
                                    item-value="cum_validacion" :rules="[rules.obligatorio]">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field dense outlined prefix="$" label="Precio *" type="number"
                                    v-model="formAgregarCum.precio"
                                    :rules="[rules.obligatorio, rules.noNegativo]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn block dark color="success" @click="enviarFormulario"
                                    :loading="loading.cumsTarifa">
                                    Agregar
                                    <v-icon right>mdi-plus-circle-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="mt-4">
                            <v-divider />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headersCumsTarifa" :items="cumsTarifa"
                                :loading="loading.cumsTarifa" loading-text="Cargando... Por favor espere"
                                no-data-text="Sin datos para mostrar" :items-per-page="paginacion.cantidadRegistros"
                                hide-default-footer disable-pagination>
                                <template v-slot:[`item.creado_por`]="{ item }">
                                    {{
                                        `${item.creado_por?.operador?.nombre || ''} ${item.creado_por?.operador?.apellido ||
                                            ''}`.trim() || 'Sin nombre'
                                    }}
                                </template>
                                <template v-slot:[`item.descripcionCum`]="{ item }">
                                    <td class="text-center">
                                        {{ item.cum_validacion }}
                                    </td>
                                </template>
                                <template v-slot:[`item.precio`]="{ item }">
                                    <v-btn depressed text small block @click="abrirModalCambiarPrecio(item)"
                                        :disabled="!$can('farmacia.contratos.cambiarPrecioCumTarifa')">
                                        {{ formatearMoneda(item.precio) }}
                                    </v-btn>
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <v-tooltip bottom v-if="$can('farmacia.contratos.eliminarCumTarifa')">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="error" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="eliminarCumTarifa(item)">
                                                mdi-close-circle
                                            </v-icon>
                                        </template>
                                        <span>Eliminar</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="my-4">
                            <v-divider />
                        </v-col>
                        <v-col cols="12" md="10" sm="10">
                            <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                                @input="listarCumsTarifa()"></v-pagination>
                        </v-col>
                        <v-col cols="12" md="2" sm="2">
                            <v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
                                outlined label="Cantidad" @change="listarCumsTarifa()"></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Cambiar precio -->
        <modal-cambiar-precio-cum-tarifa :cum-tarifa-seleccionado="cumTarifaSeleccionado"
            :mostrar-modal-cambiar-precio.sync="mostrarModalCambiarPrecio" @recargarDatos="listarCumsTarifa" />

    </div>
</template>
<script>
import { mapActions } from "vuex";
import { formatearMoneda } from "@/utils/formatearMoneda";
import ModalCambiarPrecioCumTarifa from "~/components/farmacia/contratos/modalCambiarPrecioCumTarifa.vue";

export default {
    components: { ModalCambiarPrecioCumTarifa },
    props: {
        mostrarModalGestionarCums: {
            type: Boolean,
            default: false
        },
        tarifaSeleccionada: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            loading: {
                opcionesCums: false,
                cumsTarifa: false
            },
            opcionesCums: [],
            campoBusquedaCum: null,
            formAgregarCum: {
                cum_validacion: null,
                precio: '',
            },
            rules: {
                obligatorio: value => !!value || 'Este campo es obligatorio.',
                noNegativo: value => value >= 0 || 'Este campo no puede ser negativo.',
            },
            cumsTarifa: [],
            headersCumsTarifa: [
                { text: 'N°', value: 'id', align: 'center' },
                { text: 'CUM', value: 'descripcionCum', align: 'center' },
                { text: 'Precio', value: 'precio', align: 'center' },
                { text: 'Registrado Por', value: 'creado_por', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            mostrarModalCambiarPrecio: false,
            cumTarifaSeleccionado: {}
        }
    },
    watch: {
        campoBusquedaCum(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarOpcionesCums();
            }
        },
        mostrarModalGestionarCums(newValue) {
            if (newValue) {
                this.listarCumsTarifa();
            }
        }
    },
    methods: {
        formatearMoneda,
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.cumsTarifa = [];
            this.limpiarFormulario();
            this.$emit('update:mostrarModalGestionarCums', false)
        },

        limpiarFormulario() {
            this.formAgregarCum = {
                cum_validacion: null,
                precio: '',
            };

            this.$refs.formularioAgregarCums.resetValidation();
        },

        async enviarFormulario() {
            if (!this.$refs.formularioAgregarCums.validate()) return;
            try {
                const data = {
                    ...this.formAgregarCum,
                    tarifa_id: this.tarifaSeleccionada.id
                };

                this.setPreload(true);

                await this.$axios.post('/tarifas-cums/crear-cum-tarifa', data);

                this.$toast.success('Datos guardados correctamente');

                await this.listarCumsTarifa();

                this.limpiarFormulario();

            } catch (error) {
                this.$toast.error(error?.response?.data?.error ?? 'Ocurrió un error al guardar los datos');
            } finally {
                this.setPreload(false);
            }
        },

        async buscarOpcionesCums() {
            try {

                this.loading.opcionesCums = true;
                const response = await this.$axios.get(`/cum/BuscarCum/${this.campoBusquedaCum}`);

                this.opcionesCums = response.data.original.map(cum => {
                    return {
                        id: cum.id,
                        cum_validacion: cum.cum_validacion,
                        nombre: `${cum.cum_validacion} ${cum.producto} (${cum.titular})`,
                    }
                });

            } catch (error) {
                this.$toast.error('Ocurrió un error al cargar los CUMS');
            } finally {
                this.loading.opcionesCums = false;
            }
        },

        async listarCumsTarifa() {
            try {
                this.loading.cumsTarifa = true;

                // Construir la URL con los parámetros
                const url = `/tarifas-cums/listar-cums-tarifa?` +
                    `pagina=${this.paginacion.pagina}` +
                    `&cantidadRegistros=${this.paginacion.cantidadRegistros}` +
                    `&tarifa=${this.tarifaSeleccionada?.id || ''}`;

                // Realizar la solicitud
                const response = await this.$axios.get(url);

                // Procesar la respuesta
                this.cumsTarifa = response.data.data;
                this.paginacion.total = response.data.last_page;
            } catch (error) {
                this.$toast.error('Ocurrió un error al cargar los CUMS de esta tarifa');
            } finally {
                this.loading.cumsTarifa = false;
            }
        },

        async eliminarCumTarifa(cumTarifa) {
            try {
                const response = await this.$swal({
                    title: '¿Está Seguro(a)?',
                    text: "Esta opción eliminará el CUM de la tarifa",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                });

                if (response.value) {
                    this.setPreload(true);

                    await this.$axios.delete(`/tarifas-cums/eliminar-cum-tarifa/${cumTarifa.id}`);

                    this.$toast.success('CUM eliminado correctamente');

                    await this.listarCumsTarifa();
                }

            } catch (error) {
                this.$toast.error('Ocurrió un error al eliminar el CUM de la tarifa');
            } finally {
                this.setPreload(false);
            }
        },

        abrirModalCambiarPrecio(cumTarifa) {
            this.cumTarifaSeleccionado = cumTarifa;
            this.mostrarModalCambiarPrecio = true
        }
    }
}
</script>
