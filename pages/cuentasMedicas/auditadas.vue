<template>
    <div>
        <v-row dense>
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
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nombrePrestador" label="Nombre prestador">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="nombrePrestador='',nit='',auditadas()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="auditadas()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table dense :headers="headers" :items="listaAuditados"
                                    loading-text="Cargando... por favor espere" :search="buscar" disable-pagination
                                    hide-default-footer>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn small color="primary" class="mr-2" @click="FacturaAuditada(item)">Ver
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.notificar`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon large dense color="success" class="mr-2" v-bind="attrs"
                                                    v-on="on" @click="notificar(item)">
                                                    mdi-checkbox-marked-circle-outline
                                                </v-icon>
                                            </template>
                                            <span>Glosar</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                            @input="auditadas()">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                            @change="auditadas()">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>

                        </v-row>
                    </v-card-text>

                </v-card>

            </v-col>


            <v-dialog v-model="dialogoFactura" persistent max-width="1000px">
                <v-card>
                    <v-toolbar flat color="titulo black--text" dark>
                        <v-toolbar-title>Glosar Facturas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="buscarFactura" label="Buscar" append-icon="mdi-magnify">

                                </v-text-field>
                                <v-data-table dense :headers="headersFactura" :items="factura"
                                    loading-text="Cargando... por favor espere" :search="buscarFactura">
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="descargarSoporte(item.paquete_rip.id, item.numero_factura)">
                                                    mdi-file-document
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosar`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="glosar(item)">
                                                    mdi-cash
                                                </v-icon>
                                            </template>
                                            <span>Ver glosa</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!-- <div class="text-center">
              <v-pagination v-model="paginateFactura.page" :length="paginateFactura.total" :total-visible="7">
              </v-pagination>
            </div> -->
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogoFactura = false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoGlosa" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card tile>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosa = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosar</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="warning" @click="devolverAuditoria()">Devolver auditoria
                        </v-btn>
                    </v-toolbar>

                    <v-card-text class="layout justify-center" v-if="facturasAuditadas.length == 0">
                        <h3>Actualmente esta factura {{ af.numero_factura }} no cuenta con
                            glosas, si desea devolver a
                            asignados de click en el
                            boton &nbsp;<p style="color:orange"> "Devolver Auditoria"</p>
                        </h3>

                    </v-card-text>

                    <v-card-text v-else>
                        <v-col cols="12" sm="12" md="12">
                            <v-card-title>
                                Factura # {{ af.numero_factura }}
                            </v-card-title>
                            <v-data-table dense :headers="headersAc" :items="facturasAuditadas"
                                loading-text="Cargando... por favor espere">
                                <template v-slot:[`item.valor`]="{ item }">
                                    <td>$ {{Math.trunc(item.valor).toLocaleString('es-CO')}}</td>
                                </template>
                            </v-data-table>

                            <!-- <v-pagination v-model="paginateGlosa.page" :length="paginateGlosa.total" :total-visible="7">
                </v-pagination> -->

                        </v-col>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import moment from 'moment'
    import {mapActions} from "vuex";
    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can('blog.vista')) {
                return redirect('/');
            }
        },
        name: 'WorkspaceJsonAuditadas',

        props: {
            ejecutar: Boolean,
        },

        data() {
            return {
                buscarFactura: '',
                buscar: '',
                preload: false,
                listaAuditados: [],
                factura: [],
                af: [],
                facturasAuditadas: [],
                prestador: '',
                dialogoFactura: false,
                dialogoGlosa: false,
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
                        text: 'Total facturas',
                        value: 'totalfacturas'
                    },
                    {
                        text: 'Total valor neto',
                        value: 'totalneto'
                    },
                    {
                        text: 'Glosa',
                        align: 'center',
                        value: 'glosa'
                    },
                    {
                        text: 'Notificar',
                        value: 'notificar',
                        align: 'center'
                    }
                ],
                headersFactura: [{
                        text: '# Factura',
                        align: 'left',
                        value: 'numero_factura'
                    },
                    {
                        text: 'Valor neto',
                        align: 'left',
                        value: 'valor_neto'
                    },
                    // {
                    //   text: 'Servicio',
                    //   align: 'left',
                    //   value: 'servicio',
                    //   sortable: false
                    // },
                    {
                        text: 'Adjunto',
                        sortable: false,
                        value: 'adjunto'
                    },
                    {
                        text: 'Glosar',
                        sortable: false,
                        value: 'glosar'
                    }
                ],
                headersAc: [{
                        text: 'Codigo',
                        align: 'left',
                        value: 'codigo'
                    },
                    {
                        text: 'Concepto',
                        align: 'left',
                        value: 'concepto'
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'descripcion'
                    },
                    {
                        text: 'Valor',
                        align: 'left',
                        value: 'valor'
                    }
                ],
                pagina: 1,
                total: 0,
                opcionActual: 5,
                opciones: [5, 10, 20, 50, 100],
                paginateFactura: {
                    total: 0,
                    page: 1
                },
                paginateGlosa: {
                    total: 0,
                    page: 1
                },
                nombrePrestador: '',
                nit: ''

            };
        },

        // mounted() {
        //   this.auditadas()
        // },
        watch: {
            ejecutar() {
                if (this.ejecutar == true) {
                    this.auditadas()
                }


            }
        },



        methods: {
            ...mapActions("app", ["setPreload"]),
            auditadas() {
                this.preload = true
                this.$axios.post('prestador/auditados?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
                    nombrePrestador: this.nombrePrestador,
                    nit: this.nit
                }).then(res => {
                    this.preload = false
                    this.listaAuditados = res.data.data
                    this.total = res.data.last_page
                    this.$emit("updateCount");
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            FacturaAuditada(prestador) {
                this.prestador = prestador.nit
                this.preload = true
                this.$axios.get('factura/facturas/' + prestador.id)
                    .then(res => {
                        this.preload = false
                        this.factura = res.data
                        this.dialogoFactura = true

                    }).catch(e => {
                        console.log(e);
                        this.preload = false
                    })
            },

            glosar(afs) {
                this.af = afs
                this.preload = true
                this.dialogoGlosa = true
                this.$axios.get('glosa/listaFacturaGlosa/' + afs.id).then(
                    res => {
                        this.preload = false
                        this.facturasAuditadas = res.data

                    }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            devolverAuditoria() {
                this.$axios.put('factura/devolverAuditoria/' + this.af.id).then(res => {
                    this.auditadas()
                    this.dialogoFactura = false
                    this.dialogoGlosa = false
                    this.$toast.success('Auditoria devueleta con exito.')
                }).catch(e => {
                    console.log(e);
                })
            },

            notificar(af) {
                this.$swal.fire({
                    title: "¿Está Seguro(a) de notificar?",
                    text: "Una vez notificada la glosa, ya no podrá regresar!",
                    input: 'email',
                    inputValue: af.email,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: 'red'
                }).then(res => {
                    if (res.value) {
                        const data = {
                            correo: res.value,
                            prestador: af.id
                        }
                        this.$axios.post('email-cuentas-medicas/notificar', data).then(res => {
                            this.auditadas();
                            this.$toast.success(res.data.mensaje)
                        }).catch(e => {
                            this.$toast.error(e.response.data.mensaje)
                        })
                    }


                });

            },

            async imprimirAdjuntoFactura(numeroFactura) {
                let ruta = '/facturascuentasmedicas/' + this.prestador + '/' + numeroFactura + '.pdf';
                try {
                    let adj = await this.$adjuntos(ruta);
                    let blob = new Blob([adj[1]], {
                        type: adj[0],
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                } catch (error) {
                    this.$toast.error('El adjunto de la factura no existe!')
                    console.log(error.response);
                }
            },
            descargarSoporte(paquete_rip_id, numeroFactura) {
                // return console.log('chacon', numeroFactura);

                this.setPreload(true);
                this.$axios.post('rips/consultar-nombre-soporte', {
                    adjuntoId: paquete_rip_id,
                    numeroFactura: numeroFactura ?? null
                    }).then(res => {

                    for(const element of res.data){

                        this.setPreload(true);
                        const data = {
                            nombre_archivo: element,
                            nombre_carpeta: `rips/sumimedical/${this.id}`,
                            tiempo: 5
                        };
                        this.$axios.post('adjuntos/generar-url-descarga-s3', data).then(res2 => {
                            window.open(res2.data, "_blank");
                        }).catch(e2 => {
                            console.log(e2);
                        }).finally(() => this.setPreload(false))
                    }
                }).catch(e => {
                    console.log(e);
                }).finally(() => this.setPreload(false))
            }
        },
    };

</script>

<style lang="scss" scoped>

</style>
