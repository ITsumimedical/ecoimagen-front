<template>
    <div>
        <!-- Header -->
        <v-card class="mb-4" elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span class="ml-3 subtitle-1 font-weight-medium" style="font-size: 1.5rem;">
                                Panel central de mesa de ayuda para la unificación de servicios y solicitudes
                            </span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
        </v-card>

        <!-- Sección clientes -->
        <v-container fluid>
            <v-row class="justify-center" dense>
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card :elevation="nombreCliente === 'Medicina Integral' ? 12 : 2"
                        :color="nombreCliente === 'Medicina Integral' ? 'white' : '#ECEFF1'"
                        class="pa-4 d-flex flex-row align-center hoverable"
                        style="width: 100%; border-radius: 12px; cursor: pointer;"
                        @click="seleccionarCliente({ id: 2, nombre: 'Medicina Integral' })">
                        <v-icon color="#0288D1" size="40">mdi-hospital-box</v-icon>
                        <div class="d-flex flex-column justify-center align-start ml-4" style="width: 100%;">
                            <div class="d-flex align-center justify-space-between" style="width: 100%;">
                                <div class="text-h6 font-weight-bold">Medicina Integral</div>
                                <v-badge v-if="nombreCliente === 'Medicina Integral'" :content="contarPendientes"
                                    color="green"
                                    style="min-width: 36px; height: 36px; line-height: 36px; border-radius: 50%;"></v-badge>
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card :elevation="nombreCliente === 'Fomag' ? 12 : 2"
                        :color="nombreCliente === 'Fomag' ? 'white' : '#B0BEC5'"
                        class="pa-4 d-flex flex-row align-center hoverable"
                        style="width: 100%; border-radius: 12px; cursor: pointer;"
                        @click="seleccionarCliente({ id: 1, nombre: 'Fomag' })">
                        <v-icon color="#0288D1" size="40">mdi-medical-bag</v-icon>
                        <div class="d-flex flex-column justify-center align-start ml-4" style="width: 100%;">
                            <div class="d-flex align-center justify-space-between" style="width: 100%;">
                                <div class="text-h6 font-weight-bold">Fomag</div>
                                <v-badge v-if="nombreCliente === 'Fomag'" :content="contarPendientes" color="green"
                                    style="min-width: 36px; height: 36px; line-height: 36px; border-radius: 50%;"></v-badge>
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card :elevation="nombreCliente === 'Sumimedical' ? 12 : 2"
                        :color="nombreCliente === 'Sumimedical' ? 'white' : '#B0BEC5'"
                        class="pa-4 d-flex flex-row align-center hoverable"
                        style="width: 100%; border-radius: 12px; cursor: pointer;"
                        @click="seleccionarCliente({ id: 3, nombre: 'Sumimedical' })">
                        <v-icon color="#0288D1" size="40">mdi-stethoscope</v-icon>
                        <div class="d-flex flex-column justify-center align-start ml-4" style="width: 100%;">
                            <div class="d-flex align-center justify-space-between" style="width: 100%;">
                                <div class="text-h6 font-weight-bold">Sumimedical</div>
                                <v-badge v-if="nombreCliente === 'Sumimedical'" :content="contarPendientes"
                                    color="green"
                                    style="min-width: 36px; height: 36px; line-height: 36px; border-radius: 50%;"></v-badge>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Filtros -->
        <v-container fluid v-if="idClienteSeleccionado">
            <v-card class="pa-3 mb-4" outlined>
                <v-row dense align="center">
                    <v-col cols="12" sm="4" md="3">
                        <v-select v-model="estadoSeleccionado" :items="estadosDisponibles" label="Estado" outlined dense
                            hide-details prepend-inner-icon="mdi-filter-variant" @change="consultarPendientes" />
                    </v-col>

                    <v-col cols="12" sm="4" md="3" class="d-flex">
                        <v-btn dark color="red darken-1" @click="limpiarFiltros">
                            LIMPIAR
                            <v-icon right small>mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>

        <v-divider class="my-4"></v-divider>

        <!-- Tabla -->
        <v-card>
            <v-card-title>
                Listado de solicitudes pendientes
                {{ nombreCliente ? ' - ' + nombreCliente : '' }} ({{ contarPendientes }})
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details
                    @input="consultarPendientes"></v-text-field>
            </v-card-title>

            <v-data-table :headers="headersActivos" :items="pendientesActivos" hide-default-footer
                :items-per-page="opcionActual">
                <template v-slot:item.categoria_mesa_ayuda="{ item }">
                    {{ item.categoria_mesa_ayuda?.nombre }}
                </template>

                <template v-slot:item.estado="{ item }">
                    <v-chip :color="getEstadoColor(item.estado?.nombre || item.nombreEstado)" text-color="white" small>
                        {{ item.estado?.nombre || item.nombreEstado }}
                    </v-chip>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-btn icon small color="blue" @click="abrirModal(item)">
                        <v-icon>mdi-file-eye</v-icon>
                    </v-btn>
                </template>

                <template v-slot:item.created_at="{ item }">
                    {{ new Date(item.created_at).toLocaleDateString() }}
                </template>

                <template v-slot:item.prioridad="{ item }">
                    <v-chip :color="item.categoria_mesa_ayuda?.prioridad?.nombre === 'ALTA'
                        ? 'red'
                        : item.categoria_mesa_ayuda?.prioridad?.nombre === 'MEDIA'
                            ? 'blue'
                            : item.categoria_mesa_ayuda?.prioridad?.nombre === 'BAJA'
                                ? 'yellow darken-2'
                                : 'grey'
                        " text-color="white" small class="font-weight-bold">
                        {{ item.categoria_mesa_ayuda?.prioridad?.nombre }}
                    </v-chip>
                </template>
            </v-data-table>

            <v-row no-gutters style="background-color: white;">
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="consultarPendientes"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small
                        @change="consultarPendientes"></v-select>
                </v-col>
            </v-row>
        </v-card>

        <!-- Modales -->
        <v-dialog v-model="modalSumimedical" max-width="900px" persistent>
            <gestion-sumimedical :solicitudSeleccionada="solicitudSeleccionada" @close="cerrarModal()" />
        </v-dialog>

        <v-dialog v-model="modalFomag" max-width="900px" persistent>
            <GestionFomag :solicitudSeleccionada="solicitudSeleccionada" @close="cerrarModal()" />
        </v-dialog>

        <v-dialog v-model="modalMedicinaIntegral" max-width="900px" persistent>
            <GestionMedicinaIntegral :solicitudSeleccionada="solicitudSeleccionada" @close="cerrarModal()" />
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import GestionFomag from "~/components/centralMesaAyuda/gestionFomag.vue";
import GestionMedicinaIntegral from "~/components/centralMesaAyuda/gestionMedicinaIntegral.vue";
import gestionSumimedical from "~/components/centralMesaAyuda/gestionSumimedical.vue";

