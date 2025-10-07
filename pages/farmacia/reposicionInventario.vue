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
                    <v-card-title>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <div class="d-flex align-center">
                                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                    <span>Reposición inventario</span>
                                </div>
                            </v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="8">
                                <v-autocomplete label="Bodega" v-model="datos.bodega" :items="listaBodegas"
                                    item-text="nombre" return-object>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-text-field label="Codigo" v-model="datos.codigo">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-text-field label="Producto" v-model="datos.producto">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" small @click="generar()">
                            Generar
                        </v-btn>
                        <v-btn color="warning" small @click="limpiarConsultar()">
                            Limpiar
                        </v-btn>
                    </v-card-actions>

                    <v-col cols="12" sm="12" md="12">
                        <v-btn v-if="datosHistoricos.length > 0" color="warning" @click="exportar()">Exportar
                        </v-btn>
                        <v-divider class="mx-12" inset vertical></v-divider>
                        <v-btn v-if="datosSolicitud.length > 0" small rounded color="indigo" dark
                            @click="dialogSolicitud = true">Solicitudes {{datosSolicitud.length}}</v-btn>
                    </v-col>

                    <!-- <pre>{{datosHistoricos}}</pre> -->
                    <v-col cols="12" sm="12" md="12" v-if="datosHistoricos.length >0">
                        <v-text-field v-model="buscar" label="Buscar">

                        </v-text-field>
                        <v-data-table dense :headers="headers"
                            :items="datosHistoricos.filter(s => s.reposicion === 'si')"
                            no-data-text="Sin datos para mostrar" :search="buscar">
                            <template v-slot:[`item.accion`]="{ item }">
                                <v-btn small color="#00b297" dark class="mr-2" @click="verDetalle(item)">Ver
                                </v-btn>
                            </template>
                            <template v-slot:[`item.alerta`]="{ item }">
                                <v-chip color="red" dark small v-if="item.critico && item.clasificacion_abc == 'A'">
                                    {{'' }}
                                </v-chip>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-dialog v-model="dialogDetalle" width="1000px">
                        <v-card>
                            <v-card-title>
                                <h3> {{datosCodesumi.Codigo}}-{{datosCodesumi.Producto}} Pedido Final:
                                    <strong>{{datosCodesumi.pedido_final}}</strong></h3>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <!-- <pre>{{datosCodesumi}}</pre> -->
                                        <v-col cols="12" sm="12" md="12">
                                            <v-data-table dense :headers="headersDetalle" :items="listaDetalles"
                                                no-data-text="Sin datos para mostrar">
                                                <template v-slot:[`item.cantidad`]="{ item }">
                                                    <v-text-field v-model="item.cantidadSolicitada"></v-text-field>
                                                </template>
                                                <template v-slot:[`item.accion`]="{ item }">
                                                    <v-btn small color="#00b297" dark class="mr-2"
                                                        @click="agregarSolicitud(item)">Agregar
                                                    </v-btn>
                                                </template>
                                            </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" small @click="dialogDetalle = false">
                                    Cerrar
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogSolicitud" width="1000px">
                        <v-card>
                            <v-card-title>Solicitud</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-data-table dense :headers="headersSolicitud" :items="datosSolicitud"
                                                no-data-text="Sin datos para mostrar">
                                                <template v-slot:[`item.cantidad`]="{ item }">
                                                    <v-text-field v-model="item.cantidadSolicitada"></v-text-field>
                                                </template>
                                                <!-- <template v-slot:[`item.eliminar`]="{ item }">
                                                    <v-btn small color="#00b297" dark class="mr-2"
                                                        @click="eliminarArticulo(item.index)">Eliminar
                                                    </v-btn>
                                                </template> -->
                                            </v-data-table>
                                        </v-col>

                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" small @click="dialogSolicitud = false">
                                    Cerrar
                                </v-btn>
                                <v-btn v-if="datosSolicitud.length > 0" small color="success"
                                    @click="guardarSolicitud()">Guardar Solicitud</v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>
                </v-card>
            </v-col>




        </v-row>
    </div>
</template>

