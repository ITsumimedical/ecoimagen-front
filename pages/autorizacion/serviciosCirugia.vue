<template>
    <div>
        <!-- preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Procesando Información
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Modificar prestadores -->
        <v-dialog v-model="ModalPrestadorprestador" persistent width="550" v-if="$can('actualizar.prestadorServicios')">
            <v-card>
                <v-alert border="left" text dense type="info">
                    <h4>Modificar prestador</h4>
                </v-alert>
                <v-card-text>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete no-data-text="Digite el nombre del prestador para inciar la búsqueda"
                            :search-input.sync="prestador" dense v-model="cambioRep.rep_id" :items="listaPrestadores"
                            item-text="nombre" return-object label="Prestador*">
                        </v-autocomplete>
                    </v-col>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="ModalPrestadorprestador = false, limpiarData()">
                        Cerrar
                    </v-btn>
                    <v-btn v-if="selected.length > 0" color="success" dark small @click="actualizarRep()">
                        Actualizar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modificar cantidad servicio -->
        <v-dialog persistent v-model="modalCambioCantidad" max-width="500px">
            <v-card>
                <v-alert dense text border="left" type="info" icon="mdi-counter">Proceso de cambio de cantidad servicio
                </v-alert>
                <v-form>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field type="number" v-model="cambioCantidad.cantidad" label="Nueva Cantidad"
                                    min="1">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="cambioCantidad.observacion" label="Observación"
                                    auto-grow></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small dark color="red" @click="modalCambioCantidad = false">Cancelar</v-btn>
                    <v-btn small color="success" @click="actualizarCantidad()">Actualizar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialogo envio correo -->
        <v-dialog v-model="modalEmail" persistent max-width="600px">
            <v-card>
                <v-alert dense text border="left" type="info" icon="mdi-email-arrow-right">¿Desea enviar orden por
                    correo
                    electrónico?
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="emailEnvio" label="Correo electrónico" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="info" @click="SendEmail()">Enviar<v-icon right>mdi-arrow-right</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-alert dense text border="left" type="success" icon="mdi-download-circle">Exportar orden en
                    PDF</v-alert>
                <v-card-actions>
                    <v-btn small color="error"
                        @click="cerrarDialog(); emailEnvio = null; datosEnvioEmail = null; modalEmail = false; dialogDetalle = false">
                        Cerrar<v-icon right>mdi-close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small color="success" @click="imprimir()">Imprimir<v-icon right>mdi-arrow-down</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- adjuntos afiliado -->
        <v-dialog v-model="dialogDetalle" width="1200" v-if="dialogDetalle" persistent>
            <v-card>
                <v-col cols="12" sm="12" md="12" v-if="afiliado">
                    <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                <h3>ADJUNTOS</h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
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

                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-alert border="left" text dense type="success" icon="mdi-hospital-box-outline">
                        <div class="d-flex justify-space-between">
                            <h4>Servicios</h4>
                            <v-btn color="success" small @click="agregarNuevo()"
                                v-if="$can('agregar.nuevo.servicio.autorizacion')">
                                Agregar
                            </v-btn>
                        </div>
                    </v-alert>

                    <v-dialog v-model="NuevoCupCirugia" max-width="700px">
                        <nuevaCirugia :articulo="datos" :cirugia="true" @close-dialog="NuevoCupCirugia = false"
                            @servicioAgregado="actualizarData"></nuevaCirugia>
                    </v-dialog>

                    <v-data-table dense v-model="selected" :headers="headersProcedimientoDetalle"
                        :items="procedimientos" :single-select="singleSelect" item-key="id" show-select
                        hide-default-footer>
                        <template v-slot:[`item.campoPrestador`]="{ item }">
                            <td @click="openDialog(item)">{{ item.rep ? item.rep.nombre : 'Sin Direccionamiento' }}
                            </td>
                        </template>
                        <template v-slot:[`item.campoCantidad`]="{ item }">
                            <td @click="openDialogCantidad(item)">{{ item.cantidad }}
                            </td>
                        </template>
                    </v-data-table>
                </v-col>

                <v-col cols="12" sm="12" md="12">


                    <v-col cols="12" sm="12" md="12">
                        <v-form>
                            <v-row dense>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert border="left" text dense type="info">
                                        <h4>Proceso autorización</h4>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select dense v-model="formAuditoria.estado" label="Seleccionar acción*"
                                        :items="estados" item-text="nombre" item-value="id"></v-select>
                                </v-col>
                                <v-col cols="2" sm="2" md="2" v-if="selected.length >= 1">
                                    <v-checkbox dense v-model="posFechar" label="¿Pos-Fechar?"
                                        color="primary"></v-checkbox>
                                </v-col>
                                <v-col cols="12" sm="3" md="3" v-if="selected.length >= 1 && this.posFechar == true">
                                    <v-text-field dense v-model="formAuditoria.fecha_vigencia" label="pos-fechado"
                                        type="date">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea dense auto-grow v-model="formAuditoria.observacion"
                                        label="Observaciones*" rows="2">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>

                </v-col>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarDialog()">Cerrar</v-btn>
                    <v-btn v-if="selected.length > 0" small color="success" @click="enviarEstado">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <!-- Modulo de autorizacion -->
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Autorización de <b>cirugias</b></span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="2" sm="3">
                        <v-text-field outlined dense v-model="formFilter.fecha_inicio" label="Fecha inicial" required
                            type="date">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="3">
                        <v-text-field outlined dense v-model="formFilter.fecha_final" label="Fecha final" required
                            type="date">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="3">
                        <v-text-field outlined dense v-model="formFilter.orden_id" label="N° Orden"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="3">
                        <v-text-field outlined dense v-model="formFilter.documento" label="Documento Afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="3">
                        <v-autocomplete dense outlined v-model="formFilter.departamento" label="Departamento"
                            :items="departamento" item-text="nombre" item-value="id" hide-details></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2" sm="3">
                        <v-btn color="primary" @click="buscarOrdenes" small>Buscar</v-btn>
                        <v-btn color="error" @click="limpiarFiltro()" small>Limpiar Filtro</v-btn>
                    </v-col>
                </v-row>

            </v-card-text>
            <v-col cols="12" md="12" sm="12">
                <v-data-table hide-default-footer disable-pagination :headers="headerServicios" :items="ordenes"
                    :search="buscar" :loading="loading" loading-text="Cargando información de ordenes">
                    <template v-slot:[`item.acciones`]="{ item }">
                        <td class="text-center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="blue" v-on="on"
                                        @click="cargarDetalles(item, item.procedimientos, item.consulta.afiliado, item.consulta.afiliado.id, item.consulta_id)">
                                        <v-icon>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                                <span>Detalles</span>
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
            </v-col>

        </v-card>
        <br>



    </div>
