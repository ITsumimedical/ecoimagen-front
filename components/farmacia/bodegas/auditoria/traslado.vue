<template>
    <div>
        <v-card>

            <v-row>
                <v-col cols="12" md="12">
                    <v-col cols="12" md="6">
                        <v-autocomplete v-model="formTraslados.bodega_origen_id" label="Bodega Origen*"
                            :items="listaBodegas" item-text="nombre" item-value="id" hint="(Bodega de salida)"
                            persistent-hint @change="listarSolicitudes">
                        </v-autocomplete>
                    </v-col>
                </v-col>

            </v-row>
            <v-row v-if="formTraslados.bodega_origen_id">
                <v-col cols="12" md="12">
                    <v-data-table :headers="headers" :items="listaSolicitudes" :single-expand="true" item-key="id"
                        class="elevation-1" :loading="loadingTabla" loading-text="Cargando... Por favor espere">
                        <template v-slot:[`item.usuarioSolicitaNombre`]="{ item }">
                            {{
                                `${item.usuario_solicita?.operador?.nombre || ''}
                            ${item.usuario_solicita?.operador?.apellido || ''}`.trim() || 'Sin nombre'
                            }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="detalle(item)">
                                        mdi-checkbox-multiple-marked-circle-outline
                                    </v-icon>
                                </template>
                                <span>Aprobar</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="error" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="negarTraslado(item)">
                                        mdi-close-circle
                                    </v-icon>
                                </template>
                                <span>Negar</span>
                            </v-tooltip>
                        </template>

                    </v-data-table>
                </v-col>
            </v-row>
            <v-dialog v-model="dialogoAprobar" persistent max-width="1000px" v-if="dialogoAprobar">

                <v-card v-if="solicitud">
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text outlined color="info" class="text-center">Proceso de aprobación de traslados
                        </v-alert>
                    </v-col>

                    <v-card-text>

                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersDetalle"
                                    :items="solicitud.detalles_solicitud.filter(s => parseInt(s.estado_id) === 3)"
                                    class="elevation-1" item-key="id" show-select v-model="detallesSeleccionados">

                                    <template v-slot:[`item.lote`]="{ item, index }">

                                        <v-btn color="primary" @click="dialogLote = true; detalleNovedadIndice = index;
                                        detalleLotes = item.lotes; consultarLotes(item)">Lotes ({{
                                            Math.trunc(item.cantidad_inicial) }}/{{
                                                item.lotes.reduce((accumulator, object) => {
                                                    return accumulator + parseFloat(object.cantidadLote);
                                                }, 0)
                                            }})</v-btn>
                                    </template>


                                </v-data-table>
                            </v-col>

                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn small color="error" @click="dialogoAprobar = false">
                            Cerrar</v-btn>
                        <v-btn v-if="detallesSeleccionados.length == solicitud.detalles_solicitud.length" small
                            color="success" @click="enviarTraslado()">
                            Aprobar traslado</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogoNegar" persistent max-width="1000px">
                <v-card>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text outlined color="info" class="text-center">Cancelar Solicitud de Traslado
                        </v-alert>
                    </v-col>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea label="Descripción" v-model="descripcion" dense auto-grow>
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="success" @click="anular()">
                            Anular</v-btn>
                        <v-btn small color="error" @click="dialogoNegar = false">
                            Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogLote" persistent max-width="700px">
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
                                        Math.trunc(solicitud.detalles_solicitud[detalleNovedadIndice].cantidad_inicial)
                                        }}</strong>
                                </h3><br>
                                <h3>CANTIDAD PARAMETRIZADA <strong>{{
                                    solicitud.detalles_solicitud[detalleNovedadIndice].lotes.reduce((accumulator,
                                        object) => {
                                        return accumulator + parseFloat(object.cantidadLote);
                                    }, 0)
                                }}</strong></h3><br>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <!-- <v-text-field label="Lote" v-model="lotes.codigo"></v-text-field> -->
                                <v-autocomplete @change="fechaVencimiento(loteEntrega)" v-model="loteEntrega"
                                    label="Lote*" :items="lotes"
                                    :item-text="lotes => lotes.codigo + ' Cantidad: ' + lotes.cantidadLote"
                                    return-object required>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field label="Fecha vencimiento" v-model="formLote.fecha_vencimiento"
                                    type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field type="number" label="Cantidad"
                                    v-model="formLote.cantidadLote"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-btn color="success" small class="mt-5" @click="agregarLote()">Agregar</v-btn>
                            </v-col>
                        </v-row>
                        <v-data-table :headers="headerLotes" :items="detalleLotes" disable-pagination
                            hide-default-footer>
                            <template v-slot:[`item.numero`]="{ index }">
                                {{ index + 1 }}
                            </template>
                            <template v-slot:[`item.eliminar`]="{ index }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon color="error" small
                                            @click="solicitud.detalles_solicitud[detalleNovedadIndice].lotes.splice(index, 1)">
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
                        <v-btn color="error" dark small @click="dialogLote = false, limpiarLote()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


        </v-card>
    </div>
