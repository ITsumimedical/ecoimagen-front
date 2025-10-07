<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Autorización - Servicios</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="2" md="2">
                        <v-menu dense v-model="menu.fecha_inicial" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="filtros.fecha_inicial" label="Fecha Inicial *" prepend-icon=""
                                    append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"
                                    outlined></v-text-field>
                            </template>
                            <v-date-picker v-model="filtros.fecha_inicial"
                                @input="menu.fecha_inicial = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-menu dense v-model="menu.fecha_final" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="filtros.fecha_final" label="Fecha Final *" prepend-icon=""
                                    append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"
                                    outlined></v-text-field>
                            </template>
                            <v-date-picker v-model="filtros.fecha_final"
                                @input="menu.fecha_final = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="filtros.orden_id" label="N° Orden" outlined
                            append-icon="mdi-file-search-outline" />
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="filtros.numero_documento" label="N° Documento" outlined
                            append-icon="mdi-account-credit-card-outline" />
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-autocomplete dense outlined label="IPS" item-text="nombre" item-value="id"
                            v-model="filtros.ips_id" :items="opcionesIps"
                            no-data-text="Escriba el Nombre o NIT de la IPS para buscar." :loading="loading.opcionesIps"
                            :search-input.sync="campoBusquedaIps" />
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-autocomplete dense outlined label="Departamento" item-text="nombre" item-value="id"
                            v-model="filtros.departamento_id" :items="opcionesDepartamentos"
                            no-data-text="Sin datos para mostrar." :loading="loading.opcionesDepartamentos" />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" align="right">
                        <v-btn small dark color="primary" @click="listarOrdenes()">Buscar</v-btn>
                        <v-btn small dark color="warning" @click="limpiarFiltros()">Limpiar Filtros</v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-divider />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :headers="headersOrdenes" :items="ordenes" :loading="loading.ordenes"
                            loading-text="Cargando... Por favor espere." no-data-text="Sin datos para mostrar."
                            :items-per-page="paginacion.cantidadRegistros" disable-pagination hide-default-footer>
                            <template v-slot:[`item.tipoOrden`]="{ item }">
                                <td class="text-center">
                                    <v-chip small dark label :color="item.tipo_orden_id === 2 ? 'primary' : 'success'">
                                        <b>{{ item.tipo_orden_id === 2 ? 'SERVICIOS' : 'CÓDIGOS PROPIOS' }}</b>
                                    </v-chip>
                                </td>
                            </template>
                            <template v-slot:[`item.fechaOrdenamiento`]="{ item }">
                                <td class="text-center">
                                    {{ $moment(item.created_at).format('DD-MM-YYYY') }}
                                </td>
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" color="primary"
                                            @click="abrirModalGestionar(item)">
                                            mdi-file-eye-outline
                                        </v-icon>
                                    </template>
                                    <span>Ver detalles</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="10" sm="10">
                        <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                            @input="listarOrdenes()"></v-pagination>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]" outlined
                            label="Registros por Página" @change="listarOrdenes()"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Modal Gestionar Auditoría Servicios -->
        <modal-gestionar-auditoria-servicios :mostrar-modal-gestionar-auditoria.sync="mostrarModalServicios"
            :orden="ordenSeleccionada" @recargarDatos="listarOrdenes" />

        <!-- Modal Gestionar Auditoría Códigos Propios -->
        <modal-gestionar-auditoria-codigos-propios :mostrar-modal-gestionar-auditoria.sync="mostrarModalCodigosPropios"
            :orden="ordenSeleccionada" @recargarDatos="listarOrdenes" />


    </div>
</template>
<script>
import ModalGestionarAuditoriaServicios from "~/components/autorizacion/modalGestionarAuditoriaServicios.vue";
import ModalGestionarAuditoriaCodigosPropios from '~/components/ordenamiento/codigosPropios/modalGestionarAuditoriaCodigosPropios.vue';

export default {
    components: {
        ModalGestionarAuditoriaServicios,
        ModalGestionarAuditoriaCodigosPropios
    },
    middleware({ $can, redirect }) {
        if (!$can('autorizacion.servicios')) return redirect('/');
    },
    data() {
        return {
            loading: {
                ordenes: false,
                opcionesDepartamentos: false,
                opcionesIps: false
            },
            menu: {
                fecha_inicial: false,
                fecha_final: false,
            },
            filtros: {
                fecha_inicial: this.obtenerFechaFormateada(-1),
                fecha_final: this.obtenerFechaFormateada(1),
                orden_id: null,
                numero_documento: null,
                departamento_id: null,
                ips_id: null
            },
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            ordenes: [],
            headersOrdenes: [
                { text: 'N° Orden', value: 'id', align: 'center' },
                { text: 'Tipo Orden', value: 'tipoOrden', align: 'center' },
                { text: 'Fecha Ordenamiento', value: 'fechaOrdenamiento', align: 'center' },
                { text: 'Afiliado', value: 'consulta.afiliado.nombre_completo', align: 'center' },
                { text: 'N° Documento', value: 'consulta.afiliado.numero_documento', align: 'center' },
                { text: 'Departamento', value: 'consulta.afiliado.departamento_atencion.nombre', align: 'center' },
                { text: 'IPS Primaria', value: 'consulta.afiliado.ips.nombre', align: 'center' },
                { text: 'Ordenado Por', value: 'funcionario.operador.nombre_completo', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            opcionesDepartamentos: [],
            opcionesIps: [],
            campoBusquedaIps: null,
            mostrarModalServicios: false,
            mostrarModalCodigosPropios: false,
            ordenSeleccionada: {},
        }
    },
    mounted() {
        this.listarOpcionesDepartamentos();
        this.listarOrdenes();
    },
    watch: {
        campoBusquedaIps(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarOpcionesIps();
            }
        }
    },
    methods: {
        obtenerFechaFormateada(offset) {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            return date.toISOString().substring(0, 10);
        },

        async listarOpcionesDepartamentos() {
            try {
                this.loading.opcionesDepartamentos = true;

                const response = await this.$axios.get('/departamento');
                this.opcionesDepartamentos = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los departamentos.');
            } finally {
                this.loading.opcionesDepartamentos = false;
            }
        },

        async buscarOpcionesIps() {
            try {
                this.loading.opcionesIps = true;

                const response = await this.$axios.get(`/reps/buscarRep/${this.campoBusquedaIps}`);

                this.opcionesIps = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al buscar las IPS.');
            } finally {
                this.loading.opcionesIps = false;
            }
        },

        limpiarFiltros() {
            this.filtros = {
                fecha_inicial: this.obtenerFechaFormateada(-1),
                fecha_final: this.obtenerFechaFormateada(1),
                orden_id: null,
                numero_documento: null,
                departamento_id: null,
                ips_id: null
            };

            this.listarOrdenes();
        },

        async listarOrdenes() {
            const data = {
                filtros: this.filtros,
                paginacion: this.paginacion
            };

            try {
                this.loading.ordenes = true;

                const response = await this.$axios.post('/auditoria/listar-ordenes-servicios-por-auditar', data);
                this.ordenes = response.data.data;
                this.paginacion.total = response.data.last_page;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las órdenes.');
            } finally {
                this.loading.ordenes = false;
            }
        },

        abrirModalGestionar(orden) {
            this.ordenSeleccionada = orden;
            if (orden.tipo_orden_id === 2) {
                this.mostrarModalServicios = true;
            } else if (orden.tipo_orden_id === 3) {
                this.mostrarModalCodigosPropios = true;
            }
        }

    }

}
</script>
