<template>
    <div>

        <v-dialog v-if="datoSeleccionado !== null" v-model="dialogSeguimientos" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Seguimiento
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-textarea v-model="nuevoSegumiento" auto-grow outlined label="Seguimiento"></v-textarea>
                            </v-col>
                            <template v-if="tipoTabla === 1">
                                <v-col cols="12" md="12" v-if="isJsonString(listaProcedimientoPendientes[datoSeleccionado]['seguimiento'])">
                                    <template v-for="item in JSON.parse(listaProcedimientoPendientes[datoSeleccionado]['seguimiento'])">
                                        <p>
                                            <strong>{{item.fecha}}</strong>
                                            <br>
                                            {{item.observacion}}
                                            <br>
                                            <strong>Responsable: </strong>{{item.responsable}}
                                        </p>
                                        <v-divider></v-divider>
                                        <br>
                                    </template>
                                </v-col>
                            </template>
                            <template v-else-if="tipoTabla === 2">
                                <v-col cols="12" md="12" v-if="isJsonString(listarAsignacionCita[datoSeleccionado]['seguimiento'])">
                                    <template v-for="item in JSON.parse(listarAsignacionCita[datoSeleccionado]['seguimiento'])">
                                        <p>
                                            <strong>{{item.fecha}}</strong>
                                            <br>
                                            {{item.observacion}}
                                            <br>
                                            <strong>Responsable: </strong>{{item.responsable}}
                                        </p>
                                        <v-divider></v-divider>
                                        <br>
                                    </template>
                                </v-col>
                            </template>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark @click="dialogSeguimientos = false">Cerrar</v-btn>
                    <v-btn v-if="tipoTabla === 1" color="success" dark @click="agregarObservacion()">Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>





        <v-card>
            <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>Gestion de resultados clinicos oncologícos</b>
            </v-alert>
            <v-col cols="12" sm="12" md="12">
                <v-row>
                    <v-col cols="12" sm="3" md="3" v-if="$can('oncologia.resultados.pendientes.ordenamiento')">
                        <v-alert text dense color="#ab7600" icon="mdi-account-clock" border="left"
                                 @click="dataTableSelect(1)">
                            <v-badge color="orange" :content="contadorPendientes">Pendientes por ordenamiento</v-badge>
                        </v-alert>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-alert text dense color="#003696" icon="mdi-receipt-clock-outline" border="left"
                                 @click="dataTableSelect(2)">
                            <v-badge color="purple" :content="contadorPendienteOrdenamiento">Pendiente asignación de
                                cita
                            </v-badge>
                        </v-alert>
                    </v-col>
                    <v-col cols="12" sm="3" md="3" v-if="$can('oncologia.resultados.toma.muestra')">
                        <v-alert text dense color="#369efa" icon="mdi-receipt-clock-outline" border="left"
                                 @click="dataTableSelect(3)">
                            <v-badge color="#369efa" :content="contadorTomaMuestra">Tomas de procedimiento</v-badge>
                        </v-alert>
                    </v-col>
                    <!-- <v-col cols="12" sm="3" md="3">
                      <v-alert text dense color="#FA0B13" icon="mdi-clipboard-check" border="left" @click="dataTableSelect(3)">
                        <v-badge color="red" :content="contadorSeguimiento">Seguimiento</v-badge>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                      <v-alert text dense color="#138EBB" icon="mdi-file-document-check" border="left" @click="dataTableSelect(4)">
                        <v-badge color="#138EBB" :content="contadorSeguimiento">Autorización</v-badge>
                      </v-alert>
                    </v-col> -->
                </v-row>
                <div v-if="tipoTabla === 1">
                    <v-card-title>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar por alguna columna"
                                          single-line
                                          hide-details>
                            </v-text-field>
                        </v-col>
                    </v-card-title>
                    <v-data-table :headers="headersPendientes" :loading="loading" dense
                                  :items="listaProcedimientoPendientes"
                                  :search="search">
                        <template v-slot:item.clasificacion="{item}">
                            <v-edit-dialog
                                :return-value.sync="item.clasificacion_muestra"
                                @save="actualizar(item.id,{clasificacion_muestra:item.clasificacion_muestra})"
                                @cancel="cancel"
                                @open="open"
                                @close="close"
                                large cancel-text="Cancelar" save-text="Actualizar">
                                {{ item.clasificacion_muestra }}
                                <template v-slot:input>
                                    <v-select :items="clasificacionesMuestra" v-model="item.clasificacion_muestra"></v-select>
                                </template>
                            </v-edit-dialog>
                        </template>
                        <template v-slot:[`item.estado`]="{ item }">
                            <v-chip small :color="getColor(item.estado)" dark>
                                {{ item.estado }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.codigo_cie10`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">{{ item.codigo_cie10 }}</span>
                                </template>
                                <span>{{ item.cie10 }}</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.adjunto`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" color="info" @click="adjuntoOncologico(item.ruta)">
                                        mdi-folder-download
                                    </v-icon>
                                </template>
                                <span>Adjunto</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }" v-if="$can('oncologia.resultados.pendientes.ordenamiento.acciones')">
                            <Ordenamiento :consulta="parseInt(item.consulta_id)" :habilitarBoton="true"
                                          :dialog="false"/>
                        </template>
                        <template v-slot:[`item.finalizar`]="{ item }" v-if="$can('oncologia.resultados.pendientes.ordenamiento.acciones')">
                            <v-btn color="red" dark rounded small @click="finalizar(item)">finalizar</v-btn>
                        </template>
                        <template v-slot:[`item.eliminar`]="{ item,index }">
                            <v-tooltip bottom v-if="$can('oncologia.resultados.pendientes.ordenamiento.acciones')">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-on="on" color="red" icon dark rounded small @click="dialogEliminar = true;idSeleccionado = item.id">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-on="on" color="primary" icon dark rounded small @click="datoSeleccionado = index ;dialogSeguimientos = true">
                                        <v-icon>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                                <span>Seguimiento</span>
                            </v-tooltip>



                        </template>
                    </v-data-table>
                </div>
                <div v-if="tipoTabla === 2">
                    <v-card-title>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="# Radicado" single-line
                                          hide-details>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Documento" single-line
                                          hide-details>
                            </v-text-field>
                        </v-col>
                    </v-card-title>
                    <v-data-table :headers="headersPendientesCita" dense :items="listarAsignacionCita" :search="search">
                        <template v-slot:item.clasificacion="{item}">
                            <v-edit-dialog
                                :return-value.sync="item.clasificacion_muestra"
                                @save="actualizar(item.toma,{clasificacion_muestra:item.clasificacion_muestra})"
                                @cancel="cancel"
                                @open="open"
                                @close="close"
                                large cancel-text="Cancelar" save-text="Actualizar">
                                {{ item.clasificacion_muestra }}
                                <template v-slot:input>
                                    <v-select :items="clasificacionesMuestra" v-model="item.clasificacion_muestra"></v-select>
                                </template>
                            </v-edit-dialog>
                        </template>
                        <template v-slot:[`item.adjunto`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" color="info" @click="adjuntoOncologico(item.ruta)">
                                        mdi-folder-download
                                    </v-icon>
                                </template>
                                <span>Adjunto</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item,index }" >
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" color="info" @click="detalleOrden(item)">
                                        mdi-card-account-details-star
                                    </v-icon>
                                </template>
                                <span>Detalle orden</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="$can('oncologia.resultados.pendientes.cita.acciones')">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-on="on" icon color="red" @click="eliminar(item)">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-on="on" color="primary" icon dark rounded small @click="datoSeleccionado = index ;dialogSeguimientos = true">
                                        <v-icon>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                                <span>Seguimiento</span>
                            </v-tooltip>
                        </template>

                        <template v-slot:[`item.estadoR`]="{ item }">
                            <v-chip small :color="getColor(item.estadoR)" dark>
                                {{ item.estadoR }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </div>
                <div v-if="tipoTabla === 3">
                    <v-card-title>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar por alguna columna"
                                          single-line
                                          hide-details>
                            </v-text-field>
                        </v-col>
                    </v-card-title>
                    <v-data-table :headers="headersTomaMuestra" :loading="loading" dense :items="tomaMuestraRealizadas"
                                  :search="search">
                        <template v-slot:[`item.adjunto`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" color="info"
                                            @click="adjuntoOncologico(item.adjunto.ruta)">
                                        mdi-folder-download
                                    </v-icon>
                                </template>
                                <span>Adjunto</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </div>
            </v-col>
        </v-card>
        <v-dialog v-model="dialogoAgendamiento" max-width="1250px" v-if="dialogoAgendamiento">
            <v-container fluid class="pa-0">
                <v-card>
                    <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline"
                             class="text-center">
                        <b>Agendamiento</b>
                    </v-alert>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <Agendamiento :docuemntoAfiliado="documentoAfiliado"
                                                  @actualizarToma="actualizarTomaProcedimientos" :oncologia="true"/>
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogoAgendamiento = false,toma_id=''">
                            Cancelar
                        </v-btn>
                    </v-card-actions>

                </v-card>
            </v-container>
        </v-dialog>
        <v-dialog v-model="dialogDetalle" max-width="1250px" v-if="dialogDetalle">
            <v-container fluid class="pa-0">
                <v-card>
                    <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline"
                             class="text-center">
                        <b>Detalle ordenamiento</b>
                    </v-alert>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-data-table :headers="headersServicios" :loading="loading"
                                                  :items="detalleOrdenamiento">
                                        <template v-slot:[`item.estado`]="{ item }">
                                            <td class="text-center">
                                                <v-chip
                                                    v-if="parseInt(item.estadoOrden) === 1 || parseInt(item.estadoOrden) === 4"
                                                    color="success">
                                                    {{ item.nombreEstado }}
                                                </v-chip>
                                                <v-chip v-else-if="parseInt(item.estadoOrden) === 3" color="warning">
                                                    {{ item.nombreEstado }}
                                                </v-chip>
                                                <v-chip v-else-if="parseInt(item.estadoOrden) === 5" color="error">
                                                    {{ item.nombreEstado }}
                                                </v-chip>
                                            </td>
                                        </template>
                                        <template v-slot:[`item.FechaOrdenamiento`]="{ item }">
                                            <td class="text-center">{{ item.FechaOrdenamiento.substr(0, 10) }}</td>
                                        </template>
                                        <template v-slot:[`item.imprimir`]="{ item }">
                                            <td class="text-center">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn icon color="blue" v-on="on" @click="imprimir(item)">
                                                            <v-icon>mdi-file-download</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Descargar</span>
                                                </v-tooltip>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogDetalle = false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>

                </v-card>
            </v-container>
        </v-dialog>
        <v-dialog v-model="dialogEliminar" width="500">
            <div>
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Eliminar Carga de resultados
                    </v-card-title>
                    <v-card-text>
                        <v-textarea v-model="formEliminar.observaciones" rows="3" label="Observaciones"></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="dialogEliminar = false">Cancelar</v-btn>
                        <v-btn color="success" small @click="inhabilitarPendienteOrdenamiento()">Enviar</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-dialog>
    </div>
</template>

<script>
import ordenamientoComponet from '~/components/ordenamiento/ordenamiento.vue'
import Agendamiento from '~/pages/cita/agendamiento.vue'
import {mapActions} from "vuex";

export default {
    name: 'WorkspaceJsonSolicitudesPrestadores',
    components: {
        ordenamientoComponet,
        Agendamiento
    },
    data() {
        return {
            clasificacionesMuestra:[
                'Patología básica',
                'Inmunohistoquímica',
                'Citometría de flujo',
                'Genética',
                'Medula Osea',
                'Clínica exclusivamente (incluye estudios imagenológicos y/o de laboratorio en aquellos casos clínicamente justificados en donde fue imposible tomar muestra de estudio histopatológico)',
                'Desconocido, el dato de esta variable no se encuentra descrito en los soportes clínicos.',
                'Reporte Biopsia POP',
                'Reporte Biopsia Pcte Hospitalizado'
            ],
            datoSeleccionado:null,
            nuevoSegumiento:null,
            dialogSeguimientos: false,
            idSeleccionado:null,
            formEliminar:{
                estado_id:5,
                observaciones:null
            },
            dialogEliminar:false,
            tomaMuestraRealizadas: [],
            consulta_id: '',
            toma_id: '',
            loading: false,
            search: '',
            dialogDetalle: false,
            detalleOrdenamiento: [],
            dialogoAgendamiento: false,
            listaProcedimientoPendientes: [],
            listarAsignacionCita: [],
            contadorPendientes: 0,
            contadorPendienteOrdenamiento: 0,
            contadorSeguimiento: 0,
            contadorTomaMuestra: 0,
            documentoAfiliado: null,
            tipoTabla: 0,
            headersPendientes: [{
                text: '# Radicado',
                align: 'start',
                sortable: false,
                value: 'id',
            },
                {
                    text: 'Tipo Solicitud',
                    value: 'tipo_radicacion'
                },
                {
                    text: 'Nombre',
                    value: 'afiliado'
                },
                {
                    text: 'Documento',
                    value: 'numero_documento'
                },
                {
                    text: 'Entidad',
                    value: 'reps'
                },
                {
                    text: 'Codigo Diagnostico',
                    value: 'codigo_cie10'
                },
                {
                    text: 'Nombre Diagnosticos',
                    value: 'cie10'
                },
                {
                    text: 'Clasificación Muestra',
                    value: 'clasificacion'
                },
                {
                    text: 'Fecha Registro',
                    value: 'fecha_registro'
                },
                {
                    text: 'Registrado por',
                    value: 'empleado'
                },
                {
                    text: 'Id Consulta',
                    value: 'consulta_id'
                },
                {
                    text: 'Adjunto',
                    value: 'adjunto'
                },
                {
                    text: 'Estado',
                    value: 'estado'
                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false
                },
                {
                    text: 'Finalizar',
                    value: 'finalizar',
                    sortable: false
                },
                {
                    text: '',
                    value: 'eliminar',
                    sortable: false
                }
            ],
            headersPendientesCita: [{
                text: '# Radicado',
                align: 'start',
                sortable: false,
                value: 'toma',
            },
                {
                    text: 'Tipo Solicitud',
                    value: 'tipo_radicacion'
                },
                {
                    text: 'Nombre',
                    value: 'afiliado'
                },
                {
                    text: 'Documento',
                    value: 'numero_documento'
                },
                {
                    text: 'Entidad',
                    value: 'reps'
                },
                {
                    text: 'Codigo Diagnostico',
                    value: 'codigo_cie10'
                },
                {
                    text: 'Nombre Diagnosticos',
                    value: 'cie10'
                },
                {
                    text: 'Clasificación Muestra',
                    value: 'clasificacion'
                },
                {
                    text: 'Fecha Registro',
                    value: 'fecha_registro'
                },
                {
                    text: 'Registrado por',
                    value: 'empleado'
                },
                {
                    text: 'Id Consulta',
                    value: 'id'
                },
                {
                    text: 'Adjunto',
                    value: 'adjunto'
                },
                {
                    text: 'Estado',
                    value: 'estadoR'
                },

                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false
                },
            ],
            headersServicios: [{
                text: '# Consecutivo',
                align: 'center',
                sortable: false,
                value: 'consecutivo',
            },
                {
                    text: '# Orden',
                    align: 'center',
                    sortable: false,
                    value: 'id',
                },
                {
                    text: 'Fecha creacion',
                    align: 'center',
                    sortable: false,
                    value: 'FechaOrdenamiento',
                },
                {
                    text: 'Fecha vigencia',
                    align: 'center',
                    sortable: false,
                    value: 'fecha_vigencia',
                },
                {
                    text: 'Codigo',
                    align: 'center',
                    sortable: false,
                    value: 'Codigo',
                },
                {
                    text: 'Nombre',
                    align: 'center',
                    sortable: false,
                    value: 'Nombre',
                },
                {
                    text: 'Cantidad',
                    align: 'center',
                    sortable: false,
                    value: 'Cantidad_Dosis',
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
            ],
            headersTomaMuestra: [
                {
                    text: '# Radicado',
                    align: 'start',
                    sortable: false,
                    value: 'id',
                },
                {
                    text: 'Tipo Solicitud',
                    value: 'tipo_radicacion'
                },
                {
                    text: 'Nombre',
                    value: 'afiliado.nombre_completo'
                },
                {
                    text: 'Documento',
                    value: 'afiliado.numero_documento'
                },
                {
                    text: 'Entidad',
                    value: 'rep.nombre'
                },
                {
                    text: 'Fecha Procedimiento',
                    value: 'fecha_procedimiento'
                },
                {
                    text: 'Organo',
                    value: 'organo.nombre'
                },
                {
                    text: 'Fecha Registro',
                    value: 'created_at'
                },
                {
                    text: 'Registrado Por',
                    value: 'registrado.nombre_completo'
                },
                {
                    text: 'Adjunto',
                    value: 'adjunto'
                },
            ]
        };
    },

    created() {
        this.contador()
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        listar() {
            this.setPreload(true);
            this.loading = true
            this.$axios.get('/toma-procedimiento/listar').then(res => {
                this.listaProcedimientoPendientes = res.data.listarTomaProcedimientosPendientes
                this.loading = false
            }).catch(e => {
                console.log(e.response);
            }).finally(() => this.setPreload(false));
        },
        async adjuntoOncologico(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);

                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('El adjunto no existe!')
                console.log(error.response);
            }
        },
        contador() {
            this.$axios.get('/toma-procedimiento/contador').then(res => {
                this.contadorPendientes = res.data.contadorPendientes;
                this.contadorPendienteOrdenamiento = res.data.contadorPendienteOrdenamiento;
                this.contadorSeguimiento = res.data.contadorSeguimiento;
                this.contadorTomaMuestra = res.data.contadorTomaMuestra;
            })
        },
        dataTableSelect(item) {
            this.tipoTabla = item
            switch (item) {
                case 1:
                    this.listar();
                    break;
                case 2:
                    this.listarPendientesAsignacion();
                    break;
                case 3:
                    this.listarTomaMuestrasRealiadas();
                    break;
            }
        },
        getColor(estado) {
            if (estado === 'Pendiente') return 'orange'
            else return 'green'
        },
        ordenar(item) {
            this.consulta_id = item.consulta_id
            this.modalOrdenamiento = true
        },

        listarPendientesAsignacion() {
            this.setPreload(true);
            this.loading = true
            this.$axios.get('/toma-procedimiento/listarPendientesAsignacion').then(res => {
                this.listarAsignacionCita = res.data.listarTomaProcedimientosPendientes
                this.loading = false
            }).catch(e => {
                console.log(e.response)
            }).finally(() => this.setPreload(false));
        },

        detalleOrden(item) {
            const ordenesServicios = item.ordenes.map(s => {
                let data = s;
                data.tipo = 'servicio';
                return data;
            });
            let ordenesCodigoPropios = item.ordenes_codigos_propios.map(s => {
                let data = s;
                data.tipo = 'codigoPropio';
                return data;
            });
            this.detalleOrdenamiento = ordenesServicios.concat(ordenesCodigoPropios)
            this.dialogDetalle = true;
        },

        agendar(item) {
            this.toma_id = item.toma
            this.documentoAfiliado = item.numero_documento
            this.dialogoAgendamiento = true
        },

        imprimir(item) {

            let pdf = {
                tipo: item.tipo,
                id: item.id,
                detalles: {id: item.consecutivo}
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

        actualizarTomaProcedimientos() {
            this.$axios.post('toma-procedimiento/actualizarEstado', {toma_id: this.toma_id}).then(res => {
                // this.$toast.success('Factura asignada con exito.')
            }).catch(e => {
                this.$toast.error('Error')
            })
        },

        finalizar(item) {
            this.$swal({
                title: 'Finalizar ordenamiento de toma de procedimiento',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.value) {
                    this.$axios.post('toma-procedimiento/actualizarEstado', {toma_id: item.id}).then(res => {
                        this.dataTableSelect(this.tipoTabla);
                        this.contador();
                    }).catch(e => {
                        this.$toast.error('Error')
                    })
                } else {
                    // this.procedimientosSeleccionados = [];
                }
            })
            this.comp = '';
            this.dialogOrdenamiento = false;
        },
        eliminar(item) {
            this.setPreload(true);
            this.$axios.delete('toma-procedimiento/eliminar/' + item.toma).then(res => {
                this.$toast.success(res.data.mensaje);
                this.dataTableSelect(this.tipoTabla);
                this.contador();
            }).catch(e => {
                console.log(e.response)
            }).finally(() => this.setPreload(false));
        },
        listarTomaMuestrasRealiadas() {
            this.setPreload(true)
            this.$axios.get('toma-procedimiento/toma-muestras-realizadas').then(res => {
                this.tomaMuestraRealizadas = res.data;
            }).catch(e => {
                console.log(e.response)
            }).finally(() => this.setPreload(false));
        },
        inhabilitarPendienteOrdenamiento(){
            if(!this.formEliminar.observaciones){
                return this.$toast.error('El campo "Observaciones" es requerido.')
            }
            this.setPreload(true)
            this.$axios.put('toma-procedimiento/'+this.idSeleccionado,this.formEliminar).then(res => {
                this.$toast.success(res.data.mensaje);
                this.dialogEliminar = false;
                this.idSeleccionado = null;
                this.formEliminar.observaciones = null;
                this.dataTableSelect(this.tipoTabla);
                this.contador();
            }).catch(e => {
                console.log(e.response)
            }).finally(() => this.setPreload(false));
        },
        isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        agregarObservacion(){
            if(!this.nuevoSegumiento){
                return this.$toast.error('El campo "Nueva Observacion" es requerido.');
            }
            const fechaActual = this.$moment().format('YYYY-MM-DD HH:mm');
            let arrDatos = [];
            if(this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento']){
                if(this.isJsonString(this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento'])){
                    arrDatos = JSON.parse(this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento']);
                }else{
                    arrDatos.push({
                        fecha:'2025-02-01 08:00',
                        observacion:this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento'],
                        responsable:'Ingreso Carga Masiva'
                    })
                }
            }
            let objNuevo = {
                fecha:fechaActual,
                observacion:this.nuevoSegumiento,
                responsable:this.$store.state.auth.usuario.operador.nombre_completo
            };
            arrDatos.push(objNuevo);
            this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento'] = JSON.stringify(arrDatos);
            const id  = this.listaProcedimientoPendientes[this.datoSeleccionado]['id'];
            const data ={seguimiento:this.listaProcedimientoPendientes[this.datoSeleccionado]['seguimiento']};
            this.actualizar(id,data);
        },
        cancel() {
        },
        open() {
        },
        close() {
        },
        actualizar(id,data){
            this.setPreload(true);
            this.$axios.put('toma-procedimiento/'+id,data).then(res => {
                this.$toast.success(res.data.mensaje);
                this.nuevoSegumiento = null;
            }).catch(e => console.log()).finally(() => this.setPreload(false))
        },
    },
};

</script>

<style lang="scss" scoped>

</style>
