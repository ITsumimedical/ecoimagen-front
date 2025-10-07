<template>
    <div>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Procesando Información
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete label="Bodega" v-model="datos.bodega" :items="listaBodegas"
                                    item-text="nombre" item-value="id" @input="inventarioSeleccionado()">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Fecha inicio" type="date" color="primary" dense
                                    v-model="filtro.fechaDesde">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Fecha final" type="date" color="primary" dense
                                    v-model="filtro.fechaHasta">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="10">
                                <v-btn @click="crearMedicamento()" small color="primary">
                                    Cargar Factura
                                </v-btn>
                                <v-btn @click="exportar()" small color="primary">
                                    Exportar saldos
                                </v-btn>
                                <v-btn @click="abrirFactura()" small color="primary">
                                    Factura
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <label>Valor Estimado Bodega:</label> <strong>{{ this.valorBodega | pesoFormat
                                    }}</strong>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="buscar" label="Buscar..." single-line hide-details>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :search="buscar" dense :headers="headers" :items="invetario"
                                    loading-text="Cargando... por favor espere">
                                    <template v-slot:[`item.fecha_vencimiento`]="{ item }">
                                        <v-chip small :class="colorVencido(item.fecha_vencimiento)">{{
                                            item.fecha_vencimiento
                                        }}</v-chip>
                                    </template>
                                    <template v-slot:[`item.estado`]="props">
                                        <v-edit-dialog :return-value.sync="props.item.fecha_vencimiento" large
                                            persistent
                                            @save="cambiarFecha(props.item.lote, props.item.fecha_vencimiento)"
                                            cancel-text="Cancelar" save-text="Cambiar">
                                            <div>{{ props.item.fecha_vencimiento }} <v-icon color="warning"
                                                    small>mdi-pencil</v-icon>
                                            </div>
                                            <template v-slot:input>
                                                <v-text-field v-model="props.item.fecha_vencimiento"
                                                    single-line></v-text-field>
                                            </template>
                                        </v-edit-dialog>
                                    </template>
                                    <template v-slot:[`item.accion`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" small class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="buscarCantidadMedicamento(item)">
                                                    mdi-eye
                                                </v-icon>
                                            </template>
                                            <span>ver</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.nombre`]="{ item }">
                                        <td class="text-xs-right" v-if="datos.bodega === 0">{{ item.nombre }}</td>
                                    </template>

                                </v-data-table>

                            </v-col>

                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-dialog v-model="dialogoInventario" persistent max-width="700px">
                <v-card>

                    <v-alert dense text outlined color="info" class="text-center">Cantidad total en las bodegas
                    </v-alert>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="12">
                                    <span class="subheading">{{ nombreMedicamento }}</span>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-data-table dense :headers="headersOtherStock" :items="stock" hide-default-footer
                                        loading-text="Cargando... por favor espere">
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogoInventario = false">Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>


            <v-dialog v-model="dialogoMedicamentos" persistent max-width="700px">
                <v-card>

                    <v-alert dense text outlined color="info" class="text-center" v-if="guardar">Agregar medicamentos
                    </v-alert>
                    <v-alert dense text outlined color="info" class="text-center" v-else>Editar medicamentos
                    </v-alert>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="12">
                                    <input ref="adjuntos" type="file" @change="agregarActa" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogoMedicamentos = false">Cancelar
                        </v-btn>
                        <v-btn color="success" v-if="guardar" small @click="guardarFactura()">Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>

            <v-dialog v-model="dialogoFactura" persistent max-width="700px">
                <v-card>

                    <v-alert dense text outlined color="info" class="text-center">Facturas
                    </v-alert>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="searchFactura" label="Buscar" single-line
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-data-table dense :headers="headersFactura" :items="factura"
                                        no-data-text="Sin datos para mostrar" :search="searchFactura">
                                        <template v-slot:item.proveedores="{ item }">
                                            {{ item.nombre??item.proveedor }}
                                        </template>
                                        <template v-slot:[`item.accion`]="{ item }">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                        @click="imprimir(item)">
                                                        mdi-file-document
                                                    </v-icon>
                                                </template>
                                                <span>Acta de recepción</span>
                                            </v-tooltip>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogoFactura = false, factura = []">Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>


        </v-row>
    </div>
</template>

<script>
import { listarBodegas } from "~/api/bodegas/bodegas";
import { convertirJsonAMatriz, crearExcel } from "@/utils/excel.js";
import { mapActions } from "vuex";
export default {
    name: 'WorkspaceJsonExistencias',

    data() {
        return {
            datos: {
                bodega: null,
            },
            actas: {},
            searchFactura: '',
            listaBodegas: [],
            valorBodega: 0,
            invetario: [],
            buscar: '',
            headers: [
                {
                    text: 'Código',
                    align: 'right',

                    value: 'medicamento.codigo_medicamento'
                },
                {
                    text: 'Bodega',
                    align: 'right',

                    value: 'nombre'
                },
                {
                    text: 'Descripción',
                    align: 'right',

                    value: 'medicamento.codesumi.nombre'
                },
                {
                    text: 'Descripción comercial',
                    align: 'right',

                    value: 'medicamento.invima.producto'
                },
                {
                    text: 'Títular',
                    align: 'right',

                    value: 'medicamento.invima.titular'
                },
                {
                    text: 'Cum',
                    align: 'right',

                    value: 'medicamento.cum'
                },
                {
                    text: 'Lote',
                    align: 'right',

                    value: 'codigo'
                },
                {
                    text: 'Exitencia',
                    align: 'right',

                    value: 'cantidad'
                },
                {
                    text: 'Fecha vencimiento',
                    align: 'left',

                    value: 'fecha_vencimiento'
                },
                {
                    text: 'Estado Molécula',
                    align: 'right',

                    value: 'estado'
                },
                {
                    text: '',
                    align: 'right',

                    value: 'medicamento.invima.estado_cum'
                },
                {
                    text: '',
                    align: 'right',

                    value: 'accion'
                }
            ],
            headersOtherStock: [
                {
                    text: 'Bodega',


                    value: 'nombre'
                },
                {
                    text: 'Cantidad total',

                    value: 'cantidad_total'
                },
            ],
            headersFactura: [{
                text: 'Factura',
                align: 'right',
                value: 'detalle_id'
            },
            {
                text: 'Proveedor',
                align: 'right',
                value: 'proveedores'
            },
            {
                text: 'Fecha',
                align: 'center',
                value: 'created_at'
            },
            {
                text: 'Acciones',
                align: 'right',
                value: 'accion'
            }
            ],
            dialogoInventario: false,
            dialogoMedicamentos: false,
            dialogoFactura: false,
            nombreMedicamento: '',
            stock: [],
            filtro: {
                fechaDesde: '',
                fechaHasta: '',
            },
            guardar: false,
            preload: false,
            factura: [],
            medicamentosBodega: []

        };
    },

    mounted() {
        this.listarBodegas()
    },

    filters: {

        pesoFormat: (valor) => `$${new Intl.NumberFormat().format(valor) || 0}`
    },

    watch: {
        buscar: function () {
            if (this.buscar && this.buscar.length == 3) {
                this.getArticulosBodega();
            }
        }
    },

    methods: {

        ...mapActions('app', ['setPreload']),

        listarBodegas() {
            this.$loadingGetRequest(listarBodegas(0, 0)).then(res => {

                this.listaBodegas = res.data
                this.listaBodegas.unshift({
                    'nombre': 'Todas las bodegas',
                    'id': 0
                })

            }).catch(e => {
                console.log(e);
            })
        },

        inventarioSeleccionado() {
            this.valorBodega = 0;
            this.preload = true
            this.$axios.post('bodegas/inventarioBodega', {
                bodega_id: this.datos.bodega
            }).then(res => {
                res.data.forEach(s => {
                    if (s.precio_unidad) {
                        this.valorBodega += parseInt(s.precio_unidad) * parseInt(s.cantidad)
                    }
                })
                this.invetario = res.data
                this.preload = false
            }).catch(e => {
                console.log(e);
                this.preload = false
            })
        },

        colorVencido(fecha) {
            let fechaActual = this.$moment();
            let fechaAnterior = this.$moment(fecha);
            let diferencia = fechaAnterior.diff(fechaActual, 'days')
            if (diferencia <= 180) {
                return 'red white--text';
            } else {
                return 'green white--text';
            }
        },

        cambiarFecha(lote, fecha) {
            this.$axios.put('bodega-medicamentos/actualizarLote/' + lote, {
                fecha_vencimiento: fecha
            }).then(res => {

            }).catch(e => {
                console.log(e);
            })
        },

        buscarCantidadMedicamento(item) {
            console.log('dfd', item);
            this.dialogoInventario = true
            this.nombreMedicamento = item.medicamento.invima.producto
            this.$axios.post('bodega-medicamentos/inventario', {
                bodega_id: item.bodegaMedicamento
            }).then(res => {
                this.stock = res.data
            }).catch(e => {
                console.log(e);
            })
        },

        crearMedicamento() {
            this.guardar = true,
                this.dialogoMedicamentos = true
        },

        abrirFactura() {
            this.dialogoFactura = true
            let data = {
                bodega_id: this.datos.bodega,
                fecha_desde: this.filtro.fechaDesde,
                fecha_hasta: this.filtro.fechaHasta
            }
            this.$axios.post('solicitud-bodegas/solicitudCompras', data).then(res => {
                this.factura = res.data
            }).catch(e => {
                console.log(e);
            })

        },

        agregarActa(e) {
            const acta = e.target.files
            this.actas.file = acta[0]
        },

        async exportar() {
            try {
                this.setPreload(true)
                const response = await this.$axios.post('/bodega-medicamentos/exportar?bodega_id=' + this.datos.bodega);
                const data = convertirJsonAMatriz(response.data);
                crearExcel(data, 'saldos.xlsx');
            } catch (error) {
                this.$toast.error('Erro al generar el informe.')
            } finally {
                this.setPreload(false)
            }
        },

        guardarFactura() {
            let formData = new FormData();
            formData.append('adjunto', this.actas.file);
            this.$axios.post('bodegas/guardarFactura', formData).then(res => {
                this.dialogoMedicamentos = false
            }).catch(e => {
                // this.$toast.error(e.response.data.mensaje)
                console.log(e);
            })
        },

        imprimir(item) {
            const data = {
                tipo: 'ActaRecepcion',
                numeroFactura: item.detalle_id
            }
            this.$axios.post('pdf', data, {
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

        getArticulosBodega() {
            this.$axios.post('bodegas/articulosBodega', { bodega_id: this.datos.bodega, nombre: this.buscar }).then(res => {
                this.medicamentosBodega = res.data
            }).catch(e => {
                console.log(e);
            })
        }

    },
};

</script>

<style lang="scss" scoped></style>
