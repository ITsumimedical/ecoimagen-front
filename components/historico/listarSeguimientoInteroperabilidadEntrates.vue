<template>
    <div>

        <v-row dense class="mt-2">
            <v-col cols="12" sm="6" md="3">
                <v-select dense outlined label="Estado" :items="opcionesEstados" v-model="filtros.estado" />
            </v-col>
            <v-col cols="12" sm="6" md="7">
                <v-text-field dense outlined label="N° Orden FOMAG" v-model="filtros.orden_interoperabilidad_id" />
            </v-col>
            <v-col cols="12" sm="12" md="2" class="text-center">
                <v-btn small dark color="primary" @click="listarRegistrosInteroperabilidadEntrantes()">Buscar</v-btn>
                <v-btn small dark color="warning" @click="limpiarFiltros()">Limpiar</v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-divider />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headersRegistrosInteroperabilidad" :items="registrosInteroperabilidad"
                    :loading="loading.registrosInteroperabilidad" loading-text="Cargando... Por favor espere."
                    disable-pagination hide-default-footer no-data-text="No se encontraron resultados."
                    :items-per-page="paginacion.cantidadRegistros">
                    <template v-slot:[`item.consecutivo_fomag`]="{ item }">
                        {{ item.orden_articulo_interoperabilidad_id === null ?
                            item.orden_procedimiento_interoperabilidad_id
                            : item.orden_articulo_interoperabilidad_id }}
                    </template>
                    <template v-slot:[`item.tipo_orden`]="{ item }">
                        <v-chip small dark label
                            :color="item.orden_articulo_interoperabilidad_id === null ? 'success' : 'primary'">
                            <b>
                                {{ item.orden_articulo_interoperabilidad_id === null ? 'SERVICIO' : 'MEDICAMENTO' }}
                            </b>
                        </v-chip>
                    </template>
                    <template v-slot:[`item.estado`]="{ item }">
                        <v-chip small dark label :color="item.estado === true ? 'success' : 'error'">
                            <b>
                                {{ item.estado === true ? 'EXITOSO' : 'FALLIDO' }}
                            </b>
                        </v-chip>
                    </template>
                    <template v-slot:[`item.mensaje_error`]="{ item }">
                        {{ item.mensaje_error ?? ' - ' }}
                    </template>
                    <template v-slot:[`item.fecha`]="{ item }">
                        {{ $moment(item.created_at).format("YYYY-MM-DD HH:mm:ss") ?? ' - ' }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-bind="attrs" v-on="on" color="primary" @click="abrirModalDetalles(item)">
                                    mdi-code-json
                                </v-icon>
                            </template>
                            <span>Ver Detalles</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="my-4">
                <v-divider />
            </v-col>
            <v-col cols="12" md="10" sm="10">
                <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                    @input="listarRegistrosInteroperabilidadEntrantes()"></v-pagination>
            </v-col>
            <!-- <v-col cols="12" md="2" sm="2">
                <v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]" outlined
                    label="Cantidad" @change="listarRegistrosInteroperabilidadEntrantes()"></v-select>
            </v-col> -->
        </v-row>

        <!-- Detalles -->
        <modal-detalles-orden-entrante :mostrar-modal-detalles.sync="mostrarModalDetalles"
            :orden-seleccionada="ordenSeleccionada" />
    </div>
</template>
<script>
import ModalDetallesOrdenEntrante from '@/components/historico/modalDetallesOrdenEntrante.vue';

export default {
    components: {
        ModalDetallesOrdenEntrante
    },
    data() {
        return {
            loading: {
                registrosInteroperabilidad: false
            },
            filtros: {
                estado: null,
                orden_interoperabilidad_id: null
            },
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            registrosInteroperabilidad: [],
            opcionesEstados: [
                { text: 'TODAS', value: null },
                { text: 'EXITOSAS', value: true },
                { text: 'FALLIDAS', value: false },
            ],
            headersRegistrosInteroperabilidad: [
                { text: "N° Orden - FOMAG", value: 'orden_interoperabilidad_id', align: 'center' },
                { text: "Fecha", value: 'fecha', align: 'center' },
                { text: "N° Consecutivo - FOMAG", value: 'consecutivo_fomag', align: 'center' },
                { text: "Tipo de Orden", value: 'tipo_orden', align: 'center' },
                { text: "Estado - Recepción", value: 'estado', align: 'center' },
                { text: "Mensaje de Error", value: 'mensaje_error', align: 'center' },
                { text: "Acciones", value: 'acciones', align: 'center' },
            ],
            mostrarModalDetalles: false,
            ordenSeleccionada: {}
        }
    },
    mounted() {
        this.listarRegistrosInteroperabilidadEntrantes();
    },
    methods: {
        async listarRegistrosInteroperabilidadEntrantes() {
            try {
                this.loading.registrosInteroperabilidad = true;

                const { data: { data: registros, last_page } } = await this.$axios.get('/registro-recepcion-ordenes-interoperabilidad/listar-seguimiento', {
                    params: {
                        pagina: this.paginacion.pagina,
                        cantidadRegistros: this.paginacion.cantidadRegistros,
                        ...this.filtros
                    }
                });

                this.registrosInteroperabilidad = registros;
                this.paginacion.total = last_page;

            } catch (error) {
                this.$toast.error('Ocurrio un error al listar los registros.');
            } finally {
                this.loading.registrosInteroperabilidad = false;
            }
        },

        limpiarFiltros() {
            this.filtros = {
                estado: null,
                orden_interoperabilidad_id: null
            };

            this.listarRegistrosInteroperabilidadEntrantes();
        },

        abrirModalDetalles(item) {
            this.ordenSeleccionada = item;
            this.mostrarModalDetalles = true;
        }
    }
}
</script>