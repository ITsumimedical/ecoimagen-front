<template>
    <div>
        <template>
            <div class="text-center">
                <v-dialog v-model="cargando" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>


        <v-dialog v-model="dialogDetalle" width="1200" persistent>
            <v-card v-if="solicitudSeleccionada">
                <v-card-title class="text-h5 grey lighten-2 mb-8">
                    Detalle Solicitud

                    <v-spacer></v-spacer>
                    <v-btn color="error" class="ma-1" small dark @click="rechazarSolicitud()">Anular</v-btn>
                    <v-btn
                        v-if="solicitudSeleccionada.detalles_solicitud.filter(s => parseFloat(s.precio_unidad) < 1 || s.precio_unidad == null || !s.precio_unidad).length === 0
                            && solicitudSeleccionada.detalles_solicitud.filter(s => s.cantidad_aprobada == null || !s.cantidad_aprobada).length === 0"
                        color="success" class="ma-1" small dark @click="aprobarSolicitud">Aprobar
                    </v-btn>
                </v-card-title>
                <!-- <pre>{{proveedor}}</pre> -->
                <v-data-table :headers="headersDetalle" :items="solicitudSeleccionada.detalles_solicitud"
                    sort-by="calories" class="elevation-1" disable-pagination hide-default-footer>
                    <template v-slot:[`item.cantidad_aprobada`]="{ item }">
                        <v-text-field type="number" v-model="item.cantidad_aprobada"></v-text-field>
                    </template>
                    <template v-slot:[`item.precioUnidad`]="{ item }">
                        <v-text-field type="number" min="1" step="any" v-model="item.precio_unidad"
                            @input="cambiarPrecioProductoAlerta(item)"></v-text-field>
                    </template>
                    <template v-slot:[`item.valorTotal`]="{ item }">
                        $ {{ Math.trunc(calcularTotal(item)).toLocaleString('es-CO') }}
                    </template>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-alert :value="true" type="info">
                                Esta a punto de autorizar o anular una solicitud de compra por un valor total de <br>
                                <strong>
                                    $ {{ precioTotalFactura() }} </strong>
                            </v-alert>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-autocomplete no-data-text="Digite el nombre o el nit del proveedor"
                                :search-input.sync="prestador" dense v-model="proveedor" :items="proveedores"
                                :item-text="concatenarPrestador" item-value="id" label="Proveedor"
                                @input="BuscarPreciosActuales($event)">
                            </v-autocomplete>
                        </v-toolbar>
                    </template>
                </v-data-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark @click="listarSolicitudes" small>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-row>
                <v-col cols="12" md="12">
                    <v-col cols="12" md="12">
                        <v-autocomplete @change="listarSolicitudes" v-model="formSolicitudCompras.bodega_origen_id"
                            dense outlined label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre"
                            item-value="id" required>
                        </v-autocomplete>
                    </v-col>
                </v-col>
            </v-row>
            <v-row v-if="formSolicitudCompras.bodega_origen_id">
                <v-col cols="12" md="12">
                    <v-text-field label="Buscar" v-model="buscarP"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                    <v-data-table :headers="headers" :items="listaSolicitudes" item-key="id" :search="buscarP"
                        loading-text="Cargando... Por favor espere">
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
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="imprimir({ tipo: 'ordenCompra', id: item.id })">
                                        mdi-arrow-down-bold-circle-outline
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
    </div>
