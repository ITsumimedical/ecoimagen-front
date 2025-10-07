<template>
    <div>
        <v-dialog v-model="dialogLote" persistent>
            <v-card>
                <v-card-title class="text-h5 grey lighten-2 mb-2">
                    Registar Lotes
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text v-if="dialogLote">
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <h3>CANTIDAD AUTORIZADA
                                <strong>{{
                                    solicitudSeleccionada.detalles_solicitud[detalleNovedadIndice].cantidad_aprobada
                                }}</strong>
                            </h3><br>
                            <h3>CANTIDAD PARAMETRIZADA <strong>{{
                                solicitudSeleccionada.detalles_solicitud[detalleNovedadIndice].lotes.reduce((accumulator,
                                    object) => {
                                    return accumulator + parseFloat(object.cantidad);
                                }, 0)
                                    }}</strong></h3><br>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field label="Lote" dense outlined v-model="formLote.lote"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field label="Fecha vencimiento" dense outlined v-model="formLote.fecha"
                                type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field type="number" label="Cantidad" dense outlined
                                v-model="formLote.cantidad"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field type="number" label="Temperatura" dense outlined
                                v-model="formLote.temperatura"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-textarea label="Observaciones" auto-grow dense outlined
                                v-model="formLote.observaciones"></v-textarea>
                        </v-col>

                        <v-col cols="12" sm="4" md="4">
                            <v-btn color="success" small class="mt-5" @click="agregarLote()">Agregar</v-btn>
                        </v-col>
                    </v-row>
                    <v-data-table :headers="headerLotes" :items="detalleLotes" disable-pagination hide-default-footer>
                        <template v-slot:[`item.numero`]="{ index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:[`item.eliminar`]="{ index }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon color="error" small
                                        @click="solicitudSeleccionada.detalles_solicitud[detalleNovedadIndice].lotes.splice(index, 1)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Tooltip</span>
                            </v-tooltip>

                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="limpiarFormularioNovedad">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogNovedad" width="800" persistent>
            <v-card>
                <v-card-title class="text-h5 grey lighten-2 mb-2">
                    Registar Novedad
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :headers="headerNovedad" :items="detalleNovedades" disable-pagination
                                hide-default-footer>
                                <template v-slot:[`item.numero`]="{ index }">
                                    {{ index + 1 }}
                                </template>
                                <template v-slot:[`item.devolucion`]="{ item }">
                                    <v-chip v-if="Boolean(item.devolucion) === true" color="success">SI</v-chip>
                                    <v-chip v-else color="error">NO</v-chip>
                                </template>
                                <template v-slot:[`item.eliminar`]="{ index }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn v-on="on" icon color="error" small
                                                @click="solicitudSeleccionada.detalles_solicitud[detalleNovedadIndice].novedades.splice(index, 1)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Tooltip</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <!-- <v-col cols="12" sm="12" md="12">
                <v-autocomplete label="Lote" :items="detalleLotes" item-text="lote" return-object
                                v-model="formNovedad.lote"></v-autocomplete>
              </v-col> -->
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete label="Tipo Novedad" :items="tipoNovedadesLista" item-text="nombre"
                                return-object v-model="formNovedad.tipoNovedad"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 1">
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field type="number" label="Cantidades Averiadas"
                                v-model="formNovedad.cantidad"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 2">
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field type="number" label="Cantidades Sobrantes"
                                v-model="formNovedad.cantidad"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 3">
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field type="number" label="Cantidades Faltantes"
                                v-model="formNovedad.cantidad"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 5">
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete v-model="formNovedad.nuevoMedicamento" label="Nuevo Articulo"
                                :items="medicamentos" item-text="nombre" :search-input.sync="filtroMedicamento"
                                return-object></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 6">
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field type="number" label="Precio Unidad"
                                v-model="formNovedad.precio"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad && parseInt(formNovedad.tipoNovedad.id) === 5">
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field type="number" label="Precio Unidad"
                                v-model="formNovedad.precio"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="formNovedad.tipoNovedad">
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea rows="2" label="Observación" v-model="formNovedad.observacion"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-checkbox v-model="formNovedad.devolucion" label="Devolución"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="limpiarFormularioNovedad">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="agregarNovedad">Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDetalle" width="1200" persistent>
            <v-card v-if="solicitudSeleccionada">
                <!-- <v-card-title class="text-h5 grey lighten-2 mb-8">
                    Detalle Solicitud
                    <v-spacer></v-spacer>
                </v-card-title> -->
                <!-- <pre>{{detallesSeleccionados}}</pre> -->
                <!-- <v-btn color="success" dark small @click="imprimir({tipo:'ActaRecepcion',numeroFactura:detallesSeleccionados[0].id,
            proveedor_id: 1})">Agregar</v-btn> -->
                <v-alert border="left" text dense color="success" icon="mdi-hospital-box-outline">
                    <div class="d-flex justify-space-between">
                        <b>DETALLE SOLICITUD</b>
                        <v-btn color="blue-grey" small text @click="listarSolicitudes">
                            <v-icon>
                                mdi-close-circle-outline
                            </v-icon>
                        </v-btn>
                    </div>
                </v-alert>

                <v-col cols="12" sm="12" md="12">
                    <v-text-field label="Buscar" v-model="buscar"></v-text-field>
                </v-col>
                <v-data-table :headers="headersDetalle" :search="buscar"
                    :items="solicitudSeleccionada.detalles_solicitud.filter(s => parseInt(s.estado_id) === 4)"
                    class="elevation-1" disable-pagination hide-default-footer item-key="id" show-select
                    v-model="detallesSeleccionados">
                    <template v-slot:[`item.valorTotal`]="{ item }">
                        $ {{ calcularTotal(item) }}
                    </template>
                    <template v-slot:[`item.novedad`]="{ item, index }">
                        <v-badge bordered color="warning" :content="`${item.novedades.length}`" overlap>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="warning" v-on="on"
                                        @click="dialogNovedad = true; detalleNovedadIndice = index; detalleNovedades = item.novedades; detalleLotes = item.lotes">
                                        <v-icon>mdi-alert-circle-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>Novedades</span>
                            </v-tooltip>
                        </v-badge>
                    </template>
                    <template v-slot:[`item.producto`]="{ item }">
                        {{ item.medicamento.invima.producto }}
                    </template>
                    <template v-slot:[`item.lote`]="{ item, index }">
                        <!--            <v-text-field label="Lote Articulo" v-model="item.lote"></v-text-field>-->
                        <v-btn color="primary"
                            @click="dialogLote = true; detalleNovedadIndice = index; detalleLotes = item.lotes">Lotes
                            ({{ item.cantidad_aprobada }}/{{
                                item.lotes.reduce((accumulator, object) => {
                                    return accumulator + parseFloat(object.cantidad);
                                }, 0)
                            }})</v-btn>
                    </template>
                    <template v-slot:top>
                        <v-container fluid grid-list-xl>
                            <v-layout row wr ap>
                                <v-col cols="12" sm="12" md="10">
                                    <v-text-field dense outlined label="Código Factura" v-model="codigoFactura"
                                        min="1"></v-text-field>
                                </v-col>
                                <v-btn icon color="indigo" class="mt-3"
                                    @click="verificarExistenciaFactura()"><v-icon>mdi-clipboard-text-search-outline</v-icon></v-btn>
                                <v-flex xs5>
                                    Valor Factura Estimado <strong>{{ calcularValorFacturaEstimado() }}</strong><br>
                                    Valor Factura Calculado <strong>{{ calcularValorFacturaCalculado() }}</strong> (
                                    <strong>{{ (totalValorFacturaCalculado - totalValorFacturaEstimado) |
                                        pesoFormat }}</strong> )
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-spacer></v-spacer>
                    </template>
                </v-data-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark block color="success" small @click="GuardarFactura()">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-row>
                <v-col cols="12" md="12">
                    <v-col cols="12" md="12">
                        <v-autocomplete @change="listarSolicitudes" v-model="formSolicitudCompras.bodega_origen_id"
                            label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre" item-value="id"
                            required></v-autocomplete>
                    </v-col>
                </v-col>
            </v-row>

            <v-row v-if="formSolicitudCompras.bodega_origen_id">
                <v-col cols="12" md="12">
                    <v-text-field label="Buscar" v-model="buscarP"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                    <v-data-table :headers="headers" :items="listaSolicitudes" item-key="id" :search="buscarP"
                        :loading="loadingTabla" loading-text="Cargando... Por favor espere">
                        <template v-slot:[`item.solicitante`]="{ item }">
                            {{
                                `${item.usuario_solicita?.operador?.nombre || ''}
                            ${item.usuario_solicita?.operador?.apellido || ''}`.trim() || 'Sin nombre'
                            }}
                        </template>
                        <template v-slot:[`item.detalle`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="primary" v-on="on" @click="cargarDetalles(item)">
                                        <v-icon>mdi-format-list-bulleted</v-icon>
                                    </v-btn>
                                </template>
                                <span>Detalle</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.anular`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="red" v-on="on" @click="anularSolicitud(item)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Anular</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.accion`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="red" v-bind="attrs" v-on="on"
                                        @click="imprimir({ tipo: 'ordenCompra', id: item.id })">
                                        mdi-file-pdf-box
                                    </v-icon>
                                </template>
                                <span>Descargar</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="imprimirExcel(item.id)">
                                        mdi-file-excel
                                    </v-icon>
                                </template>
                                <span>Excel</span>
                            </v-tooltip>
                        </template>

                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog max-width="1200px" v-model="facturasMontadasDialog" persistent>
            <v-card>
                <v-alert text dense border="bottom" color="blue-grey" icon="mdi-cash">
                    <b>FACTURAS EXISTENTES</b>
                </v-alert>
                <v-card-text>
                    <template>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(factura, index) in facturasExistentes" :key="index">
                                <v-expansion-panel-header>
                                    Número de factura: {{ factura?.codigo_factura || 'No disponible' }}
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                    <v-card flat>
                                        <v-list dense>
                                            <v-list-item-group>
                                                <v-list-item
                                                    v-for="(detalle, i) in factura.solicitud_bodega?.detalles_solicitud"
                                                    :key="i">
                                                    <v-list-item-content>
                                                        <v-container fluid>
                                                            <v-row>
                                                                <v-col cols="1">
                                                                    <b>#{{ i + 1 }}</b>
                                                                </v-col>
                                                                <v-col cols="6">
                                                                    <v-icon left color="blue">mdi-pill</v-icon>
                                                                    <b>Medicamento:</b> {{
                                                                    detalle.medicamento?.codesumi?.nombre }}
                                                                </v-col>
                                                                <v-col cols="3">
                                                                    <v-icon left color="green">mdi-counter</v-icon>
                                                                    <b>Cantidad Inicial:</b> {{ detalle.cantidad_inicial
                                                                    }}
                                                                </v-col>

                                                                <v-col cols="3">
                                                                    <v-icon left
                                                                        color="green">mdi-check-circle-outline</v-icon>
                                                                    <b>Cantidad Aprobada:</b> {{
                                                                        detalle.cantidad_aprobada
                                                                    }}
                                                                </v-col>

                                                                <v-col cols="3">
                                                                    <v-icon left
                                                                        color="orange">mdi-package-variant-closed</v-icon>
                                                                    <b>Cantidad Entregada:</b> {{
                                                                        detalle.cantidad_entregada
                                                                    || 'Pendiente' }}
                                                                </v-col>

                                                                <v-col cols="3">
                                                                    <v-icon left color="green">mdi-check-all</v-icon>
                                                                    <b>Estado:</b>
                                                                    <v-chip small dark
                                                                        :color="getEstadoColor(detalle.estado.nombre)">
                                                                        {{ detalle.estado.nombre }}
                                                                    </v-chip>
                                                                </v-col>

                                                                <v-col cols="3">
                                                                    <v-icon left
                                                                        color="green">mdi-home-city-outline</v-icon>
                                                                    <b>Lote:</b> {{ detalle?.lote }}
                                                                </v-col>

                                                            </v-row>
                                                        </v-container>
                                                        <v-divider></v-divider>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="facturasMontadasDialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import { listarBodegas } from "~/api/bodegas/bodegas";
import moment from 'moment';
import { mapActions } from "vuex";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('farmacia.movimientos')) {
            return redirect('/');
        }
    },
    name: "movimientoSolicitudCompras",
    props: ["tipo"],
    computed: {
        // valorFactura:{
        //
        // }
    },
    watch: {
        filtroMedicamento: function () {
            if (this.filtroMedicamento && this.filtroMedicamento.length === 4) {
                this.listarMedicamentos(this.filtroMedicamento);
            } else if (this.filtroMedicamento.length < 4) {
                this.medicamentos = [];
            }
        },
    },
    data: () => ({
        dialogLote: false,
        totalValorFacturaEstimado: 0,
        totalValorFacturaCalculado: 0,
        codigoFactura: null,
        detalleLotes: [],
        facturasExistentes: [],
        cargandoExistencias: false,
        facturasMontadasDialog: false,
        detalleNovedades: [],
        detalleNovedadIndice: null,
        filtroMedicamento: null,
        medicamentos: [],
        formNovedad: {
            lote: null,
            tipoNovedad: null,
            observacion: null,
            devolucion: null,
            nuevoMedicamento: null,
            precio: null,
            cantidad: null
        },
        formLote: {
            lote: null,
            cantidad: null,
            temperatura: null,
            observaciones: null
        },
        buscar: '',
        buscarP: '',
        tipoNovedadesLista: [],
        dialogNovedad: false,
        detallesSeleccionados: [],
        dialogDetalle: false,
        solicitudSeleccionada: null,
        headerNovedad: [
            { text: '#', align: 'center', value: 'numero' },
            { text: 'Tipo', align: 'center', value: 'tipoNovedad.nombre' },
            { text: 'Cantidad', align: 'center', value: 'cantidad' },
            { text: 'Nuevo Articulo', align: 'center', value: 'nuevoMedicamento.nombre' },
            { text: 'Nuevo Precio', align: 'center', value: 'precio' },
            { text: 'Observacion', align: 'center', value: 'observacion' },
            { text: 'Devolucion', align: 'center', value: 'devolucion' },
            { text: '', align: 'center', value: 'eliminar' }
        ],
        headers: [
            { text: '', align: 'center', value: 'accion' },
            { text: '# Solicitud', align: 'center', value: 'id' },
            { text: 'Solicitante', align: 'center', value: 'solicitante' },
            { text: 'Fecha Radicacion', align: 'center', value: 'created_at' },
            { text: 'Proveedor', align: 'center', value: 'rep.nombre' },
            { text: '', value: 'detalle' },
            { text: '', value: 'anular' }

        ],
        headersDetalle: [
            { text: 'Medicamento', align: 'center', value: 'medicamento.codesumi.nombre' },
            { text: 'Titular', align: 'center', value: 'medicamento.invima.titular' },
            { text: 'Presentacion', align: 'center', value: 'medicamento.invima.forma_farmaceutica' },
            { text: 'Cantidad Aprobada', align: 'center', value: 'cantidad_aprobada' },
            { text: 'precio Unidad', align: 'center', value: 'precio_unidad_aprobado' },
            { text: 'Valor Total', align: 'center', value: 'valorTotal' },
            { text: 'Lote', align: 'center', value: 'lote' },
            { text: '', align: 'center', value: 'novedad' },
        ],
        headerLotes: [
            { text: '#', align: 'center', value: 'numero' },
            { text: 'Lote', align: 'center', value: 'lote' },
            { text: 'Fecha', align: 'center', value: 'fecha' },
            { text: 'Cantidad', align: 'center', value: 'cantidad' },
            { text: 'Temperatura', align: 'center', value: 'temperatura' },
            { text: 'Observaciones', align: 'center', value: 'observaciones' },
            { text: '', align: 'center', value: 'eliminar' },

        ],
        listaBodegas: [],
        formSolicitudCompras: {
            bodega_origen_id: null
        },
        loadingTabla: false,
        listaSolicitudes: []
    }),
    mounted() {
        this.listarBodegas();
        this.tipoNovedades();
    },
    filters: {
        pesoFormat: (valor) => `$${valor.toLocaleString('es-CO')}`
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarBodegas() {
            this.loadingTabla = true;
            this.$loadingGetRequest(listarBodegas(0, 0)).then(res => {
                this.listaBodegas = res.data
                this.loadingTabla = false;
            }).catch(e => {
                console.log(e);
                this.loadingTabla = false;
            })
        },
        listarSolicitudes() {
            this.dialogDetalle = false
            this.loadingTabla = true;
            this.codigoFactura = null;
            this.$axios.get('solicitud-bodegas/listar/' + this.tipo + '/4/' + this.formSolicitudCompras.bodega_origen_id).then(res => {
                this.listaSolicitudes = res.data
                this.loadingTabla = false;
            }).catch(e => {
                console.log(e);
                this.loadingTabla = false;
            })
        },
        async cargarDetalles(item) {
            // await this.proveedoresMedicamentos();
            this.solicitudSeleccionada = item;
            this.dialogDetalle = true;
        },
        calcularTotal(item) {
            const valorTotal = (parseFloat(item.precio_unidad_aprobado) * (!item.cantidad_aprobada ? 0 : parseInt(item.cantidad_aprobada))).toFixed(2)
            item.valor_total = valorTotal;
            return valorTotal;
        },
        tipoNovedades() {
            this.$axios.$get('tipo-novedad').then(res => {
                this.tipoNovedadesLista = res;
            })
        },
        listarMedicamentos(item) {
            const data = {
                columna: 'producto',
                dato: item,
                page: null,
                filas: 1
            }
            this.$axios.$post('medicamentos/listarVademecum', data).then(res => {

                this.medicamentos = res.map(s => {
                    return {
                        id: s.id,
                        nombre: `${s.invima.producto} (${s.invima.titular})`
                    }
                });
            })
        },
        limpiarFormularioNovedad() {
            for (const prop of Object.getOwnPropertyNames(this.formNovedad)) {
                this.formNovedad[prop] = null;
            }
            for (const prop of Object.getOwnPropertyNames(this.formLote)) {
                this.formLote[prop] = null;
            }
            this.dialogLote = false;
            this.dialogNovedad = false;
        },
        async agregarNovedad() {
            this.solicitudSeleccionada.detalles_solicitud[this.detalleNovedadIndice].novedades.push({ ...this.formNovedad });
            this.limpiarFormularioNovedad();
            this.dialogNovedad = false
        },
        calcularValorFacturaCalculado() {
            let valorTotal = 0;
            let cantidad = 0;
            if (this.detallesSeleccionados.length) {


                this.detallesSeleccionados.forEach(s => {
                    cantidad = s.lotes.reduce((accumulator, object) => {
                        return accumulator + parseFloat(object.cantidad);
                    }, 0)
                    valorTotal += parseFloat(s.precio_unidad_aprobado) * cantidad;
                })

                this.totalValorFacturaCalculado = valorTotal;
            }
            return '$' + valorTotal.toLocaleString('es-CO');
        },
        calcularValorFacturaEstimado() {
            let valorTotal = 0;
            this.detallesSeleccionados.forEach(r => {
                valorTotal += parseFloat(r.precio_unidad_aprobado) * parseFloat(r.cantidad_aprobada)
            })
            this.totalValorFacturaEstimado = valorTotal;
            return '$' + valorTotal.toLocaleString('es-CO');
        },
        GuardarFactura() {
            if (!this.codigoFactura) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'El codigo de Factura es requerido',
                });
            }
            if (this.detallesSeleccionados.length === 0) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'No hay articulos seleccionados',
                });
            }
            if (this.detallesSeleccionados.some(s => !s.lotes || s.lotes.length === 0)) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'Hay Articulos seleccionados sin lote',
                });
            }
            let cantidad = 0;
            this.detallesSeleccionados.forEach(s => {
                cantidad += s.lotes.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.cantidad);
                }, 0)
            })
            this.$axios.$post('movimientos/guardar/1', { solicitud: this.detallesSeleccionados, bodega: this.formSolicitudCompras.bodega_origen_id, factura: this.codigoFactura, cantidadT: cantidad }).then(res => {
                this.imprimir({ tipo: 'ActaRecepcion', numeroFactura: this.codigoFactura })
                this.$toast.success('Aprobada')
                this.dialogDetalle = false
                this.codigoFactura = null
                this.detallesSeleccionados = []
                this.listarSolicitudes()
            })

        },
        agregarLote() {
            if (this.formLote.temperatura < 2 || this.formLote.temperatura > 8) {
                return this.$swal({
                    type: "info",
                    title: "¡Atención!",
                    text: 'La temperatura ingresada debe estar entre 2°C y 8°C, ¿desea agregar el registro?',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {
                        let fechaMinima = moment().add(1, 'months').format('YYYY-MM-DD');

                        if (this.formLote.fecha < fechaMinima) {
                            return this.$swal({
                                type: "error",
                                title: "¡No puede ser!",
                                text: 'La fecha de vencimiento debe ser por lo menos un mes mayor a la fecha actual',
                            });
                        }

                        this.solicitudSeleccionada.detalles_solicitud[this.detalleNovedadIndice].lotes.push({ ...this.formLote });
                        this.limpiarFormularioNovedad();
                        this.dialogLote = false;
                    }
                });
            }

            let fechaMinima = moment().add(1, 'months').format('YYYY-MM-DD');

            if (this.formLote.fecha < fechaMinima) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'La fecha de vencimiento debe ser por lo menos un mes mayor a la fecha actual',
                });
            }

            this.solicitudSeleccionada.detalles_solicitud[this.detalleNovedadIndice].lotes.push({ ...this.formLote });
            this.limpiarFormularioNovedad();
            this.dialogLote = false;
        },


        imprimir($pdf) {
            this.$axios.post('pdf', $pdf, {
                responseType: "arraybuffer"
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            });
        },

        imprimirExcel($id) {
            this.$axios({
                method: 'post',
                params: {
                    id: $id,
                },
                url: '/solicitud-bodegas/importarExcel/',
                responseType: 'blob',
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.download = 'OrdenCompra#' + $id + '.xlsx';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.dialog = false
                this.clear();
            }).catch(err => {
                console.log(err)
            })
        },

        anularSolicitud(item) {
            console.log('fdf', item);
            //   this.loadingTabla = true;
            this.$axios.post('solicitud-bodegas/rechazar-solicitud', item).then(res => {
                this.listarSolicitudes();
                this.$toast.success(res.data.message)

            }).catch(e => {
                console.log(e);
            })
        },

        verificarExistenciaFactura() {
            this.setPreload(true);
            this.facturasExistentes = [];
            this.$axios.get(`movimientos/verificar-existencia-factura/${this.codigoFactura}`)
                .then((res) => {
                    if (res.data === 0) {
                        this.$toast.error('No hay facturas registradas');
                        return;
                    }
                    this.facturasExistentes = res.data;
                    this.facturasMontadasDialog = true;
                })
                .catch((error) => console.log(error))
                .finally(() => this.setPreload(false));
        },

        getEstadoColor(estado) {
            switch (estado) {
                case 'Cerrado':
                    return 'green';
                case 'Autorizado':
                    return 'blue-grey'

            }
        }

    }
}
</script>
