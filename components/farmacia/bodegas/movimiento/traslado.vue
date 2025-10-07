<template>
    <div>
        <v-card>

            <v-row>
                <v-col cols="12" md="12">
                    <v-col cols="12" md="6" sm="6">
                        <v-autocomplete v-model="formTraslados.bodega_destino_id" label="Bodega destino*"
                            :items="listaBodegas" item-text="nombre" item-value="id" hint="(Bodega de entrada)"
                            persistent-hint @change="listarSolicitudes">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-btn small color="warning" @click="trasladosPendientes()">
                            Traslados pendientes</v-btn>
                    </v-col>
                </v-col>

            </v-row>
            <v-row v-if="formTraslados.bodega_destino_id">
                <v-col cols="12" md="12">
                    <v-btn color="success" small rounded v-if="articulos.length > 0" @click="enviarTraslado()">
                        Guardar ajuste
                    </v-btn>
                </v-col>
                <v-col cols="12" md="12">
                    <v-text-field label="Buscar" v-model="buscarTraslado" hint="Busca en todos los campos"
                        persistent-hint></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                    <v-data-table v-model="articulos" :headers="headers" :items="listaSolicitudes" show-select
                        item-key="id" class="elevation-1" :loading="loadingTabla"
                        loading-text="Cargando... Por favor espere" :search="buscarTraslado">
                        <template v-slot:[`item.producto`]="{ item }">
                            {{ item.medicamento.invima == null ? item.medicamento.codesumi.nombre + '- SIN EXPEDIENTE':item.medicamento.codesumi.nombre +' - '+item.medicamento.invima.cum_validacion
                            }}
                        </template>
                        <template v-slot:[`item.created_at`]="{ item }">
                            <td class="text-no-wrap">{{ item.created_at.substr(0, 10) }}</td>
                        </template>
                        <!-- <template v-slot:[`item.acciones`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on" @click="detalle(item)">
                    mdi-checkbox-multiple-marked-circle-outline
                  </v-icon>
                </template>
                <span>Recibir</span>
              </v-tooltip>

            </template> -->

                    </v-data-table>
                </v-col>
            </v-row>

            <v-dialog v-model="dialogoPendienttes" persistent max-width="1100px">
                <v-card>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text outlined color="info" class="text-center">Traslados pendientes
                        </v-alert>
                    </v-col>
                    <v-card-text>
                        <v-row dense>
                            <v-col>
                                <v-text-field label="Buscar" v-model="buscar" hint="Busca en todos los campos"
                                    persistent-hint></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-data-table :headers="headersPendientes" :items="listaTrasladosPendientes"
                                    item-key="id" :loading="loadingTabla" loading-text="Cargando... Por favor espere"
                                    :search="buscar">

                                    <template v-slot:[`item.created_at`]="{ item }">
                                        <td class="text-no-wrap">{{ item.created_at.substr(0, 10) }}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- <v-btn small color="success" @click="anular()">
              Anular</v-btn> -->
                        <v-btn small color="error" @click="dialogoPendienttes = false">
                            Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>
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
    name: "movimientoTraslado",
    props: ["tipo"],
    data: () => ({
        articulos: [],
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
            bodega_destino_id: null
        },
        headers: [{
            text: '#',
            align: 'center',
            value: 'solicitud_bodega_id'
        },
        {
            text: 'Bodega origen (bodega saliente)',
            align: 'center',
            value: 'solicitud_bodega.bodega_origen.nombre'
        },
        {
            text: 'Usuario solicita',
            align: 'center',
            value: 'solicitante',
        },
        {
            text: 'Fecha radicación',
            align: 'center',
            value: 'created_at'
        },
        {
            text: 'Producto',
            align: 'left',
            value: 'producto'
        },
        {
            text: 'Cantidad',
            align: 'center',
            value: 'cantidad_aprobada'
        },        ],
        headersPendientes: [{
            text: '#',
            align: 'center',
            value: 'solicitud_bodega_id'
        },
        {
            text: 'Fecha solicitud',
            align: 'center',
            value: 'created_at'
        },
        {
            text: 'Bodega origen (bodega saliente)',
            value: 'solicitud_bodega.bodega_origen.nombre'
        },
        {
            text: 'Bodega destino',
            value: 'solicitud_bodega.bodega_destino.nombre'
        },
        {
            text: 'Medicamento',
            value: 'medicamento.codesumi.nombre'
        },

        {
            text: 'Cantidad trasladada',
            value: 'cantidad_aprobada'
        },
        ],
        detallesSeleccionados: [],
        formLote: {
            lote: null,
            idlote: null
        },
        loteEntrega: null,
        cantidadAutorizada: null,
        dialogoPendienttes: false,
        listaTrasladosPendientes: [],
        buscar: '',
        buscarTraslado: ''
    }),

    mounted() {
        this.listarBodegas();
    },

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
            this.$axios.get('solicitud-bodegas/listarTraslado/' + this.tipo + '/4/' + this.formTraslados.bodega_destino_id)
                .then(res => {
                    this.listaSolicitudes = res.data
                    this.loadingTabla = false;
                }).catch(e => {
                    console.log(e);
                    this.loadingTabla = false;
                })
        },
        enviarTraslado() {
            this.$swal({
                title: 'Esta Seguro?',
                text: "Generar Traslado",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar'
            }).then((result) => {
                if (result.value) {
                    const data = {
                        detalle: this.articulos,
                    }
                    this.$axios.post('solicitud-bodegas/aprobarMovimientoTraslado', data).then(
                        res => {
                            // this.$toast.success(res.data)
                            // this.dialogoAprobar = false
                            this.listarSolicitudes()
                            this.articulos = []
                            // this.listaLotesAgregados = []
                            // this.total = 0
                            this.solicitud = {}
                        }).catch(e => {
                            console.log(e);
                            this.loadingTabla = false;
                        })
                }
            })
        },

        trasladosPendientes() {
            //
            this.$axios.get('solicitud-bodegas/listarTrasladoPendiente/' + this.tipo + '/4')
                .then(res => {
                    this.listaTrasladosPendientes = res.data
                    this.dialogoPendienttes = true
                    // this.loadingTabla = false;
                }).catch(e => {
                    console.log(e);
                    // this.loadingTabla = false;
                })
        }
    }
}

</script>
