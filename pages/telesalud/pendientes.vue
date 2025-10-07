<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Pendientes - Telesalud</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="12" sm="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-select dense outlined append-icon="mdi-filter-variant" label="Tipo de Solicitud"
                            :items="opcionesTipoSolicitudes" v-model="filtros.tipo_solicitud_id" item-text="nombre"
                            item-value="id"></v-select>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <v-autocomplete dense outlined v-model="filtros.ips_id" label="Sede" item-text="nombre"
                            item-value="id" :search-input.sync="campoBusquedaRep" :loading="loading.reps"
                            :items="opcionesReps"
                            no-data-text="Digite el nombre de la sede para buscar."></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <v-text-field dense outlined label="N° de Documento" v-model="filtros.numeroDocumento"
                            @keyup.enter="listarTeleapoyosPendientes()" single-line clearable hide-details
                            @click:clear="listarTeleapoyosPendientes()" append-icon="mdi-account-search"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-menu dense v-model="menu.fechaInicio" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined label="Fecha Inicio" v-model="filtros.fechaInicio"
                                    append-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly></v-text-field>
                            </template>
                            <v-date-picker v-model="filtros.fechaInicio"
                                @input="menu.fechaInicio = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-menu dense v-model="menu.fechaFin" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense outlined label="Fecha Fin" v-model="filtros.fechaFin"
                                    append-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly></v-text-field>
                            </template>
                            <v-date-picker v-model="filtros.fechaFin" @input="menu.fechaFin = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" md="12" sm="12" align="right">
                        <v-btn color="primary" @click="listarTeleapoyosPendientes()" small>Filtrar</v-btn>
                        <v-btn color="error" @click="limpiarFiltros()" small>Limpiar Filtro</v-btn>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-data-table dense :headers="headersTelesalud" :items="registrosTelesalud"
                            :loading="loading.tablaTelesalud" no-data-text="No hay resultados"
                            loading-text="Cargando... Por favor espere" :items-per-page="cantidadRegistros"
                            hide-default-footer disable-pagination>
                            <template v-slot:[`item.afiliado_nombre`]="{ item }">
                                {{ obtenerNombreCompletoAfiliado(item.afiliado) }}
                            </template>
                            <template v-slot:[`item.tipoSolicitud`]="{ item }">
                                <v-chip small dark :color="item.tipo_solicitud.id === 1 ? 'warning' : 'error'">{{
                                    item.tipo_solicitud.nombre }}</v-chip>
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" color="primary"
                                            @click="abrirModalGestionar(item)">
                                            mdi-file-document-check-outline
                                        </v-icon>
                                    </template>
                                    <span>Gestionar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" md="10" sm="10">
                        <v-pagination v-model="pagina" :length="totalPaginas" :total-visible="9"
                            @input="listarTeleapoyosPendientes()"></v-pagination>
                    </v-col>
                    <v-col cols="12" md="2" sm="2">
                        <v-select outlined v-model="cantidadRegistros" :items="opcionesCantidadRegistros" dense
                            @change="listarTeleapoyosPendientes()" label="Cantidad de registros">
                        </v-select>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Modal Gestion -->
        <modalGestionTelesalud :mostrar-modal-gestion.sync="mostrarModalGestion" :teleapoyo="teleapoyoSeleccionado"
            @listarTeleapoyosPendientes="listarTeleapoyosPendientes()" />
    </div>
</template>
<script>
import modalGestionTelesalud from "@/components/telesalud/modalGestionTelesalud.vue";

export default {
    components: {
        modalGestionTelesalud,
    },
    data() {
        return {
            loading: {
                tablaTelesalud: false,
                tiposSolicitud: false,
                reps: false,
            },
            registrosTelesalud: [],
            headersTelesalud: [
                {
                    text: "ID",
                    value: "id",
                    align: "center",
                },
                {
                    text: "Afiliado",
                    value: "afiliado_nombre",
                    align: "center",
                },
                {
                    text: "N° Documento",
                    value: "afiliado.numero_documento",
                    align: "center",
                },
                {
                    text: "Especialidad",
                    value: "especialidad.nombre",
                    align: "center",
                },
                {
                    text: "Tipo de Estrategia",
                    value: "tipo_estrategia",
                    align: "center",
                },
                {
                    text: "Fecha de Creación",
                    value: "created_at",
                    align: "center",
                },
                {
                    text: "Tipo de Solicitud",
                    value: "tipoSolicitud",
                    align: "center",
                },
                {
                    text: "Médico Solicitante",
                    value: "user_crea.operador.nombre_completo",
                    align: "center",
                },
                {
                    text: "Sede",
                    value: "afiliado.ips.nombre",
                    align: "center",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: "center",
                    sortable: false,
                },
            ],
            pagina: 1,
            totalPaginas: 0,
            cantidadRegistros: 10,
            opcionesCantidadRegistros: [5, 10, 25, 50, 100],
            opcionesTipoSolicitudes: [],
            filtros: {
                tipo_solicitud_id: null,
                fechaInicio: null,
                fechaFin: null,
                numeroDocumento: null,
                ips_id: null,
            },
            menu: {
                fechaInicio: false,
                fechaFin: false,
            },
            campoBusquedaRep: null,
            opcionesReps: [],
            mostrarModalGestion: false,
            teleapoyoSeleccionado: {},
        };
    },
    mounted() {
        this.listarTeleapoyosPendientes();
        this.listarTiposSolicitud();
    },
    watch: {
        campoBusquedaRep(newVal) {
            if (newVal && newVal.length === 4) {
                this.listarReps();
            }
        },
    },
    methods: {
        listarTeleapoyosPendientes() {
            this.loading.tablaTelesalud = true;
            this.$axios
                .post("/teleapoyo/teleconceptosPendientes", {
                    page: this.pagina,
                    cantidad: this.cantidadRegistros,
                    ...this.filtros,
                })
                .then((res) => {
                    this.registrosTelesalud = res.data.data;
                    this.totalPaginas = res.data.last_page;
                })
                .catch((e) => {
                    this.$toast.error(e.response.data.mensaje);
                })
                .finally(() => {
                    this.loading.tablaTelesalud = false;
                });
        },

        listarTiposSolicitud() {
            this.loading.tiposSolicitud = true;
            this.$axios
                .get("/tipo-solicitud/listarActivos")
                .then((res) => {
                    this.opcionesTipoSolicitudes = res.data.data;
                })
                .catch(() => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de solicitud"
                    );
                })
                .finally(() => {
                    this.loading.tiposSolicitud = false;
                });
        },

        abrirModalGestionar(item) {
            this.teleapoyoSeleccionado = item;
            this.mostrarModalGestion = true;
        },

        limpiarFiltros() {
            this.filtros = {
                tipo_solicitud_id: null,
                fechaInicio: null,
                fechaFin: null,
                numeroDocumento: null,
                ips_id: null,
            };

            this.listarTeleapoyosPendientes();
        },

        listarReps() {
            this.loading.reps = true;
            this.$axios
                .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.opcionesReps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.reps = false;
                });
        },

        obtenerNombreCompletoAfiliado(afiliado) {
            const a = afiliado || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        },
    },
};
</script>