</template>
<script>
import moment from 'moment';
import {
    listarBodegas
} from "~/api/bodegas/bodegas";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('farmacia.movimientos')) {
            return redirect('/');
        }
    },
    name: 'auditoriaTraslado',
    props: ["tipo"],
    mounted() {
        this.listarBodegas();
    },
    data: () => ({
        descripcion: '',
        prueba: 0,
        dialogoAprobar: false,
        dialogoNegar: false,
        dialogLote: false,
        loadingTabla: false,
        listaBodegas: [],
        listaSolicitudes: [],
        lotes: [],
        listaLotesAgregados: [],
        detalleLotes: [],
        lote: null,
        cantidadLote: 0,
        total: 0,
        cantidadAprobadaLote: null,
        detalleNovedadIndice: null,
        solicitud: null,
        solicitudNegar: {},
        formTraslados: {
            bodega_origen_id: null,
            bodega_destino_id: null
        },
        headers: [{
            text: '#',
            align: 'center',
            value: 'id'
        },
        {
            text: 'Bodega Destino (bodega solicitante)',
            align: 'center',
            value: 'bodega_destino.nombre'
        },
        {
            text: 'Usuario solicita',
            align: 'center',
            value: 'usuarioSolicitaNombre'
        },
        {
            text: 'Fecha radicación',
            align: 'center',
            value: 'created_at'
        },
        {
            text: 'Acciones',
            value: 'acciones'
        },
        ],
        headersDetalle: [{
            text: 'Medicamento',
            align: 'center',
            value: 'medicamento.codesumi.nombre'
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
            text: 'Cantidad solicitada',
            align: 'center',
            value: 'cantidad_inicial'
        },
        {
            text: 'Lote',
            align: 'center',
            value: 'lote'
        },
        ],
        headerLotes: [{
            text: '#',
            align: 'center',
            value: 'numero'
        },
        {
            text: 'Lote',
            align: 'center',
            value: 'lote'
        },
        {
            text: 'Fecha',
            align: 'center',
            value: 'fecha_vencimiento'
        },
        {
            text: 'Cantidad',
            align: 'center',
            value: 'cantidadLote'
        },
        {
            text: '',
            align: 'center',
            value: 'eliminar'
        },

        ],
        detallesSeleccionados: [],
        formLote: {
            lote: null,
            idlote: null
        },
        loteEntrega: null
    }),

    methods: {
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
            this.loadingTabla = true;
            this.$axios.get('solicitud-bodegas/listar/' + this.tipo + '/3/' + this.formTraslados.bodega_origen_id)
                .then(res => {
                    this.listaSolicitudes = res.data
                    this.loadingTabla = false;
                }).catch(e => {
                    console.log(e);
                    this.loadingTabla = false;
                })
        },

        detalle(item) {
            this.dialogoAprobar = true
            this.solicitud = item

        },
        agregarCantidad(lote, cantidadAprobadaLote) {
            if (parseInt(cantidadAprobadaLote) <= 0 || parseInt(cantidadAprobadaLote) > parseInt(this.cantidadLote)) {
                return this.$swal(
                    'Valor incorrecto!',
                    'El Campo "cantidadLote" debe tener un valor mayor a 0 y menor a la cantidad disponible del lote',
                    'error'
                )
            }
            const data = {
                lote: lote,
                cantidadAprobada: cantidadAprobadaLote
            }
            this.listaLotesAgregados.push(data)
            this.cantidadAprobadaLote = null;
            this.cantidadLote = 0;
            this.lote = null;
            this.calcularTotal();
        },

        calcularTotal() {
            let suma = 0;
            this.detalleLotes.forEach((elemnto => {
                suma += parseInt(elemnto.cantidadLote)
            }));
            this.total = suma
        },

        eliminarArticulo(id) {
            this.listaLotesAgregados.splice(id, 1);
            this.calcularTotal();

        },

        enviarTraslado() {
            this.$swal({
                title: 'Esta Seguro?',
                text: "Generar auditoria de Traslado",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar'
            }).then((result) => {
                if (result.value) {
                    const data = {
                        detalle: this.detallesSeleccionados,
                        total: this.total,
                        solicitud: this.solicitud
                    }
                    this.$axios.post('solicitud-bodegas/aprobar-solicitud-traslado', data).then(
                        res => {
                            // this.$toast.success(res.data)
                            this.dialogoAprobar = false
                            this.listarSolicitudes()
                            this.listaLotesAgregados = []
                            this.total = 0
                            this.solicitud = {}
                        }).catch(e => {
                            console.log(e);
                            this.loadingTabla = false;
                        })
                }
            })
        },

        negarTraslado(solicitud) {
            this.dialogoNegar = true
            this.solicitudNegar = solicitud
        },
        anular() {
            this.$swal({
                title: 'Esta Seguro?',
                text: "Anular la solicitud de traslado",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar'
            }).then((result) => {
                if (result.value) {
                    const data = {
                        id: this.solicitudNegar.id,
                        descripcion: this.descripcion,
                    }
                    this.$axios.post('solicitud-bodegas/rechazar-solicitud-traslado', data).then(res => {
                        this.$toast.success(res.data.message)
                        this.dialogoNegar = false
                        this.listarSolicitudes()
                    }).catch(e => {
                        console.log(e);
                    })
                }
            })
        },

        consultarLotes(item) {
            this.$axios.post('bodega-medicamentos/consultar', {
                medicamento_id: item.medicamento_id,
                bodega_id: this.formTraslados.bodega_origen_id
            }).then(res => {
                this.lotes = res.data
            }).catch(e => {
                console.log(e);
            })
        },

        agregarLote() {
            if (this.formLote.cantidadLote > parseInt(this.loteEntrega.cantidadLote)) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'No es posible ingresar una cantidad mayor a la que tiene el lote!',
                });
            }
            this.formLote.lote = this.loteEntrega.codigo
            this.formLote.idlote = this.loteEntrega.id
            this.solicitud.detalles_solicitud[this.detalleNovedadIndice].lotes.push({
                ...this.formLote
            });
            this.calcularTotal()
            // this.limpiarFormularioNovedad();
            // this.dialogLote = false;
            this.limpiarLote()
        },

        limpiarLote() {
            for (const prop of Object.getOwnPropertyNames(this.formLote)) {
                this.formLote[prop] = null;
            }
            this.loteEntrega = null
        },
        fechaVencimiento(lote) {
            this.formLote.fecha_vencimiento = lote.fecha_vencimiento
        }
    }
}

</script>
<style>
.btn-close {
    color: red;
}
</style>
