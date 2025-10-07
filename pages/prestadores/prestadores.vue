<template>
    <div>
        <!-- Preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud!
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-card class="mb-5">
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-alert text border="left" dense color="blue-grey" icon="mdi-account-box">
                        <b>Prestadores</b>
                    </v-alert>
                </v-col>
            </v-row>
            <v-card-text>
                <v-row dense class="mx-2">
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete dense v-model="filtroBusqueda.estado" :items="estados" label="Estado"
                            item-text="nombre" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete dense v-model="filtroBusqueda.mes" :items="meses" label="Mes" item-text="nombre"
                            item-value="id">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-select dense v-model="filtroBusqueda.anio" :items="anios" label="Año"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-text-field dense v-model="filtroBusqueda.documento" label="N° Documento"
                            append-icon="mdi-account-search">
                        </v-text-field>
                    </v-col>
                    <template v-if="$can('prestadores.listar.sedes')">
                        <v-col cols="12" sm="12" md="2">
                            <v-autocomplete :loading="loading.sedes" dense v-model="filtroBusqueda.sede"
                                item-text="nombre" return-object label="Sede" :items="sedes"
                                :search-input.sync="buscarSede" @input="listarParametrizacionCups()"></v-autocomplete>
                        </v-col>
                    </template>
                    <template v-else>
                        <v-col cols="12" sm="12" md="2">
                            <v-select :loading="loading.sedes" dense v-model="filtroBusqueda.sede" item-text="nombre"
                                return-object label="Sede" :items="sedes"
                                @input="listarParametrizacionCups()"></v-select>
                        </v-col>
                    </template>
                    <v-col cols="12" sm="12" md="2" v-if="serviciosClinica.length > 0">
                        <v-autocomplete dense v-model="filtroBusqueda.servicioClinica"
                            :items="serviciosClinica.filter(s => $can('prestadores.servicios.clinicos.'+s.categoria.replace(/ /g, '_').toLowerCase()))"
                            label="Servicios Clinica" item-text="categoria" item-value="categoria"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="filtroBusqueda.desde" type="date" label="Desde"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="filtroBusqueda.hasta" type="date" label="Hasta"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-btn class="mt-5" dark small color="green" @click="generarReporte()">Exportar
                            <v-icon right dark>mdi-microsoft-excel</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-spacer></v-spacer>
                <v-btn small :loading="loading.table" :disabled="loading.table" color="success"
                    @click="buscarOrdenes">Filtrar
                </v-btn>
                <v-btn small :loading="loading.table" :disabled="loading.table" color="error"
                    @click="limpiarFiltro">Limpiar
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card>
            <v-alert text border="left" dense color="info" icon="mdi-file-document">
                <b>Ordenes</b>
            </v-alert>
            <v-row dense class="mx-2">
                <v-col cols="12" md="4" sm="4">
                    <v-text-field type="number" label="Número de la orden" hint="Filtrar por número de orden" outlined
                        dense v-model="filtroBusqueda.orden_id"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                    <v-text-field label="Documento" type="number" hint="Ingresa el número de documento" outlined dense
                        v-model="filtroBusqueda.documento"></v-text-field>
                </v-col>
                <v-col>
                    <v-btn color="success" @click="buscarOrdenes" small>Buscar</v-btn>
                    <v-btn color="red" small dark @click="limpiarFIltrosServicios">Limpiar</v-btn>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                    <v-spacer></v-spacer>
                    <v-text-field dense v-model="filtroBuscar" label="Buscar"></v-text-field>
                </v-col>
            </v-row>
            <v-tabs v-model="tab" grow>
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab key="Servicios"> Servicios ({{ ordenesServicios.length }})</v-tab>
                <v-tab key="CodigosPropios">
                    Otros Servicios ({{ ordenesCodigosPropios.length }})
                </v-tab>
                <v-tab v-if="$can('prestadores.listar.medicamentos')" key="medicamentos">
                    Medicamentos ({{ ordenesMedicamentos.length }})
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item key="Servicios">
                    <v-data-table :items="ordenesServicios" :headers="headersOrdenes" hide-default-footer
                        loading-text="Cargando... Por favor espere" no-data-text="No hay ordenes registradas"
                        show-expand single-expand :expanded.sync="expanded">
                        <template v-slot:[`item.created_at`]="{ item }">
                            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon color="info" v-on="on" v-bind="attrs"
                                        @click.stop="abrirDetallesModal(item)">
                                        <v-icon>mdi-account-details</v-icon>
                                    </v-btn>
                                </template>
                                <span>Detalles</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.diagnostico`]="{ item }">
                            <span v-if="
                                item.consulta.cie10_afiliado &&
                                item.consulta.cie10_afiliado.length > 0
                            ">
                                {{ item.consulta.cie10_afiliado[0].cie10.nombre }}
                            </span>
                            <span v-else>No disponible</span>
                        </template>
                        <template v-slot:[`item.codigoDiagnostico`]="{ item }">
                            <span v-if="
                                item.consulta.cie10_afiliado &&
                                item.consulta.cie10_afiliado.length > 0
                            ">
                                {{ item.consulta.cie10_afiliado[0].cie10.codigo_cie10 }}
                            </span>
                            <span v-else>No disponible</span>
                        </template>

                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length" class="expanded-cell">
                                <v-alert dense text type="success" outlined class="mt-3 mb-3">Detalle de
                                    servicios orden <b>{{ item.id }}</b></v-alert>
                                <v-data-table :items="item.procedimientos" :headers="headersOrdenesServicios" hide-default-footer>
                                    <template v-slot:[`item.oportunidad`]="{ item: subitem }">
                                        <v-chip color="info" small>
                                            {{ calcularOportunidad(subitem.created_at, subitem.fecha_ejecucion) }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.estado.nombre`]="{ item: subitem }">
                                        <v-chip :color="[1, 4, 14].includes(subitem.estado.id) ? 'success' : 'warning'"
                                            dark>
                                            {{ subitem.estado.nombre }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.estado_gestion_prestador.nombre`]="{ item: subitem }">
                                        <v-chip
                                            :color="[58, 51].includes(subitem.estado_gestion_prestador.id) ? 'success' : 'error'"
                                            dark>
                                            {{ subitem.estado_gestion_prestador.nombre }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.auditor`]="{ item: subitem }">
                                        {{ subitem.auditoria[0]?.user?.operador?.nombre_completo ?? "No Aplica" }}
                                    </template>
                                    <template v-slot:[`item.observacionAuditoria`]="{ item: subitem }">
                                        {{ subitem.auditoria[0]?.observaciones ?? "No Aplica" }}
                                    </template>
                                </v-data-table>

                            </td>
                        </template>
                    </v-data-table>
                    <template>
                        <v-row no-gutters class="mt-4 mb-4 mr-2">
                            <v-col cols="11">

                                <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                                    @input="buscarOrdenesServicios()"></v-pagination>
                            </v-col>
                            <v-col cols="1">
                                <v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
                                    outlined label="Registros por Página" @change="buscarOrdenesServicios()"></v-select>
                            </v-col>
                        </v-row>

                    </template>
                </v-tab-item>

                <v-tab-item key="CodigosPropios">
                    <v-data-table :items="ordenesCodigosPropios" :headers="headersOrdenes" hide-default-footer
                        loading-text="Cargando... Por favor espere" no-data-text="No hay ordenes registradas"
                        show-expand single-expand :expanded.sync="expanded">
                        <template v-slot:[`item.created_at`]="{ item }">
                            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                        </template>

                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon color="info" v-on="on" v-bind="attrs"
                                        @click.stop="abrirDetallesModal(item)">
                                        <v-icon>mdi-account-details</v-icon>
                                    </v-btn>
                                </template>
                                <span>Detalles</span>
                            </v-tooltip>
                        </template>

                        <template v-slot:[`item.diagnostico`]="{ item }">
                            <span v-if="
                                item.consulta.cie10_afiliado &&
                                item.consulta.cie10_afiliado.length > 0
                            ">
                                {{ item.consulta.cie10_afiliado[0].cie10.nombre }}
                            </span>
                            <span v-else>No disponible</span>

                        </template>
                        <template v-slot:[`item.codigoDiagnostico`]="{ item }">
                            <span v-if="
                                item.consulta.cie10_afiliado &&
                                item.consulta.cie10_afiliado.length > 0
                            ">
                                {{ item.consulta.cie10_afiliado[0].cie10.codigo_cie10 }}
                            </span>
                            <span v-else>No disponible</span>
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length" class="expanded-cell">
                                <v-alert dense text type="success" outlined class="mt-3 mb-3">Detalle de
                                    servicios orden <b>{{ item.id }}</b></v-alert>
                                <v-data-table :items="item.ordenes_codigo_propio"
                                    :headers="headersOrdenesCodigosPropios" hide-default-footer>
                                    <template v-slot:[`item.oportunidad`]="{ item: subitem }">
                                        <v-chip color="info" small>
                                            {{ calcularOportunidad(subitem.created_at, subitem.fecha_ejecucion) }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.estado.nombre`]="{ item: subitem }">
                                        <v-chip :color="[1, 4, 14].includes(subitem.estado.id) ? 'success' : 'warning'"
                                            dark>
                                            {{ subitem.estado.nombre }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.estado_gestion_prestador.nombre`]="{ item: subitem }">
                                        <v-chip
                                            :color="[58, 51].includes(subitem.estado_gestion_prestador.id) ? 'success' : 'error'"
                                            dark>
                                            {{ subitem.estado_gestion_prestador.nombre }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.auditor`]="{ item: subitem }">
                                        {{ subitem.auditoria[0]?.user?.operador?.nombre_completo ?? "No Aplica" }}
                                    </template>
                                    <template v-slot:[`item.observacionAuditoria`]="{ item: subitem }">
                                        {{ subitem.auditoria[0]?.observaciones ?? "No Aplica" }}
                                    </template>
                                </v-data-table>

                            </td>
                        </template>
                    </v-data-table>
                    <template>
                        <v-row no-gutters class="mt-4 mb-4 mr-2">
                            <v-col cols="11">

                                <v-pagination v-model="paginacionCod.pagina" :length="paginacionCod.total"
                                    :total-visible="9" @input="buscarOrdenesCodigosPropios()"></v-pagination>
                            </v-col>
                            <v-col cols="1">
                                <v-select dense v-model="paginacionCod.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
                                    outlined label="Registros por Página"
                                    @change="buscarOrdenesCodigosPropios()"></v-select>
                            </v-col>
                        </v-row>

                    </template>
                </v-tab-item>
                <v-tab-item key="medicamentos">
                    <v-data-table dense class="mt-4" :headers="headersOrdenesMedicamentos" :search="filtroBuscar"
                        :items="ordenesMedicamentos" :loading="loading.table"
                        loading-text="Cargando... Por favor espere" hide-default-footer
                        no-data-text="No hay ordenes de Medicamentos">
                        <template v-slot:[`item.usuarioDispensa`]="{ item }">
                            {{ item.movimientos[0]?.user?.operador?.nombre_completo ?
                            item.movimientos[0].user.operador.nombre_completo : 'No aplica' }}
                        </template>
                        <template v-slot:[`item.cantidad_entregada`]="{ item }">
                            <v-chip small :color="colorCantidad(item.cantidad_entregada)" dark>
                                {{ item.cantidad_entregada ? item.cantidad_entregada : '0' }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.orden.paginacion`]="{ item }">
                            <v-chip small color="info" dark>
                                {{ item.orden.paginacion ? item.orden?.paginacion : 'No aplica' }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.lugarDispensa`]="{ item }">
                            {{ item.movimientos[0]?.bodega_origen?.nombre ? item.movimientos[0].bodega_origen.nombre :
                            'No aplica' }}
                        </template>
                        <template v-slot:[`item.created_at`]="{ item }">
                            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                        </template>
                        <template v-slot:[`item.fecha_vigencia`]="{ item }">
                            {{ $moment(item.fecha_vigencia).format("DD-MM-YYYY") }}
                        </template>
                        <template v-slot:[`item.diasVencido`]="{ item }">
                            <v-chip color="error" small v-if="calcularDiasVencido(item.fecha_vigencia) >= 0">
                                {{ calcularDiasVencido(item.fecha_vigencia) }}
                            </v-chip>
                            <v-chip color="success" small v-else> Vigente</v-chip>
                        </template>
                        <template v-slot:[`item.diagnostico`]="{ item }">
                            <span v-if="
                  item.orden.consulta.cie10_afiliado &&
                  item.orden.consulta.cie10_afiliado.length > 0
                ">
                                {{ item.orden.consulta.cie10_afiliado[0].cie10.nombre }}
                            </span>
                            <span v-else>No disponible</span>
                        </template>
                        <template v-slot:[`item.codigoDiagnostico`]="{ item }">
                            <span v-if="
                  item.orden.consulta.cie10_afiliado &&
                  item.orden.consulta.cie10_afiliado.length > 0
                ">
                                {{ item.orden.consulta.cie10_afiliado[0].cie10.codigo_cie10 }}
                            </span>
                            <span v-else>No disponible</span>
                        </template>
                        <template v-slot:[`item.estadoOrden`]="{ item }">
                            <v-chip :color="[1,4,14].includes(item.estado.id)?'success':'warning'" dark>
                                {{ item.estado.nombre }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.observacionAuditoria`]="{ item }">
                            {{ item.auditorias[0]?.observaciones ?? "No Aplica" }}
                        </template>
                    </v-data-table>
                    <template>
                        <v-row no-gutters class="mt-4 mb-4 mr-2">
                            <v-col cols="11">

                                <v-pagination v-model="paginacionMed.pagina" :length="paginacionMed.total"
                                    :total-visible="9" @input="buscarOrdenesMedicamentos()"></v-pagination>
                            </v-col>
                            <v-col cols="1">
                                <v-select dense v-model="paginacionMed.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
                                    outlined label="Registros por Página"
                                    @change="buscarOrdenesMedicamentos()"></v-select>
                            </v-col>
                        </v-row>

                    </template>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
        <component :is="comp" ref="ModalDetalles" :mostrarDetallesModal.sync="mostrarDetallesModal" :comp.sync="comp"
            :orden="ordenSeleccionada" @enviarDetalles="enviarDetalles" :orden_id="ordenSeleccionada.id"
            :sede="filtroBusqueda.sede" :agendamientoInterno="agendamientoInterno"
            :filtroEstado="filtroBusqueda.estado"></component>
    </div>
