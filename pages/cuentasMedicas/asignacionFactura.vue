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
                                <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline"
                                    class="text-center">
                                    <b>ASIGNACIÓN DE FACTURAS</b>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="3" md="3">
                              
                                <v-autocomplete v-model="formFiltro.prestador_id" label="Nit o Nombre del Prestador"
                                    :items="prestadores" item-value="id" item-text="nombre_prestador"
                                    :search-input.sync="prestadorBuscado" dense outlined :loading="loading.prestador" />

                            </v-col>

                            <v-col cols="12" sm="2" md="2">
                                <v-text-field label="Nit" v-model="formFiltro.nit" dense outlined></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="2" md="2">
                                <v-text-field label="Nombre paquete" v-model="formFiltro.nombre_paquete" dense
                                    outlined></v-text-field>
                            </v-col>

                            <v-card-actions class="mb-4">
                                <v-spacer></v-spacer>
                                <v-btn small @click="aplicarFiltro()" color="info">
                                    Aplicar filtro <v-icon small right>mdi-filter-variant-plus</v-icon>
                                </v-btn>
                                <v-btn small @click="limpiarFiltroGeneral()" color="error">
                                    Limpiar filtros <v-icon small right>mdi-close</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="listaAcumuladoFactura">
                <v-card>
                    <v-data-table dense :headers="headers" :items="listaAcumuladoFactura" hide-default-footer
                        disable-pagination loading-text="Cargando... por favor espere">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-tooltip right>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon large color="success" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="estadoAsig = true, cargarFacturas(item)">
                                        mdi-human-greeting
                                    </v-icon>
                                </template>
                                <span>Asignar</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.totalfacturas`]="{ item }">
                            <td>{{ item.totalfacturas }}</td>
                        </template>
                        <template v-slot:[`item.total_neto`]="{ item }">
                            <td>$ {{ Math.trunc(item.total_neto).toLocaleString('es-CO') }}</td>
                        </template>
                    </v-data-table>
                    <v-row no-gutters>
                        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="filtrarFacturas()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="filtrarFacturas()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-card>

            </v-col>

            <v-dialog v-model="modalAsignarFactura" persistent max-width="1000px">
                <v-card>
                    <v-toolbar flat color="titulo black--text" dark>
                        <v-toolbar-title>{{ estadoAsig == true ? "Asignacion de facturas" : "Reasignacion de facturas"
                            }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">

                                <v-autocomplete label="Seleccione el usuario" v-model="permission_id" :items="permisos"
                                    item-text="name" item-value="id" chips deletable-chips multiple
                                    :error-messages="errorsFactura.permission_id">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field dense v-model="numero_factura" label="Numero factura"></v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="numero_factura = '', cargarFacturas(prestador)">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="cargarFacturas(prestador)">
                                    filtrar
                                </v-btn>
                            </v-card-actions>

                            <v-col cols="12" sm="12" md="12">
                                <v-data-table dense v-model="selected" :headers="facturas" :items="listaFacturas"
                                    item-key="id" disable-pagination hide-default-footer show-select
                                    :single-select="singleSelect">
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.paquete_rip_id)">
                                                    mdi-file-document
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{ Math.trunc(item.valor_neto).toLocaleString('es-CO') }}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina2" class="my-4" :length="total2" :total-visible="9"
                                            @input="cargarFacturas(prestador)">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual2" :items="opciones2" dense solo
                                            small @change="cargarFacturas(prestador)">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="cerrarModalAsignacion()">
                            Cancelar
                        </v-btn>
                        <v-btn color="primary" @click="asignarFactura()">
                            {{ estadoAsig == true ? "Asignar facturas" : "Reasignar facturas" }}
                            Asignar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonAsignacionFactura',

    data() {
        return {
            preload: false,
            reps: null,
            rep: null,
            permisos: [],
            singleSelect: false,
            selected: [],
            permission_id: [],
            listaAcumuladoFactura: null,
            prestador: '',
            modalAsignarFactura: false,
            listaFacturas: null,
            filtro: {
                prestador_id: '',
                fecha_inicio: moment().format('YYYY-MM-DD'),
                fecha_final: moment().format('YYYY-MM-DD')
            },
            errors: {
                prestador_id: '',
                fecha_inicio: '',
                fecha_final: ''
            },
            errorsFactura: {
                permission_id: ''
            },
            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            pagina2: 1,
            total2: 0,
            opcionActual2: 5,
            opciones2: [5, 10, 20, 50, 100],
            headers: [{
                text: 'Nombre prestador',
                align: 'left',
                value: 'nombre_prestador'
            },
            {
                text: 'Nit',
                value: 'nit'
            },
            {
                text: 'Nombre paquete',
                value: 'nombre_paquete'
            },
            {
                text: 'Total facturas',
                value: 'total_facturas'
            },
            {
                text: 'Estado facturas',
                value: 'nombre_estado'
            }
                ,
            {
                text: 'Total valor neto',
                value: 'total_neto'
            },
            {
                text: 'Asignar factura',
                value: 'actions',
                align: 'center',
            }
            ],
            facturas: [
                {
                    text: '# Factura',
                    align: 'left',
                    value: 'numero_factura'
                },
                {
                    text: 'Valor neto',
                    align: 'left',
                    value: 'valor_neto'
                },
                {
                    text: 'Entidad',
                    align: 'left',
                    value: 'nombreEntidad'
                },
                {
                    text: 'Asignado a',
                    align: 'left',
                    value: 'asignadoA'
                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    align: 'center',
                }
            ],
            filtroPermiso: {
                nombre: null
            },
            numero_factura: '',
            estadoAsig: true,
            formFiltro: {
                prestador_id: null,
                nit: null,
                nombre_paquete: null
            },
            prestadorBuscado: '',
            prestadores: [],
            loading: {
                prestador: false
            }

        };
    },

    mounted() {
        // this.listarReps()
        this.filtrarFacturas();
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length == 6) {
                    this.listarReps();
                } else if (val.length < 6) {
                    this.reps = null;
                }
            } else {
                this.reps = null;

            }
        },

        prestadorBuscado(val) {
            if (val && val.length >= 4) {
                this.listarPrestadores(val)
            } else {
                this.prestadores = []
            }
        }

    },

    methods: {
        listarReps() {
            this.preload = true
            this.$axios.post('prestador/listar?page=0', {
                prestador: this.rep
            }).then(res => {
                this.reps = res.data.data.map((rep) => {
                    return {
                        id: rep.id,
                        nombre: `${rep.nombre_prestador} - ${rep.nit}`,
                    }
                })
                this.preload = false
            }).catch(e => {
                this.preload = false
                console.log(e);
            })
        },

        limpiarFiltro() {
            this.filtro.fecha_final = moment().format('YYYY-MM-DD'),
                this.filtro.fecha_inicio = moment().format('YYYY-MM-DD'),
                this.filtro.prestador_id = '',
                this.filtro.rep = null,
                this.listaAcumuladoFactura = null
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        aplicarFiltro() {

            if (!this.formFiltro.prestador_id && !this.formFiltro.nit && !this.formFiltro.nombre_paquete) {
                this.$toast.error('¡ Debe seleccionar al menos un filtro de busqueda !');
                return;
            }

            this.filtrarFacturas()

        },

        async filtrarFacturas() {
            this.preload = true
            try {
                this.limpiarError()
                const data = {
                    page: this.pagina,
                    cantidad: this.opcionActual,
                    filtro: this.filtro,
                    ...this.formFiltro
                }

                const res = await this.$axios.post('prestador/acumuladoPrestador', data)

                this.listaAcumuladoFactura = res.data.data
                this.total = res.data.last_page

                if (this.listaAcumuladoFactura.length <= 0) {
                    this.$toast.error('El prestador no tiene facturas en ese rango de fechas')
                    this.listaAcumuladoFactura = null
                    this.limpiarFiltro()
                }

            } catch (e) {
                this.ErrorEntrada(e.response?.data)
            } finally {
                this.preload = false
            }
        },

        cargarFacturas(prestador) {
            console.log(prestador);

            this.prestador = prestador
            this.preload = true
            this.filtro.paquete_id = prestador.paquete_id
            this.$axios.post('factura/listarFacturaPrestador?page=' + this.pagina2 + '&cantidad=' + this
                .opcionActual2, this.filtro).then(res => {
                    this.modalAsignarFactura = true
                    this.listarPermisos()
                    this.listaFacturas = res.data.data
                    this.total2 = res.data.last_page
                    this.preload = false
                }).catch(e => {
                    this.preload = false
                    console.log(e);
                })
        },

        listarPermisos() {
            this.$axios.post('/permisos/listar', this.filtroPermiso).then(res => {
                this.permisos = res.data.data.filter((cod) => {
                    if (cod.descripcion == 'cuentas medicas') {
                        return cod
                    }
                })
            }).catch(e => {
                console.log(e);
            })
        },

        cerrarModalAsignacion() {
            this.selected = [],
                this.permission_id = [],
                this.modalAsignarFactura = false
            //   this.reps = null
            // this.limpiarFiltro()
        },

        ErrorEntradaFactura(errors) {
            for (const key in this.errorsFactura) {
                if (key in errors) {
                    this.errorsFactura[key] = errors[key].join(',')
                }
            }
        },

        limpiarErrorFactura() {
            for (const key in this.errorsFactura) {
                this.errorsFactura[key] = ''
            }
        },

        asignarFactura() {

            this.limpiarErrorFactura()
            if (this.selected.length <= 0) {
                return this.$toast.error('Debe seleccionar como mínimo una factura')
            }
            const formData = new FormData();
            for (let i = 0; i < this.selected.length; i++) {
                formData.append(`af_id[]`, this.selected[i].id);
            }
            for (let i = 0; i < this.permission_id.length; i++) {
                formData.append(`permission_id[]`, this.permission_id[i]);
            }
            this.$axios.post('factura/asignarFactura', formData).then(res => {
                this.$toast.success('Factura asignada con exito.')
                this.cerrarModalAsignacion()
                this.filtrarFacturas()
            }).catch(e => {
                if (e.response.data.mensaje) {
                    this.$toast.error(e.response.data.mensaje)
                } else if (e.response.data) {
                    this.ErrorEntradaFactura(e.response.data)
                }

            })
        },

        async consultarNombreSoporte($paquete_rip_id) {
            const data = {
                adjuntoId: $paquete_rip_id
            };
            await this.$axios.post('rips/consultar-nombre-soporte', data).then(res => {
                this.nombreSoporte = res.data;
            }).catch(e => {
                console.log(e);
            })
        },

        async imprimirAdjuntoFactura($paquete_rip_id) {
            try {
                await this.consultarNombreSoporte($paquete_rip_id);

                const data = {
                    nombre_archivo: this.nombreSoporte,
                    nombre_carpeta: `rips/sumimedical/${$paquete_rip_id}`,
                    tiempo: 5
                };

                const response = await this.$axios.post('adjuntos/generar-url-descarga-s3', data);
                window.open(response.data, "_blank");

            } catch (error) {
                this.$toast.error('Ocurrió un error al descargar el formato');
            } finally {

            }
        },

        limpiarFiltroGeneral() {
            this.formFiltro = {
                nombre_prestador: null,
                nit: null,
                nombre_paquete: null
            }

            this.filtrarFacturas()
        },

        async listarPrestadores(query) {
            try {
                this.loading.prestador = true
                const res = await this.$axios.post('prestador/listarConfiltro?page=0', {
                    prestador: query
                })
                this.prestadores = res.data
            } catch (error) {
                this.$toast.error('Ha ocurrido un error al listar los prestadores')
            } finally {
                this.loading.prestador = false
            }
        }
    },
};

</script>