export default {
    components: { gestionSumimedical, GestionFomag, GestionMedicinaIntegral },
    name: "CentralMesaAyuda",
    data() {
        return {
            modalSumimedical: false,
            modalFomag: false,
            modalMedicinaIntegral: false,
            solicitudSeleccionada: {},
            nombreCliente: null,
            pendientesActivos: [],
            contarPendientes: 0,
            idClienteSeleccionado: null,
            pagina: 1,
            total: 0,
            opcionActual: 5,
            search: "",
            headersActivos: [],
            pendientes: null,
            estadosDisponibles: [],
            opciones: [5, 10, 15, 20],
            estadoSeleccionado: null,
            headersClientes: {
                sumimedical: [
                    { text: "ID", value: "id" },
                    { text: "Nombre del Operador", value: "nombreoperador" },
                    { text: "Sede", value: "sedeNombre" },
                    { text: "Area", value: "area" },
                    { text: "Categoria", value: "nombreCategoria" },
                    { text: "Asunto", value: "asunto" },
                    { text: "Email", value: "email" },
                    { text: "Estado", value: "estado" },
                    { text: "Fecha Creacion", value: "fechacreacion" },
                    { text: "Acciones", value: "acciones" },
                ],
                fomag: [
                    { text: "ID", value: "id" },
                    { text: "Asunto", value: "asunto" },
                    { text: "Categoria Mesa Ayuda", value: "categoria_mesa_ayuda" },
                    { text: "Plataforma", value: "plataforma" },
                    { text: "Descripcion", value: "descripcion" },
                    { text: "Prioridad", value: "prioridad" },
                    { text: "Estado", value: "estado" },
                    { text: "Fecha de creacion", value: "created_at" },
                    { text: "Acciones", value: "acciones" },
                ],
                medicina_integral: [
                    { text: "ID", value: "id" },
                    { text: "Nombre Del Operador", value: "nombreoperador" },
                    { text: "Area", value: "area" },
                    { text: "Asunto", value: "asunto" },
                    { text: "Sede", value: "sedeNombre" },
                    { text: "Categoria", value: "categoria_mesa_ayuda" },
                    { text: " Descripcion", value: "descripcion" },
                    { text: "Email", value: "email" },
                    { text: "Contacto", value: "contacto" },
                    { text: "Estado", value: "estado" },
                    { text: "Fecha de Creacion", value: "fechacreacion" },
                    { text: "Acciones", value: "acciones" },
                ],
            },
        };
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        abrirModal(item) {
            this.solicitudSeleccionada = item;
            const cliente = this.nombreCliente?.toLowerCase();
            if (cliente === "sumimedical") this.modalSumimedical = true;
            else if (cliente === "fomag") this.modalFomag = true;
            else if (cliente === "medicina integral") this.modalMedicinaIntegral = true;
        },

        getEstadoColor(estado) {
            switch (estado) {
                case "Reasignada":
                    return "blue";
                case "Asignado":
                    return "orange";
                case "En seguimiento":
                    return "green";
                case "En Gestión":
                    return "blue";
                case "Pendiente":
                    return "orange";
                default:
                    return "grey";
            }
        },

        limpiarFiltros() {
            this.estadoSeleccionado = null;
            this.search = "";
            this.pagina = 1;
            this.consultarPendientes();
        },

        cerrarModal() {
            this.modalFomag = false;
            this.modalSumimedical = false;
            this.modalMedicinaIntegral = false;
            this.consultarPendientes();
        },

        seleccionarCliente(cliente) {
            this.idClienteSeleccionado = cliente.id;
            this.nombreCliente = cliente.nombre;
            const entidad =
                cliente.nombre.toLowerCase() === "fomag" ? "fomag" : cliente.nombre.toLowerCase() === "sumimedical" ? "sumimedical" : "medicinaintegral";

            this.pendientes = `/interoperabilidad-mesa-ayuda/listar/${entidad}`;
            const clave = this.nombreCliente.toLowerCase().replace(/\s+/g, "_");
            this.headersActivos = this.headersClientes[clave] || [];

            if (this.nombreCliente.toLowerCase() === "fomag") this.estadosDisponibles = ["Pendiente", "En Gestión"];
            else if (this.nombreCliente.toLowerCase() === "sumimedical")
                this.estadosDisponibles = ["Asignado", "En seguimiento", "Reasignada", "Cerrado"];
            else this.estadosDisponibles = ["Asignado", "En seguimiento", "Reasignada"];

            this.estadoSeleccionado = null;
            this.pagina = 1;
            this.consultarPendientes();
        },

        consultarPendientes() {
            if (!this.pendientes) return;
            this.setPreload(true);
            // Ajustamos los nombres de los parámetros al backend
            const params = {
                page: this.pagina,
                cantidad: this.opcionActual,
                ...(this.estadoSeleccionado && { estado_filtro: this.estadoSeleccionado }),
                ...(this.search && { radicado_filtro: this.search }),
            };

            this.$axios
                .get(this.pendientes, { params })
                .then((res) => {
                    // Los datos de la tabla
                    this.pendientesActivos = res.data.data;
                    this.total = res.data.last_page;
                    this.contarPendientes = res.data.total;
                })
                .finally(() => this.setPreload(false));
        }

    },
};
</script>

<style></style>