</template>

<script>
import ModalDetalles from "~/components/prestadores/modalDetalles.vue";
import {mapActions} from "vuex";

export default {
    components: {
        ModalDetalles,
    },
    data() {
        return {
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            paginacionCod: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            paginacionMed: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            ordenServicio:[],
            filtroBuscar: '',
            comp: '',
            agendamientoInterno: false,
            formExportar: {
                desde: null,
                hasta: null
            },
            buscarSede: '',
            totalVisible: 9,
            preload: false,
            filtroBusqueda: {
                anio: new Date().getFullYear(),
                mes: new Date().getMonth() + 1,
                estado: null,
                documento: null,
                sede: null,
                orden_id: '',
                servicioClinica: '',
                desde: null,
                hasta: null
            },
            anios: [
                new Date().getFullYear() - 1,
                new Date().getFullYear(),
                new Date().getFullYear() + 1,
            ],
            serviciosClinica: [],
            meses: [{
                id: 1,
                nombre: "Enero"
            },
                {
                    id: 2,
                    nombre: "Febrero"
                },
                {
                    id: 3,
                    nombre: "Marzo"
                },
                {
                    id: 4,
                    nombre: "Abril"
                },
                {
                    id: 5,
                    nombre: "Mayo"
                },
                {
                    id: 6,
                    nombre: "Junio"
                },
                {
                    id: 7,
                    nombre: "Julio"
                },
                {
                    id: 8,
                    nombre: "Agosto"
                },
                {
                    id: 9,
                    nombre: "Septiembre"
                },
                {
                    id: 10,
                    nombre: "Octubre"
                },
                {
                    id: 11,
                    nombre: "Noviembre"
                },
                {
                    id: 12,
                    nombre: "Diciembre"
                },
            ],
            estados: [{
                id: 50,
                nombre: "Por Gestionar"
            },
            {
                id: 19,
                nombre: "En seguimiento"
            },
                {
                    id: 58,
                    nombre: 'Programadas'
                },
                {
                    id: 51,
                    nombre: "Asistencia"
                },
                {
                    id: 8,
                    nombre: "Inasistencia"
                },
                {
                    id: 30,
                    nombre: "Cancelada"
                },
                {
                    id: 52,
                    nombre: "No Contactado"
                },
            ],
            sedes: [],
            loading: {
                sedes: false,
                table: false,
            },
            tab: "Servicios",
            ordenesServicios: [],
            ordenesMedicamentos: [],
            totalOrdenesServicios: 0,
            headersOrdenes: [{
                text: "Orden N°",
                value: "id",
                sortable: false
            },
            {
                text: "Fecha Ordenamiento",
                value: "created_at",
                sortable: false
            },
            {
                text: "Entidad",
                value: "consulta.afiliado.entidad.nombre",
                sortable: false
            },
            {
                text: "IPS",
                value: "consulta.afiliado.ips.nombre",
                align: "center",
                sortable: false
            },
            {
                text: "Afiliado",
                value: "consulta.afiliado.nombre_completo",
                sortable: false
            },
            {
                text: "N° Documento",
                value: "consulta.afiliado.numero_documento",
                sortable: false
            },
            {
                text: "Diagnóstico",
                value: "diagnostico",
                align: "center",
                sortable: false
            },
            {
                text: "Código",
                value: "codigoDiagnostico",
                align: "center",
                sortable: false
            },
            {
                text: "Acciones",
                value: "acciones",
                align: "center",
                sortable: false,
            },
            ],
            headersOrdenesServicios: [
                {
                    text: "Fecha Vigencia",
                    value: "fecha_vigencia",
                    sortable: false
                },
                {
                    text: "Oportunidad",
                    value: "oportunidad",
                    sortable: false
                },
                {
                    text: "Codigo CUPS",
                    value: "cup.codigo",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Nombre Servicio",
                    value: "cup.nombre",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Cantidad",
                    value: "cantidad",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Observación",
                    value: "observacion",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Estado Orden",
                    value: "estado.nombre",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Estado Gestion",
                    value: "estado_gestion_prestador.nombre",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Auditor",
                    value: "auditor",
                    sortable: false
                },
                {
                    text: "Nota Auditoría",
                    value: "observacionAuditoria",
                    sortable: false
                },
            ],
            ordenesCodigosPropios: [],
            totalOrdenesCodigosPropios: 0,
            headersOrdenesCodigosPropios: [
                {
                    text: "Fecha Vigencia",
                    value: "fecha_vigencia",
                    sortable: false
                },
                {
                    text: "Oportunidad",
                    value: "oportunidad",
                    sortable: false
                },
                {
                    text: "Codigo Propio",
                    value: "codigo_propio.codigo",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Nombre Servicio",
                    value: "codigo_propio.nombre",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Cantidad",
                    value: "cantidad",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Observación",
                    value: "observacion",
                    align: "center",
                    sortable: false

                },
                {
                    text: "Estado Orden",
                    value: "estado.nombre",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Estado Gestion",
                    value: "estado_gestion_prestador.nombre",
                    align: "center",
                    sortable: false
                },
                {
                    text: "Auditor",
                    value: "auditor",
                    sortable: false
                },
                {
                    text: "Nota Auditoría",
                    value: "observacionAuditoria",
                    sortable: false
                },
            ],
           
            headersOrdenesMedicamentos: [
                {
                    text: "Orden N°",
                    value: "id"
                },
                {
                    text: "Fecha Ordenamiento",
                    value: "created_at"
                },
                {
                    text: "Fecha Vigencia",
                    value: "fecha_vigencia"
                },
                {
                    text: "Días Vencido",
                    value: "diasVencido",
                    align: "center"
                },
                {
                    text: "Entidad",
                    value: "orden.consulta.afiliado.entidad.nombre"
                },
                {
                    text: "Afiliado",
                    value: "orden.consulta.afiliado.nombre_completo"
                },
                {
                    text: "N° Documento",
                    value: "orden.consulta.afiliado.numero_documento",
                },
                {
                    text: "IPS",
                    value: "orden.consulta.afiliado.ips.nombre"
                },
                {
                    text: "Diagnóstico",
                    value: "diagnostico"
                },
                {
                    text: "Código",
                    value: "codigoDiagnostico",
                    align: "center"
                },
                {
                    text: "Codesumi",
                    value: "codesumi.nombre"
                },
                {
                    text: "Dosificacion",
                    value: "dosificacion_medico"
                },
                {
                    text: "Observación",
                    value: "observacion"
                },
                {
                    text: "Auditor",
                    value: "auditor",
                },
                {
                    text: "Nota Auditoría",
                    value: "observacionAuditoria"
                },
                {
                    text: "Paginación",
                    value: "orden.paginacion"
                },  
                {
                    text: "Usuario Dispensa",
                    value: "usuarioDispensa"
                },
                {
                    text: "Lugar Dispensación",
                    value: "lugarDispensa"
                },
                {
                    text: "Cantidad Dispensada",
                    value: "cantidad_entregada"
                },
                {
                    text: "Estado Orden",
                    value: "estadoOrden",
                    align: "center",
                },
            ],
            ordenSeleccionada: {},
            mostrarDetallesModal: false,
            ordenes_proc_id:[],
            expanded: []
        };
    },
    mounted() {
        this.filtroBusqueda.anio = new Date().getFullYear();
        if (!this.$can('prestadores.listar.sedes')) {
            this.listarSede();
        }
    },
    watch: {
        buscarSede(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarSedes();
                } else if (val.length < 4) {
                    this.sedes = [];
                }
            } else {
                this.sedes = [];

            }
        },
        
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        limpiarFiltro() {
            this.filtroBusqueda = {
                estado: null,
                documentoo: "",
                sede: null,
            };
        },

        buscarOrdenes() {
            if (
                this.filtroBusqueda.sede == null ||
                this.filtroBusqueda.mes == null ||
                this.filtroBusqueda.anio == null
            ) {
                return this.$toast.error("Debe seleccionar una sede, un mes y un año");
            }
            this.buscarOrdenesServicios();
            this.buscarOrdenesCodigosPropios();
            if(this.$can('prestadores.listar.medicamentos')){
                this.buscarOrdenesMedicamentos();
            }
        },

        buscarOrdenesServicios() {
            this.ordenesServicios = [];
            this.setPreload(true);
            this.loading.table = true;
            const params = {
                ...this.filtroBusqueda,
                orden_id: this.filtroBusqueda.orden_id ? Number(this.filtroBusqueda.orden_id) : null,
                page: this.paginacion.pagina,
                perPage: this.paginacion.cantidadRegistros,
            };

            this.$axios
                .post("/ordenamiento/ordenProcedimientoSede", params)
                .then((res) => {
                    this.ordenesServicios = res.data.data;
                    this.paginacion.total = res.data.total
                })
                .catch((err) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las ordenes de servicios"
                    );
                    console.log(err);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        buscarOrdenesCodigosPropios() {
            this.ordenesCodigosPropios = [];
            this.setPreload(true);
            this.loading.table = true;
            const params = {
                ...this.filtroBusqueda,
                orden_id: this.filtroBusqueda.orden_id ? Number(this.filtroBusqueda.orden_id) : null,
                page: this.paginacionCod.pagina,
                perPage: this.paginacionCod.cantidadRegistros,
            };
            this.$axios
                .post("/ordenamiento/ordenCodigoPropioSede", params)
                .then((res) => {
                    this.ordenesCodigosPropios = res.data.data
                    this.paginacionCod.total = res.data.total
                })
                .catch((err) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las ordenes de otros servicios"
                    );
                    console.log(err);
                })
                .finally(() => {
                    this.loading.table = false;
                    this.setPreload(false);
                });
        },

        buscarOrdenesMedicamentos() {
            this.ordenesMedicamentos = [];
            this.setPreload(true);
            this.loading.table = true;
            const params = {
                ...this.filtroBusqueda,
                page: this.paginacionMed.pagina,
                perPage: this.paginacionMed.cantidadRegistros,
            };
            this.$axios.post('ordenamiento/orden-medicamentos-linea-base', params).then(res => {
                this.ordenesMedicamentos = res.data.data.map(s => {
                    let data = {...s};
                    data.auditor = s.auditorias[0]?.user?.operador?.nombre_completo ?? "No Aplica";
                    data.estadoOrden = s.estado.nombre;
                    return data;
                });
                this.paginacionMed.total = res.data.total
            }).catch((err) => {
                this.$toast.error("Ocurrió un error al cargar las ordenes de medicamentos");
                console.log(err);
            })
                .finally(() => {
                    this.loading.table = false;
                    this.setPreload(false);
                });
        },
        listarSede() {
            this.loading.sedes = true;
            this.setPreload(true);
            this.$axios.get("reps/" + this.$store.state.auth.usuario.operador.rep_id).then(res => {
                this.sedes.push(res.data);
            }).catch(e => console.log(e.response)).finally(() => {
                this.loading.sedes = false;
                this.setPreload(false)
            })
        },
        async listarSedes() {
            this.loading.sedes = true;
            this.setPreload(true);
            this.$axios.post("reps/listarConfiltro", {rep: this.buscarSede}).then(res => {
                this.sedes = res.data;
            }).catch(e => console.log(e.response)).finally(() => {
                this.loading.sedes = false;
                this.setPreload(false)
            })
        },
        calcularDiasVencido(fecha) {
            const diasVencido = this.$moment().diff(fecha, "days");
            return diasVencido;
        },
        calcularOportunidad(fechaOrden,fechaEjecucion) {
            const fechaInicio = this.$moment(fechaOrden);
            const fechaFin = fechaEjecucion ? this.$moment(fechaEjecucion) : this.$moment();
            const diasVencido = fechaFin.diff(fechaInicio, "days");
            return diasVencido;
        },

        getEstadoColor(estadoId) {
            switch (estadoId) {
                case 50:
                    return "indigo"; // Por Gestionar
                case 30:
                    return "red"; // Cancelada
                case 51:
                    return "green"; // Asistencia
                case 8:
                    return "amber"; // Inasistencia
                case 52:
                    return "grey"; // No Contactado
                default:
                    return "grey"; // Color por defecto si no se encuentra el estado
            }
        },
        colorCantidad(cantidad){
            switch(cantidad){
                case 0:
                    return 'red'
                case null:
                    return 'grey'
                default:
                    return 'green'
            }
        },

        abrirDetallesModal(item) {
            
            this.comp = 'ModalDetalles'
            this.mostrarDetallesModal = true;
            this.ordenSeleccionada = {
                afiliado: item.consulta.afiliado,
                servicio: item.procedimientos ? item.procedimientos : item.ordenes_codigo_propio,
                id: item.id,
                tipoOrden: item.procedimientos ? "servicio" : "codigo_propio",
            };
        },

        enviarDetalles(payload) {
            this.preload = true;
            const formData = new FormData();

            formData.append("estado", payload.selectedOption);
            for(let i=0; i < payload.ordenes_id.length; i++){
                formData.append("id[]", payload.ordenes_id[i]);
            }
            // formData.append("id[]", payload.ordenes_id);
            formData.append("tipoOrden", payload.tipoOrden);
            formData.append(
                "funcionario_responsable",
                payload.detalles.funcionario_responsable
            );
            formData.append("observaciones", payload.detalles.observaciones);

            if (payload.selectedOption == 30) {
                formData.append(
                    "fecha_cancelacion",
                    payload.detalles.fecha_cancelacion
                );
                formData.append(
                    "motivo_cancelacion",
                    payload.detalles.motivo_cancelacion
                );
                formData.append(
                    "causa_cancelacion",
                    payload.detalles.causa_cancelacion
                );
                formData.append("adjuntos[]", payload.detalles.adjuntos);
            }

            if (payload.selectedOption == 51) {
                if (payload.detalles.adjuntos) {
                    for (let i = 0; i < payload.detalles.adjuntos.length; i++) {
                        formData.append("adjuntos[]", payload.detalles.adjuntos[i]);
                    }
                }
                formData.append("fecha_resultado", payload.detalles.fecha_resultado);
                formData.append("cirujano", payload.detalles.cirujano);
                formData.append("especialidad", payload.detalles.especialidad);
                formData.append(
                    "fecha_preanestesia",
                    payload.detalles.fecha_preanestesia
                );
                formData.append("fecha_cirugia", payload.detalles.fecha_cirugia);
                formData.append("fecha_ejecucion", payload.detalles.fecha_ejecucion);
                formData.append('fecha_asistencia', payload.detalles.fecha_asistencia);
            }

            if (payload.selectedOption == 58) {
                if (payload.detalles.adjuntos) {
                    for (let i = 0; i < payload.detalles.adjuntos.length; i++) {
                        formData.append("adjuntos[]", payload.detalles.adjuntos[i]);
                    }
                }
                formData.append("fecha_resultado", payload.detalles.fecha_resultado);
                formData.append("cirujano", payload.detalles.cirujano);
                formData.append("especialidad", payload.detalles.especialidad);
                formData.append(
                    "fecha_preanestesia",
                    payload.detalles.fecha_preanestesia
                );
                formData.append("fecha_cirugia", payload.detalles.fecha_cirugia);
                formData.append("fecha_ejecucion", payload.detalles.fecha_ejecucion);
                formData.append("fecha_sugerida", payload.detalles.fecha_sugerida);
                formData.append("fecha_solicitada_afiliado", payload.detalles.fecha_solicitada_afiliado);

            }
            this.$axios
                .post("gestion-orden-prestador/enviar-detalle", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    this.$toast.success(
                        "Se actualizo el estado de la orden correctamente"
                    );
                    this.mostrarDetallesModal = false;
                    this.comp = '';
                    this.buscarOrdenes();
                })
                .catch((err) => {
                    this.$toast.error(
                        "Ocurrió un error al actualizar el estado de la orden"
                    );
                    console.log(err);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        limpiarFIltrosServicios() {
            this.filtroBusqueda.documento = '';
            this.filtroBusqueda.orden_id = '';
            this.buscarOrdenesServicios();
            this.buscarOrdenesCodigosPropios();
            this.buscarOrdenesMedicamentos();
        },
        listarParametrizacionCups() {
            this.setPreload(true);
            this.$axios.get('reps/parametrizacion-categoria-sede/' + this.filtroBusqueda.sede.id).then(response => {
                this.serviciosClinica = response.data;
                this.agendamientoInterno = response.data.length > 0;
            }).catch(e => console.log(e.response)).finally(() => this.setPreload(false))
        },
        generarReporte() {
            if (!this.filtroBusqueda.desde) {
                return this.$toast.error('El campo "Desde" es requerido');
            }
            if (!this.filtroBusqueda.hasta) {
                return this.$toast.error('El campo "Hasta" es requerido');
            }
            if (this.filtroBusqueda.desde > this.filtroBusqueda.hasta) {
                return this.$toast.error('El campo "Desde" no puede ser superior al campo "Hasta"');
            }
            if (!this.filtroBusqueda.sede) {
                return this.$toast.error('El campo "Sede" es requerido');
            }
            if (!this.filtroBusqueda.servicioClinica) {
                return this.$toast.error('El campo "Servicios Clinicos" es requerido');
            }
            this.setPreload(true);
            this.$axios.post('gestion-orden-prestador/reporte', this.filtroBusqueda, {
                responseType: 'blob',
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.download = 'registro_ordenes_prestadores.xlsx';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }).catch(e => console.log(e.response)).finally(() => this.setPreload(false))
        }
    },
};

</script>
