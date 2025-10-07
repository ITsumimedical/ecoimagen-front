<template>
    <div>
        <div>
            <v-card elevation="0">
                <v-container fluid>
                    <v-row dense>
                        <!-- Filtros aplicados -->
                        <v-col cols="12">
                            <v-chip-group
                                column
                                v-if="
                                    estadosSeleccionados.length > 0 ||
                                    filtro.id ||
                                    filtro.cedula ||
                                    filtro.nombre ||
                                    filtro.sede_ocurrencia ||
                                    filtro.suceso ||
                                    filtro.fecha_desde ||
                                    filtro.fecha_hasta
                                "
                            >
                                <v-chip
                                    small
                                    label
                                    v-for="(
                                        estado, index
                                    ) in estadosSeleccionados"
                                    :key="index"
                                    color="info"
                                    @click="removeFiltro(estado)"
                                >
                                    {{ estado }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="filtro.id"
                                    color="blue-grey"
                                    @click="removeFiltro('id')"
                                >
                                    <b>Radicado:</b> {{ filtro.id }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="filtro.cedula"
                                    color="blue-grey"
                                    @click="removeFiltro('cedula')"
                                >
                                    <b>Documento:</b> {{ filtro.cedula }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="filtro.nombre"
                                    color="blue-grey"
                                    @click="removeFiltro('nombre')"
                                >
                                    <b>Afiliado</b> {{ filtro.nombre }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="filtro.sede_ocurrencia"
                                    color="blue-grey"
                                    @click="removeFiltro('sede_ocurrencia')"
                                >
                                    <b>Sede ocurrencia</b>
                                    {{ filtro.sede_ocurrencia }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="filtro.suceso"
                                    color="blue-grey"
                                    @click="removeFiltro('suceso')"
                                >
                                    <b>Suceso:</b> {{ filtro.suceso }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>

                                <v-chip
                                    dark
                                    small
                                    label
                                    v-if="
                                        filtro.fecha_desde && filtro.fecha_hasta
                                    "
                                    color="grey"
                                    @click="removeFiltro('fechas')"
                                >
                                    <b>Rango fecha: </b>
                                    {{ filtro.fecha_desde }} -
                                    {{ filtro.fecha_hasta }}
                                    <v-icon right small>mdi-close</v-icon>
                                </v-chip>
                            </v-chip-group>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="2"
                            md="2"
                            class="d-flex justify-end"
                        >
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </div>
        <v-card elevation="0">
            <v-container fluid>
                <v-row dense>
                    <!-- Filtros de estado -->
                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorPendientes"
                            text
                            dense
                            icon="mdi-alert-remove-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('pendientes')"
                        >
                            <v-badge
                                color="warning"
                                :content="eventosAdversosContados[1].title"
                            >
                                Pendientes
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorAsignados"
                            text
                            dense
                            icon="mdi-hand-wave-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('asignados')"
                        >
                            <v-badge
                                color="info"
                                :content="eventosAdversosContados[2].title"
                            >
                                Asignados
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorAnulados"
                            text
                            dense
                            icon="mdi-file-document-remove-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('anulados')"
                        >
                            <v-badge
                                color="red"
                                :content="eventosAdversosContados[3].title"
                            >
                                Anulados
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorPlanMejora"
                            text
                            dense
                            icon="mdi-text-box-search-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('planMejora')"
                        >
                            <v-badge
                                color="brown"
                                :content="eventosAdversosContados[4].title"
                            >
                                Plan pendiente
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorPlanCumplido"
                            text
                            dense
                            icon="mdi-file-document-check-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('planCumplido')"
                        >
                            <v-badge
                                color="green"
                                :content="eventosAdversosContados[5].title"
                            >
                                Plan cumplido
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorAnalizados"
                            text
                            dense
                            icon="mdi-head-sync-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('analizados')"
                        >
                            <v-badge
                                color="blue-grey"
                                :content="eventosAdversosContados[6].title"
                            >
                                Analizados
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-alert
                            :color="colorCerrados"
                            text
                            dense
                            icon="mdi-check-circle-outline"
                            border="left"
                            style="cursor: pointer"
                            @click="sumarFiltro('cerrados')"
                        >
                            <v-badge
                                color="indigo"
                                :content="eventosAdversosContados[0].title"
                            >
                                Cerrados
                            </v-badge>
                        </v-alert>
                    </v-col>

                    <!-- Filtros de texto -->
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field
                            dense
                            v-model="filtro.id"
                            label="Radicado"
                            single-line
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-text-field
                            dense
                            v-model="filtro.cedula"
                            label="Documento afiliado"
                            single-line
                        >
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-text-field
                            dense
                            v-model="filtro.nombre"
                            label="Nombre afiliado"
                            single-line
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-text-field
                            dense
                            v-model="filtro.sede_ocurrencia"
                            label="Sede ocurrencia"
                            single-line
                        >
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" sm="2" md="2">
                        <v-text-field
                            dense
                            v-model="filtro.suceso"
                            label="Suceso"
                            single-line
                        ></v-text-field>
                    </v-col>

                    <!-- Filtros de fecha -->
                    <v-col cols="12" sm="2" md="2">
                        <v-dialog
                            v-model="dialogoFechas"
                            persistent
                            max-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    v-model="filtro.fecha_desde"
                                    label="Fecha registro"
                                    readonly
                                    prepend-icon="mdi-calendar"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                locale="es-co"
                                v-model="fechasSeleccionadas"
                                range
                                @input="actualizarRangoFechas"
                            ></v-date-picker>
                            <v-btn
                                small
                                color="error"
                                @click="dialogoFechas = false"
                                >Cerrar sin guardar</v-btn
                            >
                        </v-dialog>
                    </v-col>

                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="2" md="2" class="d-flex justify-end">
                        <v-btn
                            color="error"
                            @click="borrarTodosFiltros()"
                            small
                        >
                            Limpiar filtros
                            <v-icon right>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn color="info" @click="aplicarFiltros()" small
                            >Aplicar filtros<v-icon right
                                >mdi-filter-cog
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider class="full-page-divider"></v-divider>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "WorkspaceJsonFiltroEstadoEventoComponente",

    data() {
        return {
            filtro: {
                id: "",
                cedula: "",
                nombre: "",
                sede_ocurrencia: "",
                suceso: "",
                fecha_desde: "",
                fecha_hasta: "",
            },
            fechasSeleccionadas: [],
            dialogoFechas: false,
            estadosSeleccionados: [],
            pagina: 1,
            total: 0,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            colorPendientes: "",
            colorAsignados: "",
            colorAnulados: "",
            colorPlanMejora: "",
            colorPlanCumplido: "",
            colorAnalizados: "",
            colorCerrados: "",
            mapaColores: {
                10: "warning",
                6: "info",
                5: "red",
                38: "brown",
                39: "green",
                16: "blue-grey",
                17: "indigo",
            },
            eventosAdversos: [],
            estadoFiltro: "",
            eventosAdversosContados: [
                {
                    color: "indigo",
                    icon: "mdi-alert-circle-check-outline",
                    title: "0",
                    subTitle: "Cerrados",
                },
                {
                    color: "#FF9800",
                    icon: "mdi-alert-outline",
                    title: "0",
                    subTitle: "Pendientes asignación",
                },
                {
                    color: "#0288D1",
                    icon: "mdi-human-greeting",
                    title: "0",
                    subTitle: "Asignados Reasignados",
                },
                {
                    color: "#E53935",
                    icon: "mdi-close-circle-outline",
                    title: "0",
                    subTitle: "Anulados",
                },
                {
                    color: "#E53935",
                    icon: "mdi-close-circle-outline",
                    title: "0",
                    subTitle: "Seguimiento plan de mejora",
                },
                {
                    color: "#E53935",
                    icon: "mdi-close-circle-outline",
                    title: "0",
                    subTitle: "Plan mejora cumplido",
                },
                {
                    color: "#E53935",
                    icon: "mdi-close-circle-outline",
                    title: "0",
                    subTitle: "Analizado",
                },
            ],
        };
    },

    mounted() {
        this.consultar();
        this.aplicarFiltros();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

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
            } else if (filtro === "id") {
                this.filtro.id = "";
            } else if (filtro === "cedula") {
                this.filtro.cedula = "";
            } else if (filtro === "nombre") {
                this.filtro.nombre = "";
            } else if (filtro === "sede_ocurrencia") {
                this.filtro.sede_ocurrencia = "";
            } else if (filtro === "suceso") {
                this.filtro.suceso = "";
            } else {
                const index = this.estadosSeleccionados.indexOf(filtro);
                if (index !== -1) {
                    this.estadosSeleccionados.splice(index, 1);
                }
            }
        },
        borrarTodosFiltros() {
            this.estadosSeleccionados = [];
            this.filtro = {
                id: "",
                cedula: "",
                nombre: "",
                sede_ocurrencia: "",
                suceso: "",
                fecha_desde: "",
                fecha_hasta: "",
            };
            this.aplicarFiltros();
        },

        listarEventosfecha() {
            this.setPreload(true);
            this.$axios
                .post("/eventos-adversos/listarEventosFecha/", this.filtro)
                .then((res) => {
                    this.eventosAdversos = res.data;
                    this.$emit("getData", this.eventosAdversos);
                })
                .catch((e) => {
                    console.log(e.response.data);
                }).finally(() => {
					this.setPreload(false);
				})
        },

        listarEventos() {
            this.setPreload(true);
            this.$axios
                .post(
                    "/eventos-adversos/listar?page=" +
                        this.pagina +
                        "&cant=" +
                        this.opcionActual,
                    this.filtro
                )
                .then((res) => {
                    this.eventosAdversos = res.data.data.data;
                    this.total = res.data.data.last_page;
                    this.$emit("getData", this.eventosAdversos);
                })
                .catch((e) => {
                    console.log(e.response.data);
                }).finally(() => {
					this.setPreload(false);
				})
        },

        consultar() {
            this.$axios
                .get("eventos-adversos/contadores-eventos")
                .then((res) => {
                    this.eventosAdversosContados[0].title = `${res.data[0]}`;
                    this.eventosAdversosContados[1].title = `${res.data[1]}`;
                    this.eventosAdversosContados[2].title = `${res.data[2]}`;
                    this.eventosAdversosContados[3].title = `${res.data[3]}`;
                    this.eventosAdversosContados[4].title = `${res.data[4]}`;
                    this.eventosAdversosContados[5].title = `${res.data[5]}`;
                    this.eventosAdversosContados[6].title = `${res.data[6]}`;
                });
        },

        coloresDefecto() {
            this.colorPendientes = "grey";
            this.colorAsignados = "grey";
            this.colorAnulados = "grey";
            this.colorPlanMejora = "grey";
            this.colorPlanCumplido = "grey";
            this.colorAnalizados = "grey";
            this.colorCerrados = "grey";
        },

        sumarFiltro(estado) {
            if (this.estadosSeleccionados.includes(estado)) {
                this.estadosSeleccionados = this.estadosSeleccionados.filter(
                    (item) => item !== estado
                );
            } else {
                this.estadosSeleccionados.push(estado);
            }
        },

        aplicarFiltros() {
            const filtros = {
                ...this.filtro,
                estados: this.estadosSeleccionados,
                page: this.page,
                per_page: this.opciones,
            };

			this.setPreload(true);

            this.$axios
                .post("/eventos-adversos/listar", filtros)
                .then((response) => {
                    const eventos = response;

                    this.eventosAdversos = eventos.data;
                    this.last_page = response.data.last_page;

                    this.$emit("getData", {
                        eventosAdversos: this.eventosAdversos,
                        last_page: this.last_page,
                        total: this.total,
                        per_page: this.opciones,
                    });
                })
                .catch((error) => {
                    console.error("Error al aplicar filtros", error);
                }).finally(() => {
					this.setPreload(false);
				})
        },
    },
};
</script>