<script>
import { crearExcel,convertirJsonAMatriz } from "@/utils/excel";
    import {
        mapActions
    } from "vuex";

    import {
        listarBodegas
    } from "~/api/bodegas/bodegas";
    export default {
        name: 'WorkspaceJsonExistencias',

        data() {
            return {
                dialogConsulta: false,
                buscar: '',
                datos: {
                    bodega: '',
                    codigo: '',
                    producto: ''
                },
                listaBodegas: [],
                preload: false,
                datosHistoricos: [],
                totalDispensados: 0,
                datosCodesumi: {},
                listaDetalles: [],
                listaArticulosAgregados: [],
                dialogDetalle: false,
                dialogSolicitud: false,
                datosSolicitud: [],
                headers: [{
                        text: 'Codigo',
                        align: 'center',
                        sortable: true,
                        value: 'Codigo',
                    },
                    {
                        text: 'Producto',
                        align: 'center',
                        sortable: true,
                        value: 'Producto'
                    },
                    {
                        text: 'Promedio',
                        align: 'center',
                        sortable: true,
                        value: 'promedio_mes'
                    },
                    {
                        text: 'ABC',
                        align: 'center',
                        sortable: true,
                        value: 'clasificacion_abc'
                    },
                    {
                        text: 'Stock Minimo',
                        align: 'center',
                        sortable: true,
                        value: 'stock_minimo'
                    },
                    {
                        text: 'Stock Maximo',
                        align: 'center',
                        sortable: true,
                        value: 'stock_maximo'
                    },
                    {
                        text: 'Existencias',
                        align: 'center',
                        sortable: true,
                        value: 'actual'
                    },
                    {
                        text: 'Pedido Final',
                        align: 'center',
                        sortable: true,
                        value: 'pedido_final'
                    },
                    {
                        text: '',
                        align: 'center',
                        sortable: false,
                        value: 'alerta'
                    },
                    {
                        text: '',
                        align: 'center',
                        sortable: false,
                        value: 'accion'
                    }
                ],
                headersDetalle: [{
                        text: '#',
                        align: 'center',
                        sortable: true,
                        value: 'id',
                    },
                    {
                        text: 'Cum',
                        align: 'center',
                        sortable: true,
                        value: 'cum_validacion',
                    },
                    // {
                    //     text: 'Descripción Comercial',
                    //     align: 'center',
                    //     sortable: true,
                    //     value: 'producto',
                    // },
                    {
                        text: 'Titular',
                        align: 'center',
                        sortable: true,
                        value: 'titular',
                    },
                    {
                        text: 'Existencias',
                        align: 'center',
                        sortable: true,
                        value: 'cantidad_total',
                    },
                    {
                        text: 'Cantidad Requerida',
                        align: 'center',
                        sortable: true,
                        value: 'cantidad',
                    },
                    {
                        text: '',
                        align: 'center',
                        sortable: true,
                        value: 'accion'
                    },
                ],
                headersSolicitud: [

                    {
                        text: 'Cun',
                        align: 'center',
                        sortable: true,
                        value: 'cum_validacion',
                    },
                    {
                        text: 'Producto',
                        align: 'center',
                        sortable: true,
                        value: 'producto'
                    },
                    {
                        text: 'Laboratorio',
                        align: 'center',
                        sortable: true,
                        value: 'titular'
                    },
                    {
                        text: 'Cantidad',
                        align: 'center',
                        sortable: true,
                        value: 'cantidad'
                    },
                    {
                        text: '',
                        align: 'center',
                        sortable: true,
                        value: 'eliminar'
                    },
                ],
            };
        },

        mounted() {
            this.listarBodegas()
        },



        methods: {

            ...mapActions('app', ['setPreload']),
            listarBodegas() {
                this.$loadingGetRequest(listarBodegas(0, 0)).then(res => {
                    this.listaBodegas = res.data

                }).catch(e => {
                    console.log(e);
                })
            },

            generar() {
                this.setPreload(true)
                this.$axios.post('bodegas/minMax', {
                    bodega: this.datos.bodega.id,
                    codigo: this.datos.codigo,
                    producto: this.datos.producto
                }).then(res => {
                    this.datosHistoricos = res.data.dispensados.map((item) => {
                        // Creamos un array con los valores necesarios para calcular el promedio.
                        const valores = [item.v1, item.v2, item.v3, item.v4, item.v5];
                        // Calculamos el promedio con tu función.
                        const promedioDecimal = this.calcularPromedio(valores);
                        const promedioRedondeado = Math.round(promedioDecimal);
                        const totalGeneral = this.calcularTotal(valores)
                        const promedioDia = (promedioDecimal / 26)
                        const promedioDiaC = (promedioDecimal / 26).toFixed(0)
                        const punto = (promedioDia * (this.datos.bodega.stock_seguridad + this.datos
                            .bodega.tiempo_reposicion)).toFixed(0)
                        const stokMin = (promedioDia * this.datos.bodega.tiempo_reposicion).toFixed(0)
                        const seguridadCantidad = (parseFloat(stokMin) + parseFloat(punto)).toFixed(0)
                        const final = ((parseFloat(punto) + parseFloat(promedioDecimal)) - parseInt(item.actual)).toFixed(0)
                        return {
                            'Codigo': item.Codigo,
                            'Producto': item.producto,
                            '6': item.v6,
                            '5': item.v5,
                            '4': item.v4,
                            '3': item.v3,
                            '2': item.v2,
                            '1': item.v1,
                            "promedio_mes": promedioRedondeado,
                            "total_general": totalGeneral,
                            "clasificacion_abc": item.abc ? item.abc : "SIN CLASIFICACION",
                            "promedio_dia": promedioDiaC,
                            "valor_maximo": Math.max(...valores),
                            "valor_minimo": Math.min(...valores),
                            "stock_seguridad": this.datos.bodega.stock_seguridad,
                            "tiempo_reposicion": this.datos.bodega.tiempo_reposicion,
                            "cobertura": this.datos.bodega.cobertura,
                            "punto_reposicion": punto,
                            "stock_seguridad_cantidades": seguridadCantidad,
                            "stock_minimo": stokMin,
                            "stock_maximo": (parseFloat(promedioDecimal) * this.datos.bodega.tiempo_reposicion)
                                .toFixed(0),
                            'actual': item.actual,
                            "pedido_final": final,
                            "reposicion": ((parseInt(item.actual) > parseInt(seguridadCantidad) || parseInt(final) === 0) ? "no" :
                                "si"),
                            "critico": (item.critico ? "SI" : "No")
                        }
                    });
                    console.log(this.datosHistoricos);
                }).catch(e => {
                    console.log(e);
                }).finally(e => {
                    this.setPreload(false)
                });
            },

            calcularPromedio(valores) {
                let sumaCuadrados = valores.reduce((acc, num) => acc + Math.pow(num, 2), 0);
                let sumaValores = valores.reduce((acc, num) => acc + num, 0);

                let resultado = sumaValores === 0 ? 0 : sumaCuadrados / sumaValores;

                return resultado.toFixed(2);
            },

            calcularTotal(valores) {
                return valores.reduce((acc, num) => acc + num, 0);
            },



            async exportar() {
                try {
                    const data = convertirJsonAMatriz(this.datosHistoricos)
                    crearExcel(data, 'ReposicionIncentario'+this.datos.bodega.nombre +'.xlsx');
                    this.$toast.success('Alertas descargadas');
                } catch (error) {
                    this.$toast.error('Ha ocurrido un Error al descargar las Alertas')
                }
            },

            verDetalle(item) {

                this.datosCodesumi = item;
                this.dialogDetalle = true;
                this.listaDetalles = [];
                this.setPreload(true)
                this.$axios.post('/bodegas/detallesCodesumisReposicion', {
                    codigo: item.Codigo,
                    bodega: this.datos.bodega.id
                }).then(res => {
                    this.listaDetalles = res.data
                    this.listaDetalles[0].cantidadSolicitada = item.pedido_final
                }).catch(e => {
                    console.log(e.response)
                }).finally(e => {
                    this.setPreload(false)
                })
            },

            agregarSolicitud(item) {
                if (!item.cantidadSolicitada || item.cantidadSolicitada <= 0) {
                    return this.$toast.error('La "cantidad requerida" es requerida.');
                }

                const cantidadSolicitada = parseInt(item.cantidadSolicitada, 10);
                const pedidoFinal = parseInt(this.datosCodesumi.pedido_final, 10);

                if (cantidadSolicitada > pedidoFinal) {
                    return this.$toast.error('La "cantidad requerida" es superior al pedido final.');
                }

                const data = {
                    ...item
                };

                const validacionDatos = this.datosSolicitud.filter(s => s.codigo === item.codigo);

                const sumaExistente = validacionDatos.reduce((acumulador, actual) => {
                    return acumulador + Number(actual.cantidadSolicitada);
                }, 0);

                if (sumaExistente + cantidadSolicitada > pedidoFinal) {
                    return this.$toast.error('La "cantidad requerida" es superior al pedido final.');
                }

                const objIndex = this.datosSolicitud.findIndex(obj => obj.id === data.id);
                if (objIndex !== -1) {
                    return this.$toast.error("El artículo ya se encuentra seleccionado");
                }

                this.datosSolicitud.push(data);
            },

            guardarSolicitud() {
                const articulos = this.datosSolicitud.map((item) => {
                    return {
                        medicamento_id: item.id,
                        cantidad_inicial: item.cantidadSolicitada,
                        bodega_medicamento_id: item.bodega_medicamento_id,
                        descripcion: 'Reposcicion Automatica',
                    }
                })
                let form = {};
                form.tipo_solicitud_bodega_id = 1;
                form.bodega_origen_id = this.datos.bodega.id;
                form.bodega_destino_id = this.datos.bodega.id;
                form.articulos = articulos;
                this.$axios.post('solicitud-bodegas/crearSolicitudCompra', form).then(res => {
                    this.datosSolicitud = [];
                    this.$toast.success('Solicitud Enviada!');
                    this.dialogSolicitud = false;
                    let pdf = {
                        tipo: "ordenCompra",
                        id: res.data
                    };
                    this.imprimir(pdf);
                })
            },

            imprimir($pdf) {
                console.log('xd', $pdf);
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

            eliminarArticulo(id) {
                this.datosSolicitud.splice(id, 1);
                this.dialogSolicitud = false
            },

            limpiarConsultar() {
                this.datosHistoricos = []
                this.datos = {
                    bodega: '',
                    codigo: '',
                    producto: ''
                }
            }



        },
    };

</script>

<style lang="scss" scoped>

</style>
