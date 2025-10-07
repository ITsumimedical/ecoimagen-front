<template>
    <div>
        <v-card elevation="0" class="pa-4">
            <v-card-title class="pa-0 mb-3">
                <v-row class="align-center justify-space-between w-100">
                    <v-col cols="12" md="4" class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50" width="50" />
                        <span>Gestión Sucesos</span>
                        <v-divider vertical class="mx-3"></v-divider>
                    </v-col>

                    <v-col cols="12" md="8" class="d-flex flex-wrap justify-end">
                        <v-chip v-for="estado in estadosBackend" :key="estado.estado_id" class="ma-1" label small
                            :color="chipColor(estado.estado_id)" text-color="white"
                            @click="filtrarPorEstado(estado.estado_id)">
                            <v-icon left small>{{ chipIcon(estado.estado_id) }}</v-icon>
                            {{ estado.nombre_estado }}: {{ estado.total }}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" v-if="tieneFiltrosActivos">
                        <div class="mb-2 font-weight-medium">Filtros aplicados:</div>
                        <v-chip-group column>
                            <template v-if="filtro.evento_id">
                                <v-chip dark small label color="blue-grey" @click="removeFiltro('evento_id')">
                                    <b>Radicado:</b> {{ filtro.evento_id }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>

                            <template v-if="filtro.numero_documento_afiliado">
                                <v-chip dark small label color="blue-grey"
                                    @click="removeFiltro('numero_documento_afiliado')">
                                    <b>Documento:</b> {{ filtro.numero_documento_afiliado }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>

                            <template v-if="filtro.nombre">
                                <v-chip dark small label color="blue-grey" @click="removeFiltro('nombre')">
                                    <b>Afiliado:</b> {{ filtro.nombre }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>

                            <template v-if="filtro.sede_ocurrencia">
                                <v-chip dark small label color="blue-grey" @click="removeFiltro('sede_ocurrencia')">
                                    <b>Sede:</b> {{ filtro.sede_ocurrencia }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>

                            <template v-if="filtro.suceso">
                                <v-chip dark small label color="blue-grey" @click="removeFiltro('suceso')">
                                    <b>Suceso:</b> {{ filtro.suceso }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>

                            <template v-if="filtro.fecha_desde && filtro.fecha_hasta">
                                <v-chip dark small label color="blue-grey" @click="removeFiltro('fechas')">
                                    <b>Rango:</b> {{ filtro.fecha_desde }} - {{ filtro.fecha_hasta }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </template>
                        </v-chip-group>
                        <v-divider class="my-2"></v-divider>
                    </v-col>

                    <v-col cols="12" sm="6" md="2">
                        <v-text-field label="Radicado" v-model="filtro.evento_id" dense outlined type="number" />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-text-field label="Documento" v-model="filtro.numero_documento_afiliado" dense outlined
                            type="number" />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-text-field label="Afiliado" v-model="filtro.nombre" dense outlined />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-text-field label="Sede ocurrencia" v-model="filtro.sede_ocurrencia" dense outlined />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-text-field label="Suceso" v-model="filtro.suceso" dense outlined />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-dialog v-model="dialogoFechas" persistent max-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field outlined dense v-bind="attrs" v-on="on" v-model="filtro.fecha_desde"
                                    label="Fecha registro" readonly append-icon="mdi-calendar" />
                            </template>
                            <v-date-picker locale="es-co" v-model="fechasSeleccionadas" range
                                @input="actualizarRangoFechas" />
                            <v-btn small color="error" @click="dialogoFechas = false">Cerrar</v-btn>
                        </v-dialog>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-autocomplete label="Estados combinados" dense outlined v-model="filtro.estados"
                            :items="estadosFiltro" chips multiple deletable-chips small-chips clearable />
                    </v-col>

                    <v-col cols="12" md="6" class="d-flex align-center justify-end mb-6">
                        <v-btn color="primary" class="mr-2" small @click="listarEventos()">
                            <v-icon left small>mdi-magnify</v-icon> Filtrar
                        </v-btn>
                        <v-btn color="error" small @click="limpiarFiltros()">
                            <v-icon left small>mdi-broom</v-icon> Limpiar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-data-table dense :headers="headers" :search="buscarEventos" :items="eventosAdversos" class="elevation-1"
            hide-default-footer :items-per-page="opcionActual" :loading="loading" loading-text="Cargando..."
            no-data-text="Sin datos para mostrar">
            <template v-slot:[`item.estadoEvento`]="{ item }">
                <v-chip small :color="getColor(item.estado_id)" dark label>
                    {{ colorEstado(item.estado_id) }}
                </v-chip>
            </template>
            <template v-slot:[`item.priorizacionEvento`]="{ item }">
                <v-chip label small v-if="item.priorizacion == 'Prioritario'"
                    :color="getColorPriorizacion(item.priorizacion)" dark>
                    {{ "Prioritario" }}
                </v-chip>
                <v-chip label small v-if="item.priorizacion == 'No prioritario'"
                    :color="getColorPriorizacion(item.priorizacion)" dark>
                    {{ "No prioritario" }}
                </v-chip>
                <v-chip small label v-if="item.priorizacion == 'Urgente'"
                    :color="getColorPriorizacion(item.priorizacion)" dark>
                    {{ "Urgente" }}
                </v-chip>
            </template>
            <template v-slot:[`item.diasPriorizacion`]="{ item }">
                <template v-if="item.diasPriorizacion !== 0 && item.diasPriorizacion !== null">
                    <v-chip small :color="getColorDiasPriorizacion(item.diasPriorizacion, item.priorizacion)" dark
                        label>
                        {{ item.diasPriorizacion }}
                    </v-chip>
                </template>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="blue-grey" class="mr-2" v-bind="attrs" v-on="on"
                            v-if="$can('historico.transiciones.eventos')" @click="abrirDialogHistoricoTransciones(item)"
                            v-model="eventoAdverso.analizar">
                            mdi-history
                        </v-icon>
                    </template>
                    <span>Histórico transiciones</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                            @click="abrirDialogoEventoSeleccionado(item)" v-model="eventoAdverso.analizar">
                            mdi-magnify
                        </v-icon>
                    </template>
                    <span>Investigación y análisis</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on" @click="imprimirPdf(item)"
                            v-model="eventoAdverso.analizar">
                            mdi-cloud-download-outline
                        </v-icon>
                    </template>
                    <span>Informe PDF</span>
                </v-tooltip>
            </template>
        </v-data-table>

        <v-row no-gutters style="background-color: white;">
            <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarEventos">
                </v-pagination>
            </v-col>
            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small
                    @change="listarEventos()">
                </v-select>
            </v-col>
        </v-row>

        <v-dialog v-model="componenteAnular" max-width="900px" persistent>
            <v-card>
                <AnularEventoComponente :eventoAdverso="eventoSeleccionado" @cerrarDialog="componenteAnular = false"
                    @anulado="EventoAnulado()" />
            </v-card>
        </v-dialog>

        <v-dialog v-model="componenteAsignar" max-width="900px" persistent>
            <v-card>
                <AsignarEventoComponente :eventoAdverso="eventoSeleccionado" @cerrarDialog="componenteAsignar = false"
                    @asignado="eventoAsignado()" />
            </v-card>
        </v-dialog>

        <v-dialog v-model="componenteCerrar" max-width="600px" persistent>
            <v-card>
                <CierreEventoComponente :eventoAdverso="eventoSeleccionado" @cerrarDialog="componenteCerrar = false"
                    @eventoCerrado="eventoCerrado()" />
            </v-card>
        </v-dialog>

        <v-dialog v-model="componenteReasignar" max-width="900px" persistent>
            <v-card>
                <ReasignarEventoComponente :eventoAdverso="eventoSeleccionado"
                    @cerrarDialog="componenteReasignar = false" @devuelto="eventoReasignado()" />
            </v-card>
        </v-dialog>

        <v-dialog v-model="componenteHistoricoTransiciones" max-width="900px" persistent>
            <v-card>
                <HistoricoGestionesEventoComponente ref="HistoricoEvento" :eventoAdverso="eventoAdverso.id"
                    @cerrarHistorico="componenteHistoricoTransiciones = false"></HistoricoGestionesEventoComponente>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEventoSeleccionado" fullscreen persistent>
            <v-card>
                <v-toolbar flat dense color="info" dark>
                    <v-toolbar-title class="d-flex align-center">
                        <v-icon left class="mr-2">mdi-file-document-outline</v-icon>
                        <span class="font-weight-medium">Gestión del Evento</span>
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon @click="cerrarDialogEventoSeleccionado()" color="white">
                        <v-icon small>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-container fluid style="background-color: #f5f5f5; border-radius: 8px;">
                    <v-row>
                        <!-- Panel detalle -->
                        <v-col cols="12" md="4" v-show="mostrarDetalle">
                            <v-card outlined class="pa-2">
                                <v-card-title class="d-flex align-center justify-space-between">
                                    <span class="font-weight-bold text-subtitle-1">Información del Evento</span>

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon small v-bind="attrs" v-on="on" @click="mostrarDetalle = false">
                                                <v-icon color="grey darken-1">mdi-eye-off-outline</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Ocultar detalle</span>
                                    </v-tooltip>
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-card-text>
                                    <DetalleEventoComponente ref="detalleEventoAdverso"
                                        :eventoAdverso="eventoSeleccionado" />
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Panel investigación -->
                        <v-col :cols="mostrarDetalle ? 8 : 12">
                            <v-card outlined class="pa-2">
                                <v-card-title class="d-flex align-center justify-space-between">
                                    <span class="font-weight-bold text-subtitle-1">Investigación y Plan de mejora</span>

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon small v-bind="attrs" v-on="on"
                                                @click="mostrarDetalle = !mostrarDetalle">
                                                <v-icon :color="mostrarDetalle ? 'grey darken-1' : 'primary'">
                                                    {{ mostrarDetalle ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ mostrarDetalle ? 'Ocultar detalle' : 'Mostrar detalle' }}</span>
                                    </v-tooltip>
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-card-text>
                                    <InvestigacionEventoComponente :eventoAdverso="eventoSeleccionado"
                                        ref="analisisPlan"
                                        @analisisRegistrado="asignacionDatosInvestigacionEvento(eventoSeleccionado)" />
                                </v-card-text>
                            </v-card>
                        </v-col>

                    </v-row>
                </v-container>

                <v-divider></v-divider>
                <v-card-actions class="pa-4" style="background-color: #f5f5f5; border-radius: 8px;">

                    <v-btn v-if="$can('eventoAdverso.cerrar') && eventoSeleccionado.estado_id === 18"
                        @click="componenteCerrar = true" color="purple" dark small>
                        Cerrar Investigación (Final)
                        <v-icon right>mdi-check</v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn :disabled="!puedeCerrarParcial" color="warning" dark small @click="confirmarCierreParcial">
                        Cierre investigación (Parcial)
                        <v-icon right>mdi-check</v-icon>
                    </v-btn>

                    <v-tooltip bottom v-if="eventoSeleccionado.estado_id === 16">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-bind="attrs" v-on="on" @click="dialogInfo = true">
                                <v-icon color="info">mdi-information</v-icon>
                            </v-btn>
                        </template>
                        <span>Ver condiciones necesarias para cierre parcial</span>
                    </v-tooltip>

                    <v-btn small v-if="eventoSeleccionado.estado_id === 10" @click="componenteAsignar = true"
                        color="primary">
                        Asignar
                        <v-icon right>mdi-human-greeting</v-icon>
                    </v-btn>

                    <v-btn small @click="componenteAnular = true" color="warning"
                        v-if="$can('eventoAdverso.cierreAgil') && ![17, 5].includes(eventoSeleccionado.estado_id)">
                        Cerrar
                        <v-icon right>mdi-check-circle-outline</v-icon>
                    </v-btn>

                    <v-btn small v-if="eventoSeleccionado.estado_id !== 10 && eventoSeleccionado.estado_id !== 17"
                        @click="componenteReasignar = true" color="primary">
                        Devolver
                        <v-icon right>mdi-arrow-left-bottom-bold</v-icon>
                    </v-btn>

                    <v-btn small @click="cerrarDialogEventoSeleccionado()" color="error">
                        Salir
                        <v-icon right>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialogo de información botones -->
        <v-dialog v-model="dialogInfo" max-width="500px">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold">Condiciones para habilitar los botones</v-card-title>
                <v-card-text>
                    <ul>
                        <li>El estado del evento debe ser <strong>(Plan de mejora cumplido)</strong> o <strong>
                                (Analizado)</strong>.</li>
                        <li>Debe tener permiso <strong>eventoAdverso.cerrar</strong> (solo para cierre final).</li>
                        <li>
                            Si la clasificación del análisis es <strong>Evento adverso prevenible</strong> o
                            <strong>Centinela</strong>, es obligatorio que exista una acción insegura registrada.
                            (Protocolo de
                            londres)
                        </li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="dialogInfo = false"> <v-icon left>mdi-close</v-icon>
                        Salir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import AnularEventoComponente from "~/components/evento/AnularEventoComponente.vue";
import AsignarEventoComponente from "~/components/evento/AsignarEventoComponente.vue";
import CierreEventoComponente from "~/components/evento/CierreEventoComponente.vue";
import DetalleEventoComponente from "~/components/evento/DetalleEventoComponente.vue";
import FiltroEstadoEventoComponente from "~/components/evento/FiltroEstadoEventoComponente.vue";
import InvestigacionEventoComponente from "~/components/evento/InvestigacionEventoComponente.vue";
import ReasignarEventoComponente from "~/components/evento/ReasignarEventoComponente.vue";
import HistoricoGestionesEventoComponente from "~/components/evento/HistoricoEventoAdversoComponente.vue";
import {
    mapActions
} from "vuex"
export default {
    components: {
        DetalleEventoComponente,
        FiltroEstadoEventoComponente,
        AsignarEventoComponente,
        AnularEventoComponente,
        ReasignarEventoComponente,
        InvestigacionEventoComponente,
        CierreEventoComponente,
        HistoricoGestionesEventoComponente
    },
    middleware({ $can, redirect }) {
        if (!$can("eventoAdverso.gestion")) {
            return redirect("/");
        }
    },
    name: "WorkspaceJsonanlisisEventos",
    data() {
        return {
            dialogInfo: false,
            mostrarDetalle: true,
            pagina: 1,
            total: 0,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            last_page: null,
            filtro: {
                evento_id: null,
                nombre: null,
                numero_documento_afiliado: null,
                sede_ocurrencia: null,
                suceso: null,
                fecha_desde: null,
                fecha_hasta: null,
                estados: []
            },
            estadosPlanMejora: ["PENDIENTE", "CUMPLIDO"],
            nuevaAccionMejora: [],
            accionesInseguraEvento: [],
            nuevaAccionInsegura: {},
            nuevosItems: [],
            campo: "",
            loading: false,
            dialog: false,
            dialogoEditar: false,
            buscarEventos: "",
            componenteAnular: false,
            componenteAsignar: false,
            componenteCerrar: false,
            componenteReasignar: false,
            componenteHistoricoTransiciones: false,
            eventos: [],
            fechasSeleccionadas: [],
            dialogoFechas: false,
            eventosAdversos: [],
            listaEmpleados: [],
            contadores: [],
            estadosMap: [
                { estado_id: 5, nombre_estado: "Cerrado final" },
                { estado_id: 10, nombre_estado: "Pendiente" },
                { estado_id: 6, nombre_estado: "Asignado" },
                { estado_id: 38, nombre_estado: "Seguimiento" },
                { estado_id: 39, nombre_estado: "Plan de Mejora" },
                { estado_id: 16, nombre_estado: "Analizado" },
                { estado_id: 18, nombre_estado: "Cerrado parcial" }
            ],
            eventoSeleccionado: {},
            dialogEventoSeleccionado: false,
            estadosFiltro: [
                {
                    text: 'Pendientes',
                    value: 10
                },
                {
                    text: 'Asignados',
                    value: 6
                },
                {
                    text: 'Plan Mejora',
                    value: 38
                },
                {
                    text: 'Plan Cumplido',
                    value: 39
                },
                {
                    text: 'Analizados',
                    value: 16
                },
                {
                    text: 'Cerrado parcial',
                    value: 18
                },
                {
                    text: 'Cerrados',
                    value: [17, 5]
                },
            ],
            eventoAdverso: {
                anular: false,
                asignar: false,
                reasignar: false,
                analizar: false,
                cerrar: false,
                metodologia_analisis: "",
                que_fallo: "",
                como_fallo: "",
                que_causo: "",
                plan_accion: "",
                desenlace_evento: "",
                evento_adverso_id: "",
                estado_id: null
            },
            analisis: {
                nombre: "",
                responsable: "",
                fecha_cumplimiento: "",
                fecha_seguimiento: "",
                estado: "",
                analisis_evento_id: "",
            },
            gestionEvento: {
                evento_adverso_id: "",
                user_id: "",
                accion: "",
                motivo: "",
            },
            soporteAccionMejora: {
                observacion: "",
            },
            accionInsegura: {
                nombre: "",
                analisis_evento_id: "",
                condiciones_paciente: "",
            },
            eventoAnalizado: "",
            editedIndex: -1,
            defecto: {
                priorizacion: "",
                voluntariedad: false,
                identificacion_riesgo: "",
                anular: false,
                asignar: false,
                reasignar: false,
                analizar: false,
                cerrar: false,
                metodologia_analisis: "",
                plan_accion: "",
                evento_adverso_id: "",
            },
            errors: {
                metodologia_analisis: "",
                plan_accion: "",
                evento_adverso_id: "",
                accion_resarcimiento: "",
                desenlace_evento: "",
                descripcion_consecuencias: "",
                que_fallo: "",
                como_fallo: "",
                que_causo: "",
                fecha_analisis: "",
            },
            paginate: {
                total: 0,
                pagina: 1,
            },
            headers: [
                {
                    text: "Id",
                    value: "id",
                },
                {
                    text: "Suceso",
                    value: "nombre_suceso",
                },
                {
                    text: "Sede ocurrencia",
                    value: "sede_ocurrencia",
                },
                {
                    text: "Fecha reporte",
                    value: "fecha_creacion",
                },
                {
                    text: "Documento afiliado",
                    value: "numero_documento_afiliado",
                },
                {
                    text: "Afiliado",
                    value: "nombre_afiliado",
                },
                {
                    text: "Entidad afiliado",
                    value: "entidad_afiliado",
                },
                {
                    text: "Priorización",
                    sortable: false,
                    value: "priorizacionEvento",
                    align: "center",
                },
                {
                    text: "Días",
                    sortable: false,
                    value: "diasPriorizacion",
                    align: "center",
                },
                {
                    text: "Estado",
                    sortable: false,
                    value: "estadoEvento",
                    align: "center",
                },
                {
                    text: "Acciones",
                    value: "actions",
                    align: "center",
                    sortable: false,
                },
            ],
        };
    },

    mounted() {
        this.listarEventos();
        this.contadoresEstado();
    },

    computed: {
        tieneFiltrosActivos() {
            return this.filtro.evento_id || this.filtro.numero_documento_afiliado || this.filtro.nombre || this.filtro.sede_ocurrencia || this.filtro.suceso || (this.filtro.fecha_desde && this.filtro.fecha_hasta);
        },
        colorEstado() {
            return (estado_id) => {
                switch (estado_id) {
                    case 10:
                        return "Pendiente asignación";
                    case 6:
                        return "Asignado";
                    case 15:
                        return "Reasignado";
                    case 5:
                        return "Cerrado";
                    case 16:
                        return "Analizado";
                    case 17:
                        return "Cerrado";
                    case 38:
                        return "Plan de Mejora";
                    case 39:
                        return "Plan de Mejora Cumplido";
                    case 18:
                        return "Cerrado parcial";
                    default:
                        return "";
                }
            };
        },
        estadosBackend() {
            return this.estadosMap.map((estado, index) => ({
                ...estado,
                total: this.contadores[index] || 0
            }));
        },
        puedeCerrarParcial() {
            return (
                (this.eventoSeleccionado.estado_id == 39 ||
                    this.eventoSeleccionado.estado_id == 16) &&
                this.validarCondiciones()
            );
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        getColor(estado_id) {
            const colorMap = {
                10: "orange",
                6: "blue",
                15: "green",
                16: "blue-grey",
                17: "indigo",
                38: "#A1887F",
                39: "green",
                5: "indigo",
                18: 'lime'
            };

            return colorMap[estado_id] || "red";
        },

        getColorPriorizacion(priorizacion) {
            if (priorizacion == "Prioritario") return "#FBC02D";
            if (priorizacion == "No prioritario") return "#2E7D32";
            if (priorizacion == "Urgente") return "red";
            else return "red";
        },

        getColorDiasPriorizacion(dias, tipo) {
            const colores = {
                'Urgente': [
                    { limite: 1, color: 'error' },
                    { limite: Infinity, color: 'yellow black--text' }
                ],
                'Prioritario': [
                    { limite: 2, color: 'error' },
                    { limite: 6, color: 'yellow black--text' },
                    { limite: Infinity, color: 'success' }
                ],
                'No prioritario': [
                    { limite: 3, color: 'error' },
                    { limite: 7, color: 'yellow black--text' },
                    { limite: Infinity, color: 'success' }
                ]
            };

            const reglas = colores[tipo] || [{ limite: Infinity, color: 'success' }];
            return reglas.find(regla => dias <= regla.limite).color;
        },

        close() {
            this.dialog = false;
            this.dialogPlan = false;
            this.soporteAccionMejora.observacion = "";
            this.soporteAccionMejora.accion_mejora_id = "";
            this.listarEventos();

        },

        listarEventos() {
            this.setPreload(true);
            const params = {
                page: this.pagina,
                cantidad: this.opcionActual,
                id: this.filtro.evento_id,
                cedula: this.filtro.numero_documento_afiliado,
                nombre: this.filtro.nombre,
                sede_ocurrencia: this.filtro.sede_ocurrencia,
                suceso: this.filtro.suceso,
                fecha_desde: this.filtro.fecha_desde,
                fecha_hasta: this.filtro.fecha_hasta,
                estados: this.filtro.estados?.flat()
            };

            this.$axios.post('/eventos-adversos/listar', params)
                .then((res) => {
                    this.eventosAdversos = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch((e) => {
                    console.log(e.res.data);
                }).finally(() => {
                    this.setPreload(false);
                })
        },

        actualizarRangoFechas() {
            if (this.fechasSeleccionadas.length === 2) {
                this.filtro.fecha_desde = this.fechasSeleccionadas[0];
                this.filtro.fecha_hasta = this.fechasSeleccionadas[1];

                this.dialogoFechas = false;
            }
        },

        removeFiltro(filtro) {
            if (filtro === "fechas") {
                this.filtro.fecha_desde = "";
                this.filtro.fecha_hasta = "";
            } else if (filtro === "evento_id") {
                this.filtro.evento_id = "";
            } else if (filtro === "numero_documento_afiliado") {
                this.filtro.numero_documento_afiliado = "";
            } else if (filtro === "nombre") {
                this.filtro.nombre = "";
            } else if (filtro === "sede_ocurrencia") {
                this.filtro.sede_ocurrencia = "";
            } else if (filtro === "suceso") {
                this.filtro.suceso = "";
            }
        },

        listarEmpleados() {
            this.$axios
                .get("/operador/listarActivos")
                .then((res) => {
                    this.listaEmpleados = res.data.map((empleado) => {
                        return {
                            id: empleado.user_id,
                            nombre: `${empleado.documento} - ${empleado.nombre_completo}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                });
        },

        actualizarAnalisis() {
            this.setPreload = true;
            if (this.eventoAdverso.cerrar == true) {
                this.eventoAdverso.estado_id = 17;
            }
            if (this.analisis.estado == "PENDIENTE") {
                this.eventoAdverso.estado_id = 38;
            }
            if (this.soporteAccionMejora.observacion) {
                this.eventoAdverso.estado_id = 39;
            }
            this.$axios
                .put(
                    "/analisis-eventos/" +
                    this.eventoAdverso.analisis_evento_id,
                    this.eventoAdverso
                )
                .then((res) => {
                    this.$toast.success("Análisis actualizado exitosamente!");
                    if (
                        this.eventoAdverso.asignar == true ||
                        this.eventoAdverso.anular == true ||
                        this.eventoAdverso.cerrar == true
                    ) {
                        this.guardarGestionEvento();
                    }
                    this.dialog = false;
                })
                .catch((error) => {
                    if (error.response.data.message) {
                        this.$toast.error(error.response.data.message);
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data);
                    }
                }).finally(() => {
                    this.setPreload(false);
                })

            this.listarEventos();
            this.limpiarError();
        },

        guardarGestionEvento() {
            this.gestionEvento.evento_adverso_id = this.eventoAdverso.id;
            this.gestionEvento.user_id = this.$store.state.auth.usuario.id;
            this.$axios
                .post("/gestion-eventos/crear", this.gestionEvento)
                .then((res) => {
                    this.$toast.success("Registro de gestión almacenado");
                });
        },

        asignar() {
            this.eventoAdverso.asignar = true;
            this.eventoAdverso.anular = false;
            this.eventoAdverso.reasignar = false;
            this.eventoAdverso.analizar = false;
            this.eventoAdverso.cerrar = false;
            this.listarEventos();
        },

        reasignar() {
            this.eventoAdverso.reasignar = true;
            this.eventoAdverso.anular = false;
            this.eventoAdverso.asignar = false;
            this.eventoAdverso.analizar = false;
            this.eventoAdverso.cerrar = false;
            this.listarEventos();
        },

        analizar(item) {
            this.editedIndex = this.eventosAdversos.indexOf(item);
            this.eventoAdverso = Object.assign({}, item);
            this.dialog = true;
            this.eventoAdverso.analizar = true;
            this.eventoAdverso.asignar = false;
            this.eventoAdverso.reasignar = false;
            this.eventoAdverso.anular = false;
            this.eventoAdverso.cerrar = false;
            this.actualizarProtocoloLondres();
            this.actualizarAccionesMejora();
            this.actualizarAsignados()
            this.listarEventos();
        },

        cerrar() {
            this.eventoAdverso.cerrar = true;
            this.eventoAdverso.asignar = false;
            this.eventoAdverso.anular = false;
            this.eventoAdverso.reasignar = false;
            this.eventoAdverso.analizar = false;
            this.listarEventos();
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = "";
            }
        },

        limpiar() {
            this.setPreload(true);
            for (const prop of Object.getOwnPropertyNames(this.filtro)) {
                this.filtro[prop] = null;
            }
            for (const key in this.eventoAdverso) {
                this.eventoAdverso[key] = "";
            }
            this.editedIndex = -1;
            this.dialog = false;
            this.setPreload(false);
            this.listarEventos();
        },

        editar(item) {
            this.editedIndex = this.eventosAdversos.indexOf(item);
            this.eventoAdverso = Object.assign({}, item);
            this.dialog = true;
        },

        imprimirPdf(item) {
            const data = {
                tipo: "eventoAdverso",
                id: item.id,
            };
            this.$axios
                .post("pdf", data, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                });
        },

        EventoAnulado() {
            this.componenteAnular = false,
                this.cerrarDialogEventoSeleccionado()
        },

        eventoAsignado() {
            this.componenteAsignar = false,
                this.cerrarDialogEventoSeleccionado()
        },

        eventoCerrado() {
            this.componenteCerrar = false,
                this.cerrarDialogEventoSeleccionado()
        },

        eventoReasignado() {
            this.componenteReasignar = false,
                this.cerrarDialogEventoSeleccionado()
        },

        actualizarProtocoloLondres() {
            this.$nextTick(() => {
                this.$refs.accionesInseguras?.listarAccionesInseguras()
            });

        },

        actualizarAccionesMejora() {
            this.$nextTick(() => {
                this.$refs.accionesMejoras?.listarAccionesMejora()
            });
        },

        actualizarAsignados() {
            this.$nextTick(() => {
                this.$refs.responsablesAsignados?.listarEmpleadosAsignados()
            });
        },

        abrirDialogHistoricoTransciones(item) {
            this.eventoAdverso = item
            this.componenteHistoricoTransiciones = true,
                this.$nextTick(() => {
                    this.$refs.HistoricoEvento.listarHistorico()
                })
        },

        limpiarFiltros() {
            this.filtro = {}
            this.listarEventos();
        },

        contadoresEstado() {
            this.$axios.get('eventos-adversos/contadores-eventos').then((res) => {
                this.contadores = res.data
            }).catch((error) => {
                console.error(error)
            })
        },

        nombreEstado(index) {
            const labels = ["Cerrados", "Pendientes", "Asignados", "Seguimiento", "Plan mejora", "Analizados"];
            return labels[index] || "Desconocido";
        },
        chipIcon(estadoId) {
            const icons = {
                5: "mdi-check-circle",
                10: "mdi-clock-alert",
                6: "mdi-account-arrow-right",
                38: "mdi-lightbulb-on",
                39: "mdi-magnify",
                16: "mdi-eye",
                17: "mdi-cancel",
                18: "mdi-alert-circle"
            };
            return icons[estadoId] || "mdi-help-circle";
        },
        chipColor(estadoId) {
            const colors = {
                5: "green lighten-2",
                10: "orange lighten-2",
                6: "blue lighten-2",
                38: "teal lighten-2",
                39: "indigo lighten-2",
                16: "purple lighten-2",
                17: "red lighten-2",
                18: "lime"
            };
            return colors[estadoId] || "grey";
        },
        async listarEventoSeleccionado(item) {
            try {
                this.setPreload(true);
                const res = await this.$axios.get(`eventos-adversos/listar-eventos-id/${item.id}`);
                this.eventoSeleccionado = res.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.setPreload(false);
            }
        },

        async abrirDialogoEventoSeleccionado(item) {
            await this.listarEventoSeleccionado(item);
            this.dialogEventoSeleccionado = true;
            this.$nextTick(() => {
                this.$refs.detalleEventoAdverso.listarEmpleadosAsignados();
                this.$refs.detalleEventoAdverso.listarSucesos();
                this.$refs.detalleEventoAdverso.listarClasiAreas();
                this.$refs.detalleEventoAdverso.listarTiposEventos();
                this.$refs.detalleEventoAdverso.listarOperadores();
                this.$refs.detalleEventoAdverso.listarSedesReporte();
                this.$refs.analisisPlan.asignacionDatos();
            });
        },

        async asignacionDatosInvestigacionEvento(item) {
            await this.listarEventoSeleccionado(item);
            this.$nextTick(() => {
                this.$refs.analisisPlan.asignacionDatos();
            })
        },

        cerrarDialogEventoSeleccionado() {
            this.dialogEventoSeleccionado = false,
                this.$refs.analisisPlan?.$refs.planMejora?.emitirEventoLimpiar()
            this.listarEventos();
        },

        filtrarPorEstado(estadoId) {
            this.filtro.estados = [estadoId];
            this.pagina = 1;
            this.listarEventos();
        },

        validarCondiciones() {
            const clasificacion =
                this.eventoSeleccionado.analisis_evento?.clasificacion_analisis;
            const accionInsegura =
                this.eventoSeleccionado.analisis_evento?.accion_insegura;

            if (
                clasificacion == "Evento adverso prevenible" ||
                clasificacion == "Centinela"
            ) {
                return accionInsegura !== null;
            }

            return true;
        },

        confirmarCierreParcial() {
            this.$swal({
                title: "¿Está seguro?",
                text: "La investigación quedará cerrada de manera parcial. Posteriormente, un líder del proceso revisará el análisis y realizará el cierre final.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar parcial",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios.post("eventos-adversos/actualizar-estado", {
                        evento_adverso_id: this.eventoSeleccionado.id,
                        estado_id: 18,
                    })
                        .then(() => {
                            this.$toast.success("El evento se cerró parcialmente con éxito.");
                            this.cerrarDialogEventoSeleccionado();
                        })
                        .catch((error) => {
                            console.error(error);
                            this.$toast.error("Hubo un error al cerrar el evento parcialmente.");
                        });
                }
            });
        },

    },
};
</script>
