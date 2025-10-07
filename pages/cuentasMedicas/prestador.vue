<template>
    <div>
        <v-row dense>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-col cols="12" sm="12" md="12">
                <v-card flat>
                    <v-bottom-navigation :value="true" color="primary">
                        <v-btn
                            @click="pendientes= true, conciliacion=false, cerradas = false,nit='' ,numero_factura='' ,facturasPrestador()">
                            <h3>PENDIENTES</h3>
                        </v-btn>

                        <v-btn
                            @click="pendientes= false, conciliacion=true, cerradas = false,nit='' ,numero_factura='' , glosasConciliacion()">
                            <h3>CONCILIACIÓN</h3>
                        </v-btn>

                        <v-btn
                            @click="pendientes= false, conciliacion=false, cerradas = true,nit='' ,numero_factura='' , glosasCerradas()">
                            <h3>CERRADAS</h3>
                        </v-btn>
                    </v-bottom-navigation>

                    <v-col cols="12" sm="12" md="12" v-show="pendientes">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numero_factura" label="Número factura">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="numero_factura='',nit='',facturasPrestador()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="facturasPrestador()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headers" :items="listaGlosa"
                                    no-data-text="Sin datos para mostrar" disable-pagination hide-default-footer>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2" @click="glosasPrestador(item)">
                                            Respuesta glosa
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                            @input="facturasPrestador()">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                            @change="facturasPrestador()">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-show="conciliacion">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numero_factura" label="Número factura">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="numero_factura='',nit='',glosasConciliacion()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="glosasConciliacion()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersConciliacion" :items="listaGlosaConciliacion"
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2" @click="verGlosasConciliacion(item)">
                                            Ver glosa
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-show="cerradas">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numero_factura" label="Número factura">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="numero_factura='',nit='',glosasCerradas()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="glosasCerradas()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersConciliacion" :items="listaGlosaCerradas"
                                    :search="buscarCerradas" no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2" @click="verGlosasCerradas(item)">Ver
                                            glosa
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-col>

                </v-card>
            </v-col>
            <v-dialog v-model="dialogoGlosa" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosa = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Respuesta</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="guardarAuditoria(glosaPrestador)">Guardar respuesta
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarFactura" label="Buscar" append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table dense :headers="headersfactura" :items="glosaPrestador"
                                    loading-text="Cargando... por favor espere" :search="buscarFactura">

                                    <template v-slot:[`item.codigo`]="{ item }">
                                        <v-autocomplete v-model="item.codigo" :items="codigosGlosa" item-text="codigo"
                                            dense item-value="codigo">
                                        </v-autocomplete>
                                    </template>
                                    <template v-slot:[`item.respuesta_prestador`]="{ item }">
                                        <v-textarea v-model="item.respuesta_prestador" rows="1" dense></v-textarea>
                                    </template>
                                    <template v-slot:[`item.valor_aceptado`]="{ item }">
                                        <v-text-field v-model="item.valor_aceptado" rows="1" dense
                                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:[`item.valor_no_aceptado`]="{ item }">
                                        <v-text-field v-model="item.valor_no_aceptado" rows="1" dense
                                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <input v-show="false" @change="onFilePicked" type="file" ref="adjunto"
                                                    id="adjunto" accept=".pdf">
                                                <v-icon color="info" v-if="item.archivo !=null" class="mr-2"
                                                    v-bind="attrs" v-on="on" @click="agregarAdjunto(item)">
                                                    mdi-file-document
                                                </v-icon>
                                                <v-icon color="warning" v-else class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="agregarAdjunto(item)">
                                                    mdi-file-document
                                                </v-icon>
                                            </template>
                                            <span>Adjuntar</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.guardar`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="success" v-if="item.estado !=null" class="mr-2"
                                                    v-bind="attrs" v-on="on" @click="agregarRadicacionGlosa(item)">
                                                    mdi-check-circle-outline
                                                </v-icon>
                                                <v-icon color="info" v-else class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="agregarRadicacionGlosa(item)">
                                                    mdi-check-circle-outline
                                                </v-icon>
                                            </template>
                                            <span>Guardar</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoConciliacion" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoConciliacion = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Respuesta</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarfacturaConciliacion" label="Buscar"
                                        append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table dense :headers="headersfacturaConciliacion" :items="glosaConcialiacion"
                                    loading-text="Cargando... por favor espere" :search="buscarfacturaConciliacion">
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top v-if="item.archivo !=null">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="AdjuntoFactura(item.archivo)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver adjunto</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoCerradas" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoCerradas = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Respuesta</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarGlosaCerrada" label="Buscar" append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table :headers="headersfacturaConciliacion" :items="glosaCerrada"
                                    loading-text="Cargando... por favor espere" :search="buscarGlosaCerrada">
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top v-if="item.archivo !=null">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="AdjuntoFactura(item.archivo)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver adjunto</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
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
        name: 'WorkspaceJsonPrestador',

        props: {
            ejecutar: Boolean,
        },

        data() {
            return {
                buscar: '',
                buscarFactura: '',
                buscarConcialiacion: '',
                buscarfacturaConciliacion: '',
                buscarCerradas: '',
                buscarGlosaCerrada: '',
                preload: false,
                pendientes: true,
                conciliacion: false,
                cerradas: false,
                dialogoGlosa: false,
                dialogoConciliacion: false,
                dialogoCerradas: false,
                listaGlosa: [],
                listaGlosaConciliacion: [],
                listaGlosaCerradas: [],
                codigosGlosa: [],
                glosaPrestador: [],
                glosaConcialiacion: [],
                glosaCerrada: [],
                af: [],
                id_glosa: '',
                headers: [{
                        text: 'Nit',
                        value: 'nit',
                    },
                    {
                        text: 'Fecha radicación factura',
                        value: 'created_at'
                    },
                    {
                        text: '# Factura',
                        value: 'numero_factura',
                    },
                    {
                        text: 'Valor factura',
                        value: 'valor_neto'
                    },
                    {
                        text: 'Responder glosa',
                        value: 'glosa',
                        align: 'center'
                    }
                ],
                headersfactura: [{
                        text: 'Codigo glosa',
                        align: 'left',
                        sortable: false,
                        value: 'id'
                    },
                    {
                        text: 'Descripción glosa',
                        align: 'left',
                        value: 'descripcion',
                        sortable: false
                    },
                    {
                        text: 'Valor glosa',
                        align: 'left',
                        value: 'valor',
                        sortable: false
                    },
                    {
                        text: 'Codigo',
                        align: 'left',
                        value: 'codigo',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_prestador',
                        sortable: false
                    },
                    {
                        text: 'Valor aceptado',
                        align: 'left',
                        value: 'valor_aceptado',
                        sortable: false
                    },
                    {
                        text: 'Valor no aceptado',
                        value: 'valor_no_aceptado',
                        align: 'left',
                        sortable: false
                    },
                    {
                        text: 'Archivo',
                        value: 'archivo',
                        sortable: false
                    },
                    {
                        text: 'Guardar',
                        value: 'guardar',
                        sortable: false
                    },
                ],
                headersConciliacion: [{
                        text: 'Nit',
                        value: 'nit',
                    },
                    {
                        text: 'Fecha radicación factura',
                        value: 'created_at'
                    },
                    {
                        text: '# Factura',
                        value: 'numero_factura',
                    },
                    {
                        text: 'Valor factura',
                        value: 'valor_neto'
                    },
                    {
                        text: 'Ver glosa',
                        value: 'glosa',
                        align: 'center'
                    }
                ],
                headersfacturaConciliacion: [{
                        text: 'Codigo glosa',
                        align: 'left',
                        value: 'codigo',
                        sortable: false
                    },
                    {
                        text: 'Descripción glosa',
                        align: 'left',
                        value: 'respuesta_prestador',
                        sortable: false
                    },
                    {
                        text: 'Valor aceptado',
                        align: 'left',
                        value: 'valorAceptadoPrestador',
                        sortable: false
                    },
                    {
                        text: 'Valor no aceptado',
                        align: 'left',
                        value: 'valorNoAceptadoPrestador',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_sumimedical',
                        sortable: false
                    },
                    {
                        text: 'Leventa sumimedical',
                        align: 'left',
                        value: 'valorAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: 'Persiste sumimedical',
                        align: 'left',
                        value: 'valorNoAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: '',
                        value: 'archivo',
                        sortable: false
                    },
                ],
                pagina: 1,
                total: 0,
                opcionActual: 5,
                opciones: [5, 10, 20, 50, 100],
                pagina2: 1,
                total2: 0,
                opcionActual2: 5,
                opciones2: [5, 10, 20, 50, 100],
                pagina3: 1,
                total3: 0,
                opcionActual3: 5,
                opciones3: [5, 10, 20, 50, 100],

                paginateFacturaCerrada: {
                    total: 0,
                    page: 1
                },
                numero_factura: '',
                nit: ''
            };
        },

        // mounted() {
        //   this.facturasPrestador();
        // },

        watch: {
            ejecutar() {
                if (this.ejecutar == true) {
                    this.facturasPrestador()
                }
            }
        },

        methods: {
            facturasPrestador() {
                this.preload = true
                this.$axios.post('factura/facturasPrestador?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
                    numero_factura: this.numero_factura,
                    nit: this.nit
                }).then(
                    res => {
                        this.listaGlosa = res.data.data
                        this.total = res.data.last_page
                        this.preload = false
                        this.$emit("updateCount");
                    }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            listarCodigoGlosa() {
                this.$axios.get('codigo-glosa/listarCodigoGlosas?page=0').then(res => {
                    this.codigosGlosa = res.data.filter((cod) => {
                        if (cod.tipo_cuenta_medica_id == 8) {
                            return cod
                        }
                    })
                }).catch(e => {
                    console.log(e);
                })
            },

            glosasPrestador(afs) {
                this.preload = true
                this.listarCodigoGlosa()
                this.af = afs
                this.$axios.get('glosa/facturasGlosarPrestador/' + afs.id).then(res => {
                    this.preload = false
                    this.glosaPrestador = res.data
                    this.dialogoGlosa = true
                }).catch(e => {
                    this.preload = false
                    console.log(e);
                })
            },

            agregarRadicacionGlosa(data) {
                // console.log('sdsd',data);
                if (!data.codigo || !data.respuesta_prestador || !data.valor_aceptado || !data.valor_no_aceptado) {
                    this.$toast.error('Debe diligenciar los datos obligatorios!');
                    return
                }
                let totalglosa = parseInt(data.valor_aceptado) + parseInt(data.valor_no_aceptado);
                if (parseInt(totalglosa) != parseInt(data.valor)) {
                    this.$toast.error(
                        'La suma del valor aceptado y no aceptado no puede ser diferente a el valor de glosa!');
                    return
                }
                const info = {
                    codigo: data.codigo,
                    respuesta_prestador: data.respuesta_prestador,
                    valor_aceptado: data.valor_aceptado,
                    valor_no_aceptado: data.valor_no_aceptado,
                    id: data.id
                }
                this.$axios.post('radicacion-glosa/crearActualizarRadicacionGlosa', info).then(res => {
                    this.$toast.success('Respuesta a glosa guardada con exito!')
                    this.glosasPrestador(this.af)
                }).catch(e => {
                    this.$toast.error(e.response.data.mensaje);
                })
            },

            agregarAdjunto(item) {
                this.$refs.adjunto.value = ''
                this.id_glosa = item.id
                this.$refs.adjunto.click()
            },

            onFilePicked(e) {
                const file = e.target.files
                var ext = file[0].name.split('.').pop();
                ext = ext.toLowerCase();
                if (file[0].size > 7000000) {
                    this.$toast.error('El adjunto no debe superar los 7MB, comprima el PDF y intente de nuevo');
                    this.$refs.adjunto.value = ''
                    return
                }
                if (ext !== 'pdf') {
                    this.$toast.error('El adjunto solo puede ser formato PDF');
                    this.$refs.adjunto.value = ''
                    return
                }
                if (file[0] != undefined) {
                    const formData = new FormData();
                    formData.append('adjunto', file[0]);
                    formData.append('id', this.id_glosa)
                    this.$axios.post('radicacion-glosa/cargarArchivo', formData).then((res) => {
                        if (res.data.mensaje == 'Aun no existe una respuesta!') {
                            this.$toast.error(res.data.mensaje);
                        } else {
                            this.$toast.success('Adjunto cargado con exito!');
                        }
                        this.glosasPrestador(this.af)

                    }).catch((error) => {
                        this.$toast.error('Error al cargar el adjunto, intente de nuevo');
                    });
                }
            },

            guardarAuditoria(factura) {
                console.log('factura', factura);
                let vacio = false;
                for (let i = 0; i < factura.length; i++) {
                    const element = factura[i]
                    if (element.estado == null) {
                        vacio = true;
                        break;
                    }
                }
                if (vacio == true) {
                    this.$toast.error('No ha dado respuesta a todas las glosas.')
                    return;
                }
                this.$axios.post('factura/guardarAuditoriaPrestador/' + this.af.id).then(res => {
                    this.facturasPrestador();
                    this.dialogoGlosa = false
                    this.$toast.success('Respuesta guardada con exito.')
                }).catch(e => {
                    console.log(e);
                })
            },

            glosasConciliacion() {
                this.preload = true
                this.$axios.post('factura/facturasConciliacion', {
                    numero_factura: this.numero_factura,
                    nit: this.nit
                }).then(
                    res => {
                        this.preload = false
                        this.listaGlosaConciliacion = res.data
                    }).catch(e => {
                    this.preload = false
                    console.log(e);
                })
            },

            verGlosasConciliacion(afs) {
                this.af = afs
                this.$axios.get('glosa/glosasConciliacion/' + afs.id).then(
                    res => {
                        this.glosaConcialiacion = res.data
                        this.dialogoConciliacion = true
                    })
            },

            glosasCerradas() {
                this.preload = true
                this.$axios.post('factura/facturasCerradas', {
                    numero_factura: this.numero_factura,
                    nit: this.nit
                }).then(res => {
                    this.preload = false
                    this.listaGlosaCerradas = res.data
                }).catch(e => {
                    this.preload = false
                    console.log(e);
                })
            },

            verGlosasCerradas(afs) {
                this.af = afs
                this.$axios.get('glosa/glosasCerrada/' + afs.id).then(res => {
                    this.glosaCerrada = res.data
                    this.dialogoCerradas = true
                })
            },

            async AdjuntoFactura(ruta) {
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
            }



        },
    };

</script>
