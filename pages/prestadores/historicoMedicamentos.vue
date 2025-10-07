<template>
    <div>
        <!-- Envio de Correo Electronico -->
        <v-dialog v-model="modalEmail" persistent max-width="600px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-email-arrow-right-outline" type="success">Enviar correo
                    electrónico
                </v-alert>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="emailEnvio" label="Correo electrónico" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error"
                        @click="emailEnvio = null; datosEnvioEmail = null; modalEmail = false;">Cerrar
                    </v-btn>
                    <v-btn small color="success" @click="SendEmail()">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
        <v-card>
            <v-alert class="text-center" dense text border="left" type="info" icon="mdi-history"><b>Dispensación
                    Medicamentos</b>
            </v-alert>
            <v-container>
                <v-row dense>
                    <v-col cols="12" md="3" sm="3">
                        <v-autocomplete v-model="formFilter.tipo" dense label="Estado" :items="tipos" item-value="id"
                            item-text="nombre" outlined @change="ordenes = [], total = 0"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-container>
            <v-data-table hide-default-footer disable-pagination dense :search="search" no-data-text="No hay registros"
                v-if="ordenes.length > 0" :headers="headersOrdenes" :items="ordenes">
                <template v-slot:[`item.fechaCreacion`]="{ item }">
                    <td class="text-center">{{ item.created_at.substr(0, 10) }}</td>
                </template>
                <template v-slot:[`item.dosis`]="{ item }">
                    <td>tomar {{ item.dosis }} {{ item.unidad_presentacion }} cada {{ item.frecuencia }}
                        {{ item.unidad_tiempo }}</td>
                </template>
                <template v-slot:[`item.prestador`]="{ item }">
                    <td @click="openDialog(item)">{{ item.rep ? item.rep.nombre : 'Sin direccion' }}</td>
                </template>
                <template v-slot:[`item.estado`]="{ item }">
                    <td class="text-center">
                        <v-chip small v-if="parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4"
                            color="success">
                            {{ item.estado.nombre }}</v-chip>
                        <v-chip small v-else-if="parseInt(item.estado_id) === 3" color="warning"
                            @click="verNota(item.cambio_orden)">{{ item.estado.nombre }}</v-chip>
                        <v-chip small v-else-if="parseInt(item.estado_id) === 5" color="error"
                            @click="verNota(item.cambio_orden)">
                            {{ item.estado.nombre }}</v-chip>
                        <v-chip small v-else-if="parseInt(item.estado_id) === 20" color="error"
                            @click="verNota(item.cambio_orden)">
                            {{ item.estado.nombre }}</v-chip>
                    </td>
                </template>
                <template v-slot:[`item.detalles`]="{ item }">
                    <v-tooltip bottom v-if="item.estado_id == 1 || item.estado_id == 4">
                        <template v-slot:activator="{ on }">
                            <v-btn icon color="info" v-on="on" @click="abrirModalDetalle(item)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                        <span>Adjuntos</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="(item.estado_id == 1 || item.estado_id == 4 || item.estado_id == 20)">
                        <template v-slot:activator="{ on }">
                            <v-btn icon color="blue-grey" v-on="on" @click="modaldescripcionAuditoria(item)">
                                <v-icon>mdi-message-alert </v-icon>
                            </v-btn>
                        </template>
                        <span>Observaciones de Auditoria</span>
                    </v-tooltip>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <td class="text-center">
                        <v-tooltip bottom v-if="item.estado_id == 1 || item.estado_id == 4">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="green" v-on="on" @click="imprimir(item)">
                                    <v-icon>mdi-file-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar</span>
                        </v-tooltip>
                        <v-tooltip bottom
                            v-if="(item.estado_id == 1 || item.estado_id == 4) && $can('prestadores.medicamentos.dispensar')">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="info" v-on="on" @click="modalDispensarOrden(item)">
                                    <v-icon>mdi-pill</v-icon>
                                </v-btn>
                            </template>
                            <span>Dispensar</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.estado_id == 1 || item.estado_id == 4">
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="warning" v-on="on"
                                    @click="datosEnvioEmail = item; modalEmail = true">
                                    <v-icon>mdi-email-fast </v-icon>
                                </v-btn>
                            </template>
                            <span>Enviar Correo</span>
                        </v-tooltip>
                    </td>
                </template>
            </v-data-table>
            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="buscarOrdenes()">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="buscarOrdenes()">
                    </v-select>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog persistent width="350" v-model="dialogoNota" v-if="dialogoNota">
            <v-card>
                <v-alert dense text border="left" type="success">Nota</v-alert>
                <v-container>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <h5>Anulacion realizada el día {{ datosNota.created_at.substring(0, 10) }} </h5>
                            <div>
                                <h4>Observación</h4>
                            </div>
                            <div>
                                <p>{{ datosNota.observacion }}</p>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark small color="red" @click="dialogoNota = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalDipensacionOrdenes" persistent width="1550">
            <v-card>
                <v-alert border="left" text dense type="info">
                    <h4>Dispensación</h4>
                </v-alert>
                <v-card-text>
                    <template>
                        <v-data-table :headers="headersMedicamentos" :items="medicamentos" :items-per-page="5"
                            class="elevation-1">
                            <template v-slot:[`item.fechaCreacion`]="{ item }">
                                <td class="text-center">{{ item.created_at.substr(0, 10) }}</td>
                            </template>
                            <template v-slot:[`item.cantidad_pendiente`]="{ item }">
                                <td class="text-center">{{ item.dispensado ? item.dispensado.pendiente : '0' }}</td>
                            </template>
                            <template v-slot:[`item.cantidad_dispensado`]="{ item }">
                                <td class="text-center">{{ item.dispensado ? item.dispensado.dispensado : '0' }}</td>
                            </template>
                            <template v-slot:[`item.cantidad_mensual_disponible`]="{ item }">
                                <v-edit-dialog :return-value.sync="item.cantidad_mensual_disponible"
                                    @save="guardarDispensacion(item)" cancel-text="cancelar" save-text="Guardar" large
                                    persistent>
                                    {{ item.cantidad_mensual_disponible }}
                                    <template v-slot:input>
                                        <v-text-field v-model="item.cantidad_mensual_disponible" type="number"
                                            label="Cant. Dispensar" autofocus single-line>
                                        </v-text-field>
                                    </template>
                                </v-edit-dialog>
                            </template>
                            <template v-slot:[`item.estado`]="{ item }">
                                <td class="text-center">
                                    <v-chip small
                                        v-if="parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4"
                                        color="success">
                                        {{ item.estado.nombre }}</v-chip>
                                    <v-chip small v-else-if="parseInt(item.estado_id) === 3" color="warning"
                                        @click="verNota(item.cambio_orden)">{{ item.estado.nombre }}</v-chip>
                                    <v-chip small v-else-if="parseInt(item.estado_id) === 5" color="error"
                                        @click="verNota(item.cambio_orden)">
                                        {{ item.estado.nombre }}</v-chip>
                                    <v-chip small v-else-if="parseInt(item.estado_id) === 20" color="error"
                                        @click="verNota(item.cambio_orden)">
                                        {{ item.estado.nombre }}</v-chip>
                                </td>
                            </template>
                        </v-data-table>
                    </template>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="modalDipensacionOrdenes = false, limpiarData()">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modaldescricionAuditoria" persistent width="550">
            <v-card>
                <v-alert border="left" text dense type="info">
                    <h4>Observaciones de auditoria</h4>
                </v-alert>
                <v-container>
                    <v-row dense>
                        <v-col v-for="item in descripcionAuditoria" :key="item" cols="12" sm="12" md="12">
                            <h5>Auditoria realizada el día {{ item.created_at.substring(0, 10) }} </h5>
                            <div>
                                <h4>Observación</h4>
                            </div>
                            <div>
                                <p>{{ item.observaciones }}</p>
                            </div>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="modaldescricionAuditoria = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent width="1500px" v-model="dialogoDetalleOrden">
            <v-card>
                <v-alert dense text border="left" type="success">Detalle de la orden</v-alert>
                <v-col cols="12" sm="12" md="12">
                    <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-alert dense text border="left" type="success">Adjuntos</v-alert>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table :headers="filesHeaders" :items="listaAdjuntos" dense
                            no-data-text="El afiliado no tiene adjuntos">
                            <template v-slot:[`item.created_at`]="{ item }">
                                <td>
                                    {{ item.created_at.substring(0, 10) }}
                                </td>
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="consultarAdjunto(item.ruta)">
                                            mdi-file-document
                                        </v-icon>
                                    </template>
                                    <span>Gestionar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark small color="red" @click="dialogoDetalleOrden = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('prestadores.historicoDispensacionMedicamentos')) {
            return redirect('/');
        }
    },
    components: {
        AfiliadoComponent,
    },
    name: "dispensacionMedicamentos",
    data: () => ({
        pagina: 1,
        total: 0,
        snack: false,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 5,
        datosEnvioEmail: null,
        modalDipensacionOrdenes: false,
        dialogoDetalleOrden: false,
        modaldescricionAuditoria: false,
        listaPrestadores: [],
        dialogoAnular: false,
        emailEnvio: null,
        modalEmail: false,
        dialogoNota: false,
        cargando: false,
        afiliado: [],
        formAuditoria: {
            estado: null,
            observacion: null
        },
        cantidad_dispensada: null,
        descripcionAuditoria: [],
        ModalPrestadorprestador: false,
        datosNota: {},
        modalCambiarEstado: false,
        dialogoExportar: false,
        search: '',
        formFilter: {
            documento: '',
            tipo: '',
        },
        ordenes: [],
        medicamentos: [],
        tipos: [],
        filesHeaders: [{
            text: "Nombre",
            align: "center",
            value: "nombre"
        },
        {
            text: "Fecha",
            align: "",
            value: "created_at"
        },
        {
            text: "Adjunto",
            align: "center",
            value: "acciones"
        }
        ],
        headersOrdenes: [{
            text: '# Orden',
            align: 'center',
            sortable: false,
            value: 'orden_id',
        }, {
            text: 'Fecha creacion',
            align: 'center',
            sortable: true,
            value: 'fechaCreacion',
        },
        {
            text: 'Fecha vigencia',
            align: 'center',
            sortable: true,
            value: 'fecha_vigencia',
        },
        {
            text: 'Afiliado',
            align: 'center',
            sortable: false,
            value: 'orden.consulta.afiliado.nombre_completo',
        },
        {
            text: 'Documento',
            align: 'center',
            sortable: false,
            value: 'orden.consulta.afiliado.numero_documento',
        },
        {
            text: 'Estado',
            align: 'center',
            sortable: false,
            value: 'estado',
        },
        {
            text: '',
            align: 'center',
            sortable: false,
            value: 'imprimir',
        },
        {
            text: 'Acciones',
            align: 'center',
            sortable: false,
            value: 'acciones',
        },
        ],
        headersMedicamentos: [{
            text: '# Consecutivo',
            align: 'center',
            sortable: true,
            value: 'id',
        },
        {
            text: '# Orden',
            align: 'center',
            sortable: false,
            value: 'orden_id',
        },
        {
            text: 'Paginacion',
            align: 'center',
            sortable: false,
            value: 'paginacion',
        },
        {
            text: 'Fecha creacion',
            align: 'center',
            sortable: true,
            value: 'fechaCreacion',
        },
        {
            text: 'Fecha vigencia',
            align: 'center',
            sortable: true,
            value: 'fecha_vigencia',
        },
        {
            text: 'Código',
            align: 'center',
            sortable: false,
            value: 'codigo',
        },
        {
            text: 'Nombre',
            align: 'center',
            sortable: false,
            value: 'nombre',
        },
        {
            text: '# total a dispensar',
            align: 'center',
            sortable: false,
            value: 'cantidad_mensual_disponible',
        },
        {
            text: 'Estado',
            align: 'center',
            sortable: false,
            value: 'estado',
        },
        {
            text: '# total Pendiente',
            align: 'center',
            sortable: false,
            value: 'cantidad_pendiente',
        },
        {
            text: '# total dispensado',
            align: 'center',
            sortable: false,
            value: 'cantidad_dispensado',
        },
        ],

        listaAdjuntos: [],
        estados: [{
            nombre: 'PENDIENTE',
            id: 3
        }, {
            nombre: 'INADECUADO',
            id: 20
        }, {
            nombre: 'NEGADO',
            id: 21
        }, {
            nombre: 'ANULADO',
            id: 5
        }, {
            nombre: 'APROBADO SIN AUTORIZACIÓN',
            id: 1
        }, {
            nombre: 'APROBADO CON AUTORIZACIÓN',
            id: 4
        }],
    }),

    watch: {
        prestador(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarPrestadores();
                } else if (val.length < 6) {
                    this.listaPrestadores = null;
                }
            } else {
                this.listaPrestadores = null;
            }
        }
    },

    mounted() {
        this.buscarOrdenesMedicamentos();
    },

    methods: {

        buscarOrdenesMedicamentos() {
            this.$axios.post('/ordenamiento/medicamentosDipensarPrestador?page=' + this.pagina + '&cant=' + this
                .opcionActual).then(res => {
                    this.ordenes = res.data.data
                    this.total = res.data.last_page;
                })
        },

        exportar() {
            this.dialogoExportar = true
        },

        limpiar() {
            for (const key in this.formFilter) {
                this.formFilter[key] = ''
            }
        },
        imprimir(item) {
            if (this.formFilter.tipo === 1) {
                this.tipoOrden = 'medicamento'
            } else {
                this.tipoOrden = 'servicio'
            }

            let pdf = {
                tipo: this.tipoOrden,
                id: item.orden_id,
                detalles: {
                    id: item.id
                }
            };
            this.$axios.post("/pdf", pdf, {
                responseType: "arraybuffer"
            })
                .then(res => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                });
        },

        verNota(item) {
            if (item) {
                if (item.length > 0) {
                    this.datosNota = item[0]
                    this.dialogoNota = true;
                }
            }
        },

        modalDispensarOrden(item) {
            this.$axios.get("/ordenamiento/detalleMedicamentosPrestador/" + item.orden_id)
                .then((res) => {
                    this.modalDipensacionOrdenes = true;
                    this.medicamentos = res.data
                })
                .catch((error) => {
                    this.preload = false;
                    this.$toast.error("Error al cambiar el estado de la orden");
                });
        },

        modaldescripcionAuditoria(item) {
            this.modaldescricionAuditoria = true;
            this.descripcionAuditoria = item.auditoria
        },

        anularOrden() {
            this.$swal({
                title: "¿Esta seguro que desea anular la orden?",
                text: "Al aceptar este mensaje, se realizara el cambio del estado",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",

            }).then((result) => {
                if (result.value) {
                    this.modalAnularOrdenes = false;
                    this.preload = true;
                    let Data = {
                        'tipo': this.formFilter.tipo,
                        'id': this.ordenAnular.id,
                        'observacion': this.ordenAnular.observacionAnular,
                        'estado': 5
                    }
                    this.$axios.post("/auditoria/cambiar-auditoria-estado", Data)
                        .then((res) => {
                            this.$toast.success("Se cambió el estado de la orden correctamente");
                            this.preload = false;
                            this.buscarOrdenes();
                        })
                        .catch((error) => {
                            this.preload = false;
                            this.$toast.error("Error al cambiar el estado de la orden");
                        });
                }
            });

        },

        abrirModalDetalle(item) {
            this.dialogoDetalleOrden = true;
            this.afiliado = item.orden.consulta.afiliado;
            this.buscarAdjuntos(item.orden.consulta.afiliado.id)
        },

        buscarAdjuntos(item) {
            this.preload = true
            this.$axios.post("transcripciones/buscarAdjuntos", {
                afiliado_id: item
            }).then((res) => {
                this.listaAdjuntos = res.data;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false
                    this.$toast.error(e.response.data.error);
                });
        },

        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },

        listarPrestadores() {
            this.cargando = true;
            this.$axios.post('reps/listar?page=0', {
                prestador: this.prestador
            }).then(res => {
                this.cargando = false;
                this.listaPrestadores = res.data.map((rep) => {
                    return {
                        id: rep.id,
                        nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
                    }
                })
            }).catch(e => {
                this.cargando = false;
                console.log(e);
            })
        },

        openDialog(item) {
            this.ModalPrestadorprestador = true
            this.cambioRep.id = item.id
        },

        actualizarRep() {
            if (this.cambioRep.rep_id == undefined) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Es necesario que determine un nuevo prestador para actualizar el direccionamiento",
                    type: "error",
                });
            }
            this.preload = true;
            this.$axios.post('ordenamiento/actualizarRep', {
                id: this.cambioRep.id,
                rep_id: this.cambioRep.rep_id.id
            }).then(res => {
                this.preload = false;
                this.limpiarData()
                this.ModalPrestadorprestador = false
                this.dialogDetalle = false
                this.buscarOrdenes()
            }).catch(e => {
                this.preload = false;
                console.log(e);
            })
        },

        limpiarData() {
            for (const key in this.cambioRep) {
                this.cambioRep[key] = null;
            }

        },

        guardarDispensacion(item) {
            this.preload = true;
            this.$axios.post('/ordenamiento/dispensarProveedor', item).then(res => {
                this.preload = false;
            }).catch(e => {
                this.preload = false;
            })
        },

        SendEmail() {
            var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (!regex.test(this.emailEnvio)) {
                return this.$swal.fire({
                    title: "Debe ingresar un correo electrónico valido",
                    icon: "warning",
                    type: "error",
                });
            }

            let pdf = {
                tipo: 'servicio',
                enviar: true,
                correo: this.emailEnvio,
                detalles: {
                    id: this.datosEnvioEmail.id
                }
            }
            this.$axios.post('pdf', pdf).then(res => {
                this.emailEnvio = null;
                this.datosEnvioEmail = null;
                this.modalEmail = false;
                return this.$swal.fire({
                    title: "¡Orden enviada con exito!",
                    icon: "success",
                    type: "success",
                });
            }).catch(err => (err.response));
        }
    },

}

</script>
