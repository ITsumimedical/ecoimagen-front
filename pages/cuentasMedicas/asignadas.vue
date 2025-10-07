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
                                <v-text-field v-model="auditor" label="Nombre Auditor">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small
                                    @click="nombrePrestador='',auditor='',nit='',misAsignadas()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="misAsignadas()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table dense :headers="headers" :items="listaAsignados" disable-pagination
                                    hide-default-footer loading-text="Cargando... por favor espere">
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-btn small color="primary" @click="FacturaAsignar(item)">Glosar
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                            @input="misAsignadas()">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                            @change="misAsignadas()">
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
                                    <template v-slot:[`item.tiempo`]="props">
                                        <v-chip small :class="semaforoDias(props.item)">
                                            {{ `${props.item.diasHabiles} DÍA(S)` }}</v-chip>
                                    </template>
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.paquete_rip_id)">
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
                                            <span>Glosar</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
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
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosa = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosar</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="guardarAuditoria()">Guardar auditoria
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-card-title>
                                <h2>Factura # {{ af.numero_factura }}</h2>
                                <v-spacer></v-spacer>
                                <h3>Valor Restante $ {{ Math.trunc(valorGlosa).toLocaleString('es-CO')}}</h3>
                            </v-card-title>
                            <v-card-title>
                                <v-row dense>
                                    <v-col cols="12" sm="6" md="1">
                                        <v-autocomplete label="Codigo" v-model="formGlosa.codigo" :items="codigoGlosa"
                                            item-text="codigo" dense item-value="codigo"
                                            @input="cargarConcepto($event)">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="5">
                                        <v-textarea label="Concepto" v-model="formGlosa.concepto" readonly rows="1"
                                            dense></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-textarea label="Descripción" v-model="formGlosa.descripcion" rows="1" dense>
                                        </v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <v-text-field label="Valor" v-model="formGlosa.valor" type="number" dense
                                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                                            :error-messages="errors.valor" min="1"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="agregarGlosa(null,formGlosa)">
                                    Agregar
                                </v-btn>
                            </v-card-actions>

                            <v-alert dense text outlined color="info" class="text-center">Listado Glosas
                            </v-alert>

                            <v-data-table dense :headers="headersAc" :items="facturaGlosa"
                                loading-text="Cargando... por favor espere">
                                <template v-slot:[`item.codigo`]="{ item }">
                                    <v-autocomplete v-model="item.codigo" :items="codigoGlosa" item-text="codigo" dense
                                        item-value="codigo" @input="cargarConceptoListado($event,item)">
                                    </v-autocomplete>
                                </template>
                                <template v-slot:[`item.concepto`]="{ item }">
                                    <v-textarea v-model="item.concepto" readonly rows="1" dense></v-textarea>
                                </template>
                                <template v-slot:[`item.descripcion`]="{ item }">
                                    <v-textarea v-model="item.descripcion" rows="1" dense></v-textarea>
                                </template>
                                <template v-slot:[`item.valor`]="{ item }">
                                    <v-text-field v-model="item.valor" rows="1" dense
                                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.guardar`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="agregarGlosa(item.id,item)">
                                                mdi-check-circle-outline
                                            </v-icon>
                                        </template>
                                        <span>Guardar</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                            <!-- <div class="text-center">
                <v-pagination v-model="paginateGlosa.page" :length="paginateGlosa.total" :total-visible="7">
                </v-pagination>
              </div> -->
                        </v-col>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>

    </div>
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
        name: 'WorkspaceJsonAsignadas',

        props: {
            ejecutar: Boolean,
        },

        data() {
            return {
                buscarFactura: '',
                preload: false,
                listaAsignados: [],
                codigoGlosa: [],
                servicios: [],
                factura: [],
                af: [],
                facturaGlosa: [],
                dialogoFactura: false,
                dialogoGlosa: false,
                formGlosa: {
                    codigo: null,
                    concepto: null,
                    descripcion: null,
                    valor: null
                },
                buscar: '',
                buscarAc: '',
                buscarAp: '',
                buscarAt: '',
                buscarAm: '',
                prestador: '',
                headers: [{
                        text: 'Nombre prestador',
                        align: 'left',
                        value: 'nombre_prestador'
                    },
                    {
                        text: 'Auditor',
                        value: 'permisos'
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
                        text: 'Glosar',
                        value: 'actions',
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
                        text: 'Semáforo',
                        align: 'left',
                        value: 'tiempo',
                        sortable: false
                    },
                    {
                        text: 'Adjunto',
                        sortable: false,
                        value: 'adjunto',
                        align: 'center'
                    },
                    {
                        text: 'Glosar',
                        sortable: false,
                        value: 'glosar',
                        align: 'center'
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
                    },
                    {
                        text: 'Guardar',
                        align: 'left',
                        value: 'guardar'
                    },
                ],
                pagina: 1,
                total: 0,
                opcionActual: 5,
                opciones: [5, 10, 20, 50, 100],

                paginateGlosa: {
                    total: 0,
                    page: 1
                },
                errors: {
                    valor: ''
                },
                nombrePrestador: '',
                auditor: '',
                nit: ''
            };
        },

        computed: {
            valorGlosa() {
                var ValorSuma = 0;
                if (this.facturaGlosa.length > 0) {
                    this.facturaGlosa.forEach(s => {
                        if (s.valor) {
                            ValorSuma += parseInt(s.valor);
                        }
                    })
                }
                return parseInt(this.af.valor_neto) - ValorSuma;
            },
        },

        watch: {
            ejecutar() {
                if (this.ejecutar == true) {
                    this.misAsignadas()
                }


            }
        },

        methods: {

            listarCodigoGlosas() {
                this.$axios.get('codigo-glosa/listarCodigoGlosas').then(res => {
                    this.codigoGlosa = res.data.filter((cod) => {
                        if (cod.tipo_cuenta_medica_id != 8 && cod.tipo_cuenta_medica_id != 9) {
                            return cod
                        }
                    })
                    this.servicios = res.data.filter((cod) => {
                        if (cod.tipo_cuenta_medica_id == 9) {
                            return cod
                        }
                    })
                }).catch(e => {
                    console.log(e);
                })
            },

            misAsignadas() {
                this.preload = true
                this.$axios.post('prestador/misAsignadas?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
                    nombrePrestador: this.nombrePrestador,
                    auditor: this.auditor,
                    nit: this.nit
                }).then(res => {
                    this.preload = false
                    this.listaAsignados = res.data.data
                    this.total = res.data.last_page
                }).catch(e => {
                    this.preload = false
                    console.log(e);
                })
            },

            limpiarBuscador() {
                this.buscar = '',
                    this.buscarAc = '',
                    this.buscarAp = '',
                    this.buscarAt = '',
                    this.buscarAm = '',
                    this.formGlosa.codigo = null,
                    this.formGlosa.concepto = null,
                    this.formGlosa.descripcion = null,
                    this.formGlosa.valor = null
            },

            FacturaAsignar(datosPrestador) {
                this.preload = true
                this.limpiarBuscador()
                this.prestador = datosPrestador.nit
                this.listarCodigoGlosas()
                this.$axios.get('factura/asignacionFactura/' + datosPrestador.id)
                    .then(res => {
                        this.preload = false
                        this.factura = res.data
                        this.dialogoFactura = true
                    }).catch(e => {
                        console.log(e);
                        this.preload = false
                    })
            },

            guardarServicio(factura) {
                this.$axios.put('factura/guardarServicio/' + factura.id, factura).then(res => {
                    this.$toast.success('Servicio actualizado con exito.')
                }).catch(e => {
                    console.log(e);
                })
            },

            semaforoDias(factura) {
                if (factura.diasHabiles >= 21) {
                    return 'error white--text';
                } else if (factura.diasHabiles >= 11) {
                    return 'yellow white--text';
                } else {
                    return 'success white--text';
                }
            },

            glosar(afs) {
                this.limpiarBuscador();
                this.af = afs
                this.dialogoGlosa = true
                this.preload = true
                this.$axios.get('glosa/listaFacturaGlosa/' + afs.id).then(
                    res => {
                        this.preload = false
                        this.facturaGlosa = res.data
                        // this.paginateGlosa.total = res.data.last_page
                        // this.paginateGlosa.page = res.data.current_page
                    }).catch(e => {
                    this.preload = false

                })
            },

            cargarConcepto(item) {
                const concepto = this.codigoGlosa.filter(s => parseInt(s.codigo) === parseInt(item))
                this.formGlosa.concepto = concepto[0].descripcion
            },

            cargarConceptoListado(item, i) {
                const editedIndex = this.facturaGlosa.indexOf(i)
                const concepto = this.codigoGlosa.filter(s => parseInt(s.codigo) === parseInt(item))
                this.facturaGlosa[editedIndex].concepto = concepto[0].descripcion
            },

            agregarGlosa(idGlosa, data) {
                this.limpiarError()

                if (parseInt(data.valor) > parseInt(this.af.valor_neto)) {
                    this.$toast.error('El valor es mayor que el cobrado!');
                    return
                }
                if (idGlosa === null) {
                    if (parseInt(data.valor) > parseInt(this.valorGlosa)) {
                        this.$toast.error('El valor es mayor que el cobrado!');
                        return
                    }
                }

                const glosa = {
                    id: idGlosa,
                    codigo: data.codigo,
                    concepto: data.concepto,
                    descripcion: data.descripcion,
                    valor: data.valor,
                    af_id: this.af.id
                }
                this.preload = true
                this.$axios.post('glosa/glosa', glosa).then(res => {
                    this.preload = false
                    this.glosar(this.af)
                    this.$toast.success('Glosa guardada con exito.')
                }).catch(e => {
                    this.preload = false
                    if (e.response.data.mensaje) {
                        this.$toast.error(e.response.data.mensaje)
                    } else {
                        this.ErrorEntrada(e.response.data)
                    }


                })
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

            guardarAuditoria() {
                this.$axios.put('factura/guardarAuditoria/' + this.af.id).then(res => {
                    this.misAsignadas()
                    this.dialogoFactura = false
                    this.dialogoGlosa = false
                    this.$toast.success('Auditoria guardada con exito.')
                    this.$emit("updateCount");
                }).catch(e => {

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

        },
    };

</script>

<style lang="scss" scoped>

</style>