</template>
<script>
import {
    listarBodegas
} from "~/api/bodegas/bodegas";
import {
    mapActions
} from "vuex";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('farmacia.movimientos')) {
            return redirect('/');
        }
    },
    name: "auditoriaSolicitudCompras",
    props: ["tipo"],
    data: () => ({
        proveedor: null,
        prestador: null,
        proveedores: [],
        cargando: false,
        solicitudSeleccionada: null,
        detalleSolicitado: [],
        dialogDetalle: false,
        loadingTabla: false,
        expanded: [],
        preciosOriginales: {},
        tiempoCambiarPrecio: null,
        headers: [{
            text: '# Solicitud',
            align: 'center',
            value: 'id'
        },
        {
            text: 'Solicitante',
            align: 'center',
            value: 'solicitante'
        },
        {
            text: 'Fecha Radicacion',
            align: 'center',
            value: 'created_at'
        },
        {
            text: '',
            value: 'detalle'
        },
        ],
        headersDetalle: [{
            text: 'Medicamento',
            align: 'center',
            value: 'medicamento.codesumi.nombre'
        },
        {
            text: 'Cum',
            align: 'center',
            value: 'medicamento.cum'
        },
        {
            text: 'Titular',
            align: 'center',
            value: 'medicamento.invima.titular'
        },
        {
            text: 'Presentacion',
            align: 'center',
            value: 'medicamento.invima.forma_farmaceutica'
        },
        {
            text: 'Cantidad Solicitada',
            align: 'center',
            value: 'cantidad_inicial'
        },
        {
            text: 'Cantidad Aprobada',
            align: 'center',
            value: 'cantidad_aprobada'
        },
        {
            text: 'precio Unidad',
            align: 'center',
            value: 'precioUnidad'
        },
        {
            text: 'Valor Total',
            align: 'center',
            value: 'valorTotal'
        },
        ],
        listaBodegas: [],
        listaSolicitudes: [],
        formSolicitudCompras: {
            bodega_origen_id: null
        },
        buscarP: '',
        prestador: ''
    }),
    mounted() {
        this.listarBodegas();
    },

    watch: {
        prestador(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarPrestadores();
                } else if (val.length < 6) {
                    this.proveedor = null;
                }
            } else {
                this.proveedor = null;
            }
        }
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listarBodegas() {

            this.$loadingGetRequest(listarBodegas(0, 0)).then(res => {
                this.listaBodegas = res.data
            }).catch(e => {
                console.log(e);
            })
        },
        listarSolicitudes() {
            this.setPreload(true);
            this.proveedor = null;
            this.dialogDetalle = false

            this.$axios.get('solicitud-bodegas/listar/' + this.tipo + '/3/' + this.formSolicitudCompras.bodega_origen_id)
                .then(res => {
                    const data = [];
                    res.data.forEach(s => {
                        let obj = s
                        obj.detalles_solicitud = s.detalles_solicitud.map(r => {
                            r.precio_unidad = null
                            r.cantidad_aprobada = parseFloat(r.cantidad_inicial)
                            return r;
                        })
                        data.push(obj)
                    })
                    this.listaSolicitudes = data
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.setPreload(false);
                })
        },
        aprobarSolicitud() {
            if (this.proveedor == null) {
                return this.$swal(
                    'Es necesario seleccionar un prestador!',
                    '',
                    'error'
                )
            }

            this.solicitudSeleccionada.proveedor = this.proveedor;
            this.$axios.post('solicitud-bodegas/aprobar-solicitud', this.solicitudSeleccionada).then(res => {
                this.$toast.success(res.data.message)
                this.listarSolicitudes();
                let pdf = {
                    tipo: "ordenCompra",
                    id: this.solicitudSeleccionada.id
                };
                this.imprimir(pdf);
            }).catch(e => {
                console.log(e);
            })
        },
        rechazarSolicitud() {

            this.solicitudSeleccionada.proveedor_id = this.proveedor
            this.$axios.post('solicitud-bodegas/rechazar-solicitud', this.solicitudSeleccionada).then(res => {
                this.listarSolicitudes();
                this.$toast.success(res.data.message)
            }).catch(e => {
                console.log(e);
            })
        },
        async cargarDetalles(item) {
            // await this.listarPrestadores();
            this.solicitudSeleccionada = item;
            this.dialogDetalle = true;
        },
        calcularTotal(item) {
            let precio = 0;
            if (item.hasOwnProperty('precio_unidad') === true && !isNaN(item.precio_unidad) && item.precio_unidad) {
                precio = parseFloat(item.precio_unidad)
            }
            const valorTotal = (precio * (!item.cantidad_aprobada ? 0 : parseInt(item.cantidad_aprobada))).toFixed(2)
            item.valor_total = valorTotal;
            return valorTotal;
        },
        precioTotalFactura() {
            let total = 0;
            this.solicitudSeleccionada.detalles_solicitud.forEach(s => {
                total += (!s.precio_unidad ? 0 : parseFloat(s.precio_unidad)) * (!s.cantidad_aprobada ? 0 : parseInt(s
                    .cantidad_aprobada));
            })

            return total.toFixed();
        },
        listarPrestadores() {
            this.cargando = true
            this.$axios.post('reps/listar?page=0', {
                proveedor: this.prestador
            }).then(res => {
                this.cargando = false
                this.proveedores = res.data
            }).catch(e => {
                this.cargando = false
                console.log(e);
            })
        },
        BuscarPreciosActuales(proveedor) {
            if (proveedor) {
                const articulos = this.solicitudSeleccionada.detalles_solicitud.map((s) =>
                    parseInt(s.medicamento_id)
                );

                this.setPreload(true);
                this.$axios
                    .$post("precios/precio-actual/" + proveedor, articulos)
                    .then((res) => {
                        if (res.length === 0) {
                            this.$toast.info("No se encontraron precios para los medicamentos solicitados");
                            return;
                        }
                        res.forEach((s) => {
                            const id = this.solicitudSeleccionada.detalles_solicitud.findIndex(
                                (r) => parseInt(r.medicamento_id) === parseInt(s.medicamento_id)
                            );

                            if (id !== -1) {
                                // Guardar el precio original
                                this.$set(this.preciosOriginales, s.medicamento_id, s.precio_unidad);

                                // Asignar el precio recibido de la API
                                this.solicitudSeleccionada.detalles_solicitud[id].precio_unidad = s.precio_unidad;
                            }
                        });
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            }
        },

        cambiarPrecioProductoAlerta(item) {
            // Limpiar timeout previo si existe
            if (this.tiempoCambiarPrecio) clearTimeout(this.tiempoCambiarPrecio);

            // Establecer un nuevo timeout para 2 segundos
            this.tiempoCambiarPrecio = setTimeout(() => {
                const precioOriginal = this.preciosOriginales[item.medicamento_id];

                // Si el precio cambió con respecto al original, mostrar alerta
                if (item.precio_unidad !== precioOriginal) {
                    return this.$swal({
                        title: "¿Estás seguro?",
                        text: `¿Deseas cambiar el precio de este producto?`,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, cambiar",
                        cancelButtonText: "No",
                    }).then((result) => {
                        if (!result.value) {
                            // Si cancela, volver al precio original
                            this.$set(item, "precio_unidad", precioOriginal);
                        }
                    });
                }
            }, 2000); // Esperar 2 segundos antes de mostrar la alerta
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
                url: '/solicitud-bodegas/importarExcel',
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
            }).catch(err => {
                console.log(err)
            })
        },

        concatenarPrestador(listarPrestadores) {
            return `${listarPrestadores.prestadores.nit} | ${listarPrestadores.prestadores.nombre_prestador}-${listarPrestadores.municipio.nombre}`;
        },

    }
}

</script>