</template>
<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import nuevaCirugia from "@/components/autorizacion/serviciosComponent.vue"
import {
    listarDepartamento
} from "@/api/departamentos/departamento";
import moment from "moment";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('autorizacion.servicios')) {
            return redirect('/');
        }
    },
    name: 'autorizacionServicios',
    components: {
        AfiliadoComponent,
        nuevaCirugia
    },
    data() {
        return {
            datosEnvioEmail: null,
            emailEnvio: null,
            modalEmail: false,
            pagina: 1,
            total: 0,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            cambioRep: {},
            cambioCantidad: {
                observacion: '',
                cantidad_anterior: '',
            },
            cantidadTemporal: {},
            ModalPrestadorprestador: false,
            modalCambioCantidad: false,
            prestador: '',
            listaPrestadores: [],
            departamento: [],
            buscar: '',
            posFechar: false,
            consulta_id: '',
            familia: '',
            findFamily: '',
            listaTipoFamilia: [],
            tipoFamilia: '',
            procedimientos: [],
            ordenes: [],
            singleSelect: false,
            selected: [],
            loading: false,
            dialogDetalle: false,
            headerServicios: [{
                text: 'Fecha Creación',
                align: 'center',
                sortable: true,
                value: 'fecha_creacion',
            },
            {
                text: 'Cedula',
                align: 'center',
                sortable: true,
                value: 'consulta.afiliado.numero_documento',
            },
            {
                text: 'Nombre',
                align: 'center',
                sortable: true,
                value: 'consulta.afiliado.nombre_completo',
            },
            {
                text: 'Departamento',
                align: 'center',
                sortable: true,
                value: 'consulta.afiliado.departamento_afiliacion.nombre',
            },
            // {
            //   text: 'Subregion',
            //   align: 'center',
            //   sortable: true,
            //   value: 'consulta.afiliado.subregion.nombre',
            // },
            {
                text: 'IPS Primaria',
                align: 'center',
                sortable: true,
                value: 'consulta.afiliado.ips.nombre',
            },
            {
                text: 'Orden',
                align: 'center',
                sortable: true,
                value: 'id',
            },
            {
                text: 'Funcionario Crea',
                align: 'center',
                sortable: true,
                value: 'funcionario.operador.nombre_completo',
            },
            {
                text: 'Acciones',
                align: 'center',
                sortable: false,
                value: 'acciones',
            },
            ],
            formFilter: {
                fecha_inicio: moment().format('YYYY-MM-DD'),
                fecha_final: moment().add(1, 'days').format('YYYY-MM-DD'),
                documento: null,
                departamento: null,
                orden_id: null
            },
            anios: [],
            meses: [{
                id: '01',
                nombre: 'Enero'
            },
            {
                id: '02',
                nombre: 'Febrero'
            },
            {
                id: '03',
                nombre: 'Marzo'
            },
            {
                id: '04',
                nombre: 'Abril'
            },
            {
                id: '05',
                nombre: 'Mayo'
            },
            {
                id: '06',
                nombre: 'Junio'
            },
            {
                id: '07',
                nombre: 'Julio'
            },
            {
                id: '08',
                nombre: 'Agosto'
            },
            {
                id: '09',
                nombre: 'Septiembre'
            },
            {
                id: '10',
                nombre: 'Octubre'
            },
            {
                id: '11',
                nombre: 'Noviembre'
            },
            {
                id: '12',
                nombre: 'Diciembre'
            },
            ],
            formAuditoria: {
                estado: null,
                observacion: null
            },
            headersProcedimientoDetalle: [{
                text: 'id procedimiento',
                align: 'center',
                sortable: false,
                value: 'id',
            },

            {
                text: 'Código',
                align: 'center',
                sortable: false,
                value: 'cup.codigo',
            },
            {
                text: 'Nombre',
                align: 'center',
                sortable: false,
                value: 'cup.nombre',
            },
            {
                text: 'Observacion',
                align: 'center',
                sortable: false,
                value: 'observacion',
            },
            {
                text: 'Prestador',
                align: 'center',
                sortable: false,
                value: 'campoPrestador',
            },
            {
                text: 'Telefono prestador',
                align: 'center',
                sortable: false,
                value: 'rep.telefono1',
            },
            {
                text: 'Dirección prestador',
                align: 'center',
                sortable: false,
                value: 'rep.direccion',
            },
            {
                text: 'Cantidad',
                align: 'center',
                sortable: false,
                value: 'campoCantidad',
            },
            {
                text: 'Fecha Vigencia',
                align: 'center',
                sortable: false,
                value: 'fecha_vigencia',
            },
            ],
            paginaOrden: 1,
            totalOrden: 0,
            opcionesOrden: [5, 10, 20, 50, 100],
            opcionActualOrden: 10,
            afiliado: {},
            preload: false,
            loading: false,
            listaAdjuntos: [],
            NuevoCupCirugia: false,
            articulo: '',
            estados: [{
                id: 4,
                nombre: "Autorizado"
            },
            {
                id: 20,
                nombre: "Inadecuado"
            },
            {
                id: 21,
                nombre: "Negado"
            },
            {
                id: 5,
                nombre: "Anulado"
            },
            ],
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
            listaFamilia: [],
            index: -1
        }
    },
    mounted() {
        this.buscarOrdenes();
        this.listarDepartamentos();
    },

    methods: {
        buscarOrdenes() {
            this.formFilter.tipo = 2;
            this.formFilter.cirugia = true;
            this.loading = true;

            const params = {
                page: this.pagina,
                cant: this.opcionActual
            };

            this.$axios.post('/auditoria/ordenamiento', this.formFilter, {
                params
            })
                .then(res => {
                    this.ordenes = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch(e => {
                    this.$toast.error(e.response.data.error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        buscarAfiliado(item) {
            this.preload = true
            this.$axios.get(`/afiliados/${item.numero_documento}/${item.tipo_documento.id}`).then((res) => {
                this.afiliado = res.data;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false
                    this.$toast.error(e.response.data.error);
                });
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
        cargarDetalles(datos, articulo, afiliado, id_afiliado, consulta) {

            this.buscarAfiliado(afiliado)
            this.buscarAdjuntos(id_afiliado)
            this.consulta_id = consulta;
            this.procedimientos = articulo;
            this.datos = datos;
            this.dialogDetalle = true;

        },
        enviarEstado() {
            let data = this.formAuditoria
            data.consulta = this.consulta_id;
            data.procedimientos = this.selected;
            if (data.observacion === null || data.estado === null) {
                return this.$swal.fire({
                    title: "¡No puede ser!",
                    text: "Debe determinar un estado e ingresar una observación",
                    type: "error",
                    footer: '<p>Por favor valide la información ingresada</p>'
                });
            }
            this.preload = true
            this.$axios.$post('/auditoria/auditoria-estado', data).then(res => {
                this.preload = false
                this.$toast.success(res);
                this.buscarOrdenes();
                this.modalEmail = true
            }).catch((e) => {
                this.preload = false
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

        cerrarDialog() {
            this.consulta_id = ''
            // this.detalleSeleccionado = null;
            this.procedimientos = [];
            this.dialogDetalle = false;
            this.modalEmail = false;
            this.selected = [];
            for (const prop of Object.getOwnPropertyNames(this.formAuditoria)) {
                this.formAuditoria[prop] = null;
            }
        },

        listarTipoFamilia() {
            this.preload = true
            this.$axios.get("tipo-familia/").then((res) => {
                this.listaTipoFamilia = res.data;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false
                    // this.$toast.error(e.response.data.error);
                });
        },

        openDialog(item) {
            if (this.selected.length > 0) {
                this.ModalPrestadorprestador = true
                this.cambioRep.id = item.id
            } else {
                return this.$swal({
                    title: "¡Información!",
                    text: "Selecciona el servicio al que deseas actualizar el direccionamiento haciendo clic en el recuadro de verificación ubicado en la parte lateral izquierda de la tabla.",
                    type: "info",
                    footer: '<b>Nota:</b> <p>Puedes seleccionar varios servicios para actualizar el prestador de manera conjunta.</p>'
                });
            }
        },

        openDialogCantidad(item) {
            if (this.selected.length > 0) {
                this.modalCambioCantidad = true;
                this.cambioCantidad.id = item.id;
                this.cambioCantidad.cantidad_anterior = item.cantidad;

                this.cantidadTemporal[item.id] = item.cantidad;
            } else {
                return this.$swal({
                    title: "¡Información!",
                    text: "Selecciona el servicio al que deseas actualizar la cantidad haciendo clic en el recuadro de verificación ubicado en la parte lateral izquierda de la tabla.",
                    type: "info",
                    footer: '<b>Nota:</b> <p>Puedes seleccionar varios servicios para actualizar la cantidad de manera conjunta.</p>',
                });
            }
        },

        listarPrestadores() {
            this.preload = true;
            this.$axios.post('reps/listar?page=0', {
                prestador: this.prestador
            }).then(res => {
                this.preload = false;
                this.listaPrestadores = res.data.map((rep) => {
                    return {
                        id: rep.id,
                        nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
                    }
                })
            }).catch(e => {
                this.preload = false;
                console.log(e);
            })
        },

        limpiarData() {
            for (const key in this.cambioRep) {
                this.cambioRep[key] = null;
            }
            this.cantidadTemporal = {};

        },

        /**
         * listar departamentos
         * @return departamento objeto
         * @author kobatime
         */
        async listarDepartamentos() {
            try {
                const {
                    data
                } = await this.$loadingGetRequest(listarDepartamento());
                this.departamento = data;
                this.afiliado = this.datos
                this.getClasificacion();
                if (crear == false) {
                    this.getClasificacionAfiliado();
                }
            } catch (error) {
                console.log(error);
            }
        },

        limpiarFiltro() {
            for (const prop of Object.getOwnPropertyNames(this.formFilter)) {
                this.formFilter[prop] = null;
            }
            this.formFilter.fecha_inicio = moment().format('YYYY-MM-DD'),
                this.formFilter.fecha_final = moment().add(1, 'days').format('YYYY-MM-DD'),
                this.buscarOrdenes();
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
                id: this.selected.map((selected) => {
                    return selected.id
                }),
                rep_id: this.cambioRep.rep_id.id,
                tipo: 2
            }).then(res => {
                this.preload = false;
                this.limpiarData()
                this.ModalPrestadorprestador = false
                this.dialogDetalle = false
                this.buscarOrdenes()
                this.selected = []
            }).catch(e => {
                this.preload = false;
                console.log(e);
            })
        },

        actualizarCantidad() {
            if (this.cambioCantidad.observacion === '' || this.cambioCantidad.cantidad === '') {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Es necesario que realice sus observaciones sobre el cambio de cantidad y determine una nueva cantidad",
                    type: "error",
                });
            }
            this.preload = true;

            const data = {
                id: this.selected.map(selected => selected.id),
                cantidad: this.selected.map(() => this.cambioCantidad
                    .cantidad),
                observacion: this.cambioCantidad.observacion,
                cantidad_anterior: this.selected.map(selected => this.cantidadTemporal[selected
                    .id]),
                accion: 'Cambio de cantidad ordenada'
            };

            this.$axios.post('ordenamiento/actualizarCantidad', data)
                .then(res => {
                    this.preload = false;
                    this.limpiarData();
                    this.modalCambioCantidad = false;
                    this.dialogDetalle = false;
                    this.buscarOrdenes();
                    this.selected = [];
                    this.$toast.success('Se ha actualizado la cantidad ordenada');
                })
                .catch(e => {
                    this.preload = false;
                    return this.$toast.error(e.response.data.error);
                });
        },

        imprimir() {
            let procedimientos = []

            this.procedimientos.forEach((select) => {
                let obj = {
                    identificador: select.id,
                };

                procedimientos.push(obj);
            });

            let pdf = {
                tipo: 'servicio',
                enviar: false,
                servicios: procedimientos

            }
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

        SendEmail() {
            var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (!regex.test(this.emailEnvio)) {
                return this.$swal.fire({
                    title: "Debe ingresar un correo electrónico valido",
                    icon: "warning",
                    type: "error",
                });
            }

            let procedimientos = []

            this.procedimientos.forEach((select) => {
                let obj = {
                    identificador: select.id,
                };

                procedimientos.push(obj);
            });
            let pdf = {
                tipo: 'servicio',
                enviar: true,
                correo: this.emailEnvio,
                servicios: procedimientos

            }
            this.$axios.post('pdf', pdf).then(res => {
                this.emailEnvio = null;
                this.datosEnvioEmail = null;
                this.modalEmail = false;
                this.procedimientos = [];
                this.cerrarDialog()
                return this.$swal.fire({
                    title: "¡Orden enviada con exito!",
                    icon: "success",
                    type: "success",
                });
            }).catch(err => (err.response));

        },

        agregarNuevo() {
            this.NuevoCupCirugia = true;
        },
        actualizarData() {
            this.nuevaCirugia = false;
            this.dialogDetalle = false;
            this.buscarOrdenes()
        }
    },

    watch: {
        findFamily: function () {
            if (this.tipoFamilia) {
                this.$axios.post("familia/listar", {
                    tipo_familia_id: this.tipoFamilia
                }).then((res) => {
                    this.listaFamilia = res.data.data;
                    this.preload = false;
                })
                    .catch((e) => {
                        this.preload = false
                        // this.$toast.error(e.response.data.error);
                    });
            }
        },
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
}

</script>
