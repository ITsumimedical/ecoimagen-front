<template>
    <v-row>
        <template>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>

        </template>
        <v-dialog v-model="dialogoOrdenes" persistent max-width="1000px">
            <v-card>
                <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant"
                    class="text-center">
                    <b>Orden</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headerOrdenesAgendadas" :items="listaOrdenes" item-key="id"
                                show-select loading-text="Cargando... por favor espere" v-model="seleccionOrden">
                                <template v-slot:[`item.consulta.afiliado`]="{ item }">
                                    {{
                                        [item.consulta?.afiliado?.nombre, item.consulta?.afiliado?.apellido]
                                    .filter(Boolean)
                                    .join(' ') || 'Sin nombre'
                                    }}
                                </template>
                                <template v-slot:[`item.estado_id`]="{ item }">
                                    <td v-if="item.estado_id == 1">
                                        <v-chip small color="success" text-color="white">{{ item.estado }}</v-chip>
                                    </td>
                                    <td v-else-if="item.estado_id == 49" class="text-xs-center">
                                        <v-chip small color="success" text-color="white">{{ item.estado }}</v-chip>
                                    </td>
                                    <td v-else-if="item.estado_id == 3">
                                        <v-chip color="warning" text-color="white">{{ item.estado }}</v-chip>
                                    </td>
                                    <td v-else-if="item.estado_id == 4">
                                        <v-chip color="success" text-color="white">{{ item.estado }}</v-chip>
                                    </td>
                                    <td v-else>
                                        <v-chip color="red" text-color="white">{{ item.estado }}</v-chip>
                                    </td>
                                </template>
                            </v-data-table>

                        </v-col>
                        <v-col cols="12" sm="12" md="12"
                            v-if="seleccionOrden.length > 0 && seleccionOrden[0].estado_id == 1">
                            <textarea auto-grow label="Observación" v-model="observacionSuspension">

                    </textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarDialogoDetalle()">
                        Cancelar
                    </v-btn>
                    <v-btn small color="warning" @click="suspender()"
                        v-if="seleccionOrden.length > 0 && seleccionOrden[0].estado_id == 1">
                        Suspender
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col cols="2" sm="2" md="2">
            <v-spacer>
                <v-btn color="warning" class="mr-4" @click="cancelarEsquema()">Historico aplicaciones</v-btn>
            </v-spacer>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-expansion-panels focusable>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3>ORDENAMIENTO ESQUEMAS</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-col cols="12" sm="12" md="12">
                            <v-row>
                                <v-col cols="12" sm="12" md="10" v-if="ordenesActivas.length === 0">
                                    <v-autocomplete label="Esquemas" :items="esquemas" item-text="nombreCompleto"
                                        return-object v-model="esquema" @change="listarCodesumiEsquema()">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" v-if="ordenesActivas.length === 0">
                                    <v-text-field label="Ciclo inicial" v-model="esquema.cycleFrom"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" v-if="ordenesActivas.length === 0">
                                    <v-text-field label="Total ciclos" v-model="esquema.ciclos"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" v-if="ordenesActivas.length === 0">
                                    <v-text-field label="Frecuencia" v-model="esquema.frecuencia_repeat"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>

                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3>ORDENAMIENTO MEDICAMENTOS</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- <pre>{{formMedicamento}}</pre> -->
                        <v-col cols="12" sm="12" md="12">
                            <v-row>

                                <v-col cols="12" sm="12" md="8">
                                    <v-autocomplete v-model="formMedicamento.articulo" :items="medicamentos"
                                        item-text="codesumi.nombre" :search-input.sync="medicamento"
                                        no-data-text="Debe ingresar el nombre del medicamento" return-object
                                        label="Digita el nombre de medicamento">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="2">
                                    <v-text-field label="Presentación" readonly
                                        :value="formMedicamento.articulo ? formMedicamento.articulo.codesumi.unidad_presentacion : ''">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="2">
                                    <v-text-field label="Via" readonly
                                        :value="formMedicamento.articulo ? formMedicamento.articulo.codesumi.via : ''">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" class="pt-1 pb-1">
                                    <v-divider></v-divider>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" class="pt-1 pb-1">
                                    <v-text-field v-model="formMedicamento.dosis" label="Cantidad"
                                        type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="2" class="pt-1 pb-1">
                                    <v-text-field v-model="formMedicamento.frecuencia" label="Frecuencia"
                                        type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" class="pt-1 pb-1">
                                    <v-select v-model="formMedicamento.tiempo" label="Unidad tiempo"
                                        :items="['Horas', 'Días']"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="2" class="pt-1 pb-1">
                                    <v-text-field v-model="formMedicamento.duracion" label="Duración (dias al mes)"
                                        type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="2" class="pt-1 pb-1">
                                    <v-select v-model="formMedicamento.meses" label="Número Meses"
                                        :items="[1, 2, 3, 4, 5, 6]"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" class="pt-1 pb-1">
                                    <v-divider></v-divider>
                                </v-col>
                                <v-col cols="12" sm="12" md="2" class="pt-1 pb-1">
                                    <v-text-field v-model="cantidadMensual" outlined label="Cantidad Mensual"
                                        type="number" readonly>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="5" class="pt-1 pb-1">
                                    <v-text-field v-model="formMedicamento.cantidadMedico"
                                        label="Cantidad Mensual Médico" type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="5" class="pt-1 pb-1">
                                    <v-text-field v-model="formMedicamento.observaciones"
                                        label="Observación"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" class="pt-1 pb-1">
                                    <v-btn color="success" class="mr-4" @click="agregarMedicamento()">Agregar</v-btn>
                                    <v-btn color="warning" class="mr-4" @click="limpiarFormulario()">Limpiar
                                        Campos</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>

                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>


        <v-col>
            <v-card>
                <v-data-table dense :headers="headersEsquemasTable" :items="mapEsquema" item-key="id"
                    :items-per-page="5">
                    <template v-slot:[`item.codigoNombre`]="{ item }">
                        <td class="text-xs-center">{{ item.codigo }}-{{ item.nombre }}</td>
                    </template>
                    <template v-slot:[`item.indice_dosis`]="{ item }">
                        <td class="text-xs-center">{{ item.indice_dosis }} {{ indiciSuperficieCorporal }}</td>
                    </template>
                    <template v-slot:[`item.dosis`]="props">
                        <v-edit-dialog :return-value.sync="props.item.dosis" large persistent
                            @save="dosisFormuladaCalculada(props.item)" cancel-text="Cancelar" save-text="Cambiar">
                            <div>{{ props.item.dosis }} {{ props.item.unidad_medida }} <v-icon color="warning"
                                    x-small>mdi-pencil
                                </v-icon>
                            </div>
                            <template v-slot:input>
                                <v-text-field v-model="props.item.dosis" single-line></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.dosis_formulada`]="props">
                        <v-edit-dialog :return-value.sync="props.item.dosis_formulada" large persistent
                            cancel-text="Cancelar" save-text="Cambiar">
                            <div>{{ props.item.dosis_formulada }} {{ props.item.unidad_medida }} <v-icon color="warning"
                                    x-small>
                                    mdi-pencil
                                </v-icon>
                            </div>
                            <template v-slot:input>
                                <v-text-field v-model="props.item.dosis_formulada" single-line></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.cantidad_aplicaciones`]="props">
                        <v-edit-dialog :return-value.sync="props.item.cantidad_aplicaciones" large persistent
                            cancel-text="Cancelar" save-text="Cambiar">
                            <div>{{ props.item.cantidad_aplicaciones }} <v-icon color="warning" x-small>mdi-pencil
                                </v-icon>
                            </div>
                            <template v-slot:input>
                                <v-text-field v-model="props.item.cantidad_aplicaciones" single-line></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.observaciones`]="props">
                        <v-edit-dialog :return-value.sync="props.item.observaciones" large persistent
                            cancel-text="Cancelar" save-text="Cambiar">
                            <div>{{ props.item.observaciones }} <v-icon color="warning" x-small>mdi-pencil
                                </v-icon>
                            </div>
                            <template v-slot:input>
                                <v-text-field v-model="props.item.observaciones" single-line></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.eliminar`]="{ index }">
                        <td class="text-center">
                            <v-btn class="mx-2" fab dark x-small color="error" @click="eliminar(index)">
                                <v-icon dark>mdi-close</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="12" class="pt-1 pb-1" align="right">
            <v-btn v-if="codeSumiEsquema.length > 0" color="primary" class="mr-4" @click="generarOrdenamiento()">
                Ordenar
            </v-btn>
        </v-col>

        <v-col cols="12" sm="12" md="12" class="pt-1 pb-1">
            <v-divider></v-divider>
        </v-col>


        <v-col cols="12" sm="12" md="12">
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(item, i) in ['Ordenes Activas']" :key="i">
                    <v-expansion-panel-header>
                        <h3>{{ item }}</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-col cols="12" sm="12" md="12">
                            <span><b>Nombre esquema:</b> {{ infoOrder.nombre_esquema }}</span>
                            <br /> <span><b>Número ciclo:</b> {{ infoOrder.ciclo }}</span>
                            <br /> <span><b>Total número ciclo:</b> {{ infoOrder.ciclo_total }}</span>
                        </v-col>
                        <v-data-table :headers="headersOrdenesActivas" :items="ordenesActivas" hide-default-footer
                            class="elevation-1" no-data-text="Ningún dato disponible">
                            <template v-slot:[`item.estado`]="{ item }">
                                <td>
                                    <v-chip v-if="parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4"
                                        color="successs">
                                        {{ item.estado.nombre }}</v-chip>
                                    <v-chip v-else-if="parseInt(item.estado_id) === 3"
                                        color="warning">{{ item.estado.nombre }}</v-chip>
                                    <v-chip v-else-if="parseInt(item.estado_id) === 5"
                                        color="error">{{ item.estado.nombre }}</v-chip>
                                </td>
                            </template>
                        </v-data-table>
                        <v-col cols="12" sm="12" md="12"
                            v-if="ordenesActivas.length > 0 && ordenesActivas[0].nombre_esquema">
                            <v-btn color="warning" rounded v-show="ordenesActivas.length > 0" @click="cancelarOrdenOncologica()"> Cancelar </v-btn>
                        </v-col>
                    </v-expansion-panel-content>


                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>
<script>
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: "oncologia",

    props: ['consulta', 'afiliado'],
    data: () => ({
        observacionSuspension: '',
        dialogoOrdenes: false,
        seleccionOrden: [],
        listaOrdenes: [],
        formMedicamento: {
            articulo: null,
            frecuencia: null,
            tiempo: null,
            duracion: null,
            dosis: null,
            meses: null,
            cantidadMedico: null,
            observacion: null
        },
        medicamentos: null,
        medicamento: null,

        singleSelect: false,
        preload: false,
        esquemas: [],
        esquema: {},
        ordenesActivas: [],
        codeSumiEsquema: [],
        indiciSuperficieCorporal: '',
        headersEsquemasTable: [{
            text: "Codigo - Medicamento",
            align: "center",
            value: "codigoNombre",
        }, {
            text: "dosis",
            align: "center",
            value: "dosis",
        }, {
            text: "indice dosis",
            align: "center",
            value: "indice_dosis",
        }, {
            text: "dosis formulada",
            align: "center",
            value: "dosis_formulada",
        }, {
            text: "via",
            align: "center",
            value: "via",
        }, {
            text: "cantidad aplicaciones",
            align: "center",
            value: "cantidad_aplicaciones",
        }, {
            text: "frecuencia",
            align: "center",
            value: "frecuencia",
        }, {
            text: "Observación",
            align: "center",
            value: "observaciones",
        }, {
            text: "Frecuencia duración",
            align: "center",
            value: "frecuencia_duracion",
        }, {
            text: "",
            align: "center",
            value: "eliminar",
        }],
        infoOrder: {

        },
        orden_id: '',
        headersOrdenesActivas: [{
            text: 'Medicamento',
            value: 'codesumi.nombre'
        },
        {
            text: 'Cantidad mensual',
            align: 'center',
            value: 'cantidad_medico'
        },
        {
            text: 'Dosificación',
            align: 'center',
            value: 'dosificacion'
        },
        {
            text: 'Observación',
            align: 'center',
            value: 'observacion'
        },
        {
            text: 'Estado',
            align: 'center',
            value: 'estado'
        },

        ],
        headerOrdenesAgendadas: [{
            text: "Orden",
            sortable: false,
            align: "center",
            value: "id"
        }, {
            text: "N.Documento",
            sortable: false,
            align: "center",
            value: "consulta.afiliado.numero_documento"
        }, {
            text: "Paciente",
            sortable: false,
            align: "center",
            value: "consulta.afiliado"
        },
        {
            text: "Entidad",
            sortable: false,
            align: "center",
            value: "consulta.afiliado.entidad.nombre"
        },
        {
            text: "Esquema",
            sortable: false,
            align: "center",
            value: "nombre_esquema"

        },
        {
            text: "Ciclos",
            sortable: false,
            align: "center",
            value: "paginacion"
        }, {
            text: "Dia",
            sortable: false,
            align: "center",
            value: "dia"
        }, {
            text: "Estado",
            sortable: false,
            align: "",
            value: "estado_id"
        }, {
            text: "Fecha Agendamiento",
            sortable: false,
            align: "",
            value: "fecha_agendamiento"
        },
        ],
    }),

    computed: {
        mapEsquema() {
            return this.codeSumiEsquema.map((detalle) => {
                if (detalle.frecuencia_duracion) {
                    detalle.frecuencia_duracion = detalle.frecuencia_duracion.split(" ");
                    detalle.frecuencia_duracion[1] = detalle.dosis_formulada;
                    detalle.frecuencia_duracion[detalle.frecuencia_duracion.length - 1] = detalle.dias_aplicacion;
                    detalle.frecuencia_duracion = detalle.frecuencia_duracion.join(" ");
                }
                return detalle;
            });
        },
        cantidadMensual() {
            let cantidad = 0;
            if (this.formMedicamento.tiempo == "Horas") {
                cantidad = Math.round(
                    (24 / this.formMedicamento.frecuencia) *
                    this.formMedicamento.dosis *
                    this.formMedicamento.duracion
                );
            } else {
                cantidad = Math.round(
                    (this.formMedicamento.duracion / this.formMedicamento.frecuencia) *
                    this.formMedicamento.dosis
                );
            }
            return cantidad || 0;
        },
    },
    watch: {
        medicamento(val) {
            if (val) {
                if (val.length === 4) {
                    this.listaCodigosHorus();
                } else if (val.length < 4) {
                    this.medicamentos = null;
                }
            } else {
                this.medicamentos = null;

            }
        }
    },
    mounted() {
        this.listarEsquemaOrdenado();
        this.listarEsquemas();
        this.buscarDatosConsulta();
    },
    methods: {

        listaCodigosHorus() {
            this.preload = true;
            this.$axios.$post('medicamentos/listarVademecum', {
                nombre: this.medicamento
            }).then(res => {
                this.medicamentos = res
                this.preload = false;
            }).catch(e => {
                e.response
                this.preload = false;
            })
        },
        limpiarFormulario() {
            for (const prop of Object.getOwnPropertyNames(this.formMedicamento)) {
                this.formMedicamento[prop] = null;
            }
        },
        agregarMedicamento() {
            let data = {};
            this.formMedicamento.codigo = this.formMedicamento.articulo.codesumi.codigo
            this.formMedicamento.nombre = this.formMedicamento.articulo.codesumi.nombre
            this.formMedicamento.cantidad_aplicaciones = this.formMedicamento.cantidadMedico
            this.formMedicamento.via = this.formMedicamento.articulo.codesumi.via
            this.formMedicamento.dosis_formulada = this.formMedicamento.dosis
            if (this.formMedicamento.tiempo == 'Horas') {
                this.formMedicamento.frecuencia_duracion =
                    `${this.formMedicamento.dosis} ${this.formMedicamento.articulo.codesumi.unidad_presentacion} ${this.formMedicamento.articulo.codesumi.via} cada ${this.formMedicamento.frecuencia} Horas por  ${this.formMedicamento.duracion} dias  `
            } else {
                this.formMedicamento.frecuencia_duracion =
                    `${this.formMedicamento.dosis} ${this.formMedicamento.articulo.unidad_presentacion} ${this.formMedicamento.articulo.via} cada ${this.formMedicamento.frecuencia} Días por ${this.formMedicamento.duracion} días  `
            }
            for (const val in this.formMedicamento) {
                data[val] = this.formMedicamento[val]
            }
            this.codeSumiEsquema.push(data);
            this.limpiarFormulario();
        },

        listarEsquemaOrdenado() {
            this.preload = true;
            this.$axios.get('/ordenamiento/ordenes-activas/' + this.consulta + '/3').then(res => {
                this.ordenesActivas = res.data;
                this.infoOrder = {
                    nombre_esquema: res.data[0].nombre_esquema,
                    ciclo: res.data[0].ciclo,
                    ciclo_total: res.data[0].ciclo_total,
                };
                // this.orden_id = res.data.orden_id
                this.preload = false;

            }).catch(e => {
                e.response
                this.preload = false;
            })
        },

        listarEsquemas() {
            this.$axios.get('/esquema/listar').then(res => {
                this.esquemas = res.data.map((code) => ({
                    ...code,
                    cycleFrom: 1,
                    nombreCompleto: `${code.abreviatura_esquema} - ${code.nombre_esquema}`,
                }));
            }).catch(e => {
                console.log(e.response)
            })
        },

        buscarDatosConsulta() {
            this.$axios.get('/historia/registro/' + this.consulta).then(res => {
                this.indiciSuperficieCorporal = res.data.isc
            }).catch(e => {
                console.log(e.response)
            })
        },

        listarCodesumiEsquema() {
            this.codeSumiEsquema = []
            this.$axios.post('/codesumis/codesumiEsquema', {
                esquema: this.esquema.id
            }).then(res => {
                // this.codeSumiEsquema = res.data
                this.codeSumiEsquema = res.data.map((detalle) => {
                    if (detalle.indice_dosis === "ISC") detalle.dosis_formulada = (detalle.dosis * this
                        .indiciSuperficieCorporal).toFixed(1);
                    else detalle.dosis_formulada = detalle.dosis;
                    if (detalle.frecuencia_duracion) {
                        detalle.frecuencia_duracion = detalle.frecuencia_duracion.split(" ");
                        detalle.frecuencia_duracion[1] = detalle.dosis_formulada;
                        detalle.frecuencia_duracion[detalle.frecuencia_duracion.length - 1] = detalle
                            .dias_aplicacion;
                        detalle.frecuencia_duracion = detalle.frecuencia_duracion.join(" ");
                    }
                    return detalle;
                });
            }).catch(e => {
                console.log(e.response)
            })
        },

        dosisFormuladaCalculada(detail) {
            if (detail.indice_dosis === "ISC") detail.dosis_formulada = (detail.dosis * this.indiciSuperficieCorporal)
                .toFixed(1);
            else detail.dosis_formulada = detail.dosis;
        },

        generarOrdenamiento() {
            this.$axios.$post('/ordenamiento/generarOrdenamiento/' + this.consulta + '/3', {
                codeSumiEsquemaSeleccionado: this.codeSumiEsquema,
                frecuencia_repeticion: this.esquema.frecuencia_repeat,
                nombre_esquema: this.esquema.nombre_esquema,
                biografia: this.esquema.biografia,
                ciclo: this.esquema.cycleFrom,
                ciclo_total: this.esquema.ciclos,
            })
                .then(res => {
                    this.codeSumiEsquema = []
                    this.esquema = {
                        ciclos: null,
                        frecuencia_repeat: null,
                    };
                    this.$toast.success('Orden creada con exito')
                    this.listarEsquemaOrdenado();
                })
        },

        cancelarOrdenOncologica() {

            this.$swal({
                title: '¿Segur@ que desea cancelar este esquema?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar'
            }).then((result) => {
                if (result.value) {
                    this.$axios.post('/ordenamiento/cancelarEsquema', {
                        orden_id: this.ordenesActivas[0].orden_id
                    }).then(res => {
                        this.ordenesActivas = []
                        this.infoOrder = {}
                        this.$emit("cerrarModal");
                    }).catch(e => {
                        console.log(e.response)
                    })
                }
            })
        },

        eliminar(index) {
            this.codeSumiEsquema.splice(index, 1)

            if (this.codeSumiEsquema.length == 0) {
                this.esquema = {

                }
            }
        },

        cerrarDialogoDetalle() {
            this.dialogoOrdenes = false
        },

        cancelarEsquema() {
            this.$axios.$post('/ordenamiento/consultaEsquemaPaciente/', {
                afiliado_id: this.afiliado.id,
            })
                .then(res => {
                    this.listaOrdenes = res
                    this.dialogoOrdenes = true

                }).catch(e => {
                    console.log(e.response)
                })
        },

        suspender() {
            this.preload = true
            this.$axios.$post('/ordenamiento/suspenderEsquema/', {
                orden: this.seleccionOrden,
                observacion: this.observacionSuspension
            })
                .then(res => {
                    this.dialogoOrdenes = false
                    this.seleccionOrden = []
                    this.observacionSuspension = ''
                    this.preload = false
                    this.$toast.success('Esquema suspendido con exito')
                }).catch(e => {
                    console.log(e.response)
                    this.preload = false
                })
        }

    }
}

</script>
