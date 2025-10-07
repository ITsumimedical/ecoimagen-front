<template>
    <v-app>
        <v-card-actions>
            <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-btn color="success" small @click="abrirModalCrear()">
                    Nueva Área
                    <v-icon right>mdi-plus-circle</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card-actions>

        <v-data-table
            :headers="headers"
            :items="areas"
            dense
            :search="buscar"
            :items-per-page="opcionActual"
            :loading="cargando"
        >
            <template v-slot:[`item.estado`]="{ item }">
                <v-chip small :color="GetColor(item.estado)" dark>
                    {{ item.estado == 1 ? "Activo" : "Inactivo" }}
                </v-chip>
            </template>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-row>
                        <v-col md="3" lg="5" xl="5" sm="3" cols>
                            <v-text-field
                                dense
                                v-model="buscar"
                                outlined
                                label="Buscar área"
                                single-line
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn
                                color="red"
                                small
                                dark
                                @click="limpiarFiltros()"
                                >Limpiar</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            color="warning"
                            class="mr-2"
                            @click="abrirModalEditar(item)"
                        >
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            color="primary"
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="
                                item.estado == 1
                                    ? cambiarEstado(item)
                                    : cambiarEstado(item)
                            "
                        >
                            mdi-list-status
                        </v-icon>
                    </template>
                    <span>{{
                        item.estado == 1 ? "Inactivar" : "Activar"
                    }}</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            color="success"
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="asignarUsuario(item)"
                        >
                            mdi-shield-key
                        </v-icon>
                    </template>
                    <span>Asignar Usuario</span>
                </v-tooltip>
            </template>
        </v-data-table>

        <!-- Modal Crear/Editar Área -->
        <v-dialog v-model="modalArea" persistent max-width="500px">
            <ModalAreaComponent
                :area="areaSeleccionada"
                @cerrar="modalArea = false"
                @actualizar="listarAreas"
            />
        </v-dialog>

        <v-dialog v-model="modalAsignarUsuario" max-width="1200px">
            <modalAsignacionUsuario
                :area="areaSeleccionada"
                ref="modalAsignacionUsuario"
                @cerrar="modalAsignarUsuario = false"
            />
        </v-dialog>
    </v-app>
</template>

<script>
import ModalAreaComponent from "./modales/areas/modalCrearAreaComponent.vue";
import modalAsignacionUsuario from "./modales/areas/modalAsignacionUsuario.vue";
import { mapActions } from "vuex";

export default {
    components: {
        ModalAreaComponent,
        modalAsignacionUsuario,
    },

    data() {
        return {
            buscar: "",
            modalActualizarArea: false,
            modalCrearArea: false,
            areaSeleccionada: null,
            modalAsignarUsuario: false,
            titulo: "Nueva Área",
            pagina: 1,
            opcionActual: 10,
            opciones: [10, 20, 30],
            total: 5,
            cargando: false,
            formArea: { id: null, nombre: "" },
            errors: {},
            areas: [],
            modalArea: false,
            areaSeleccionada: null,
            headers: [
                { text: "ID", value: "id", align: "center", sortable: false },
                {
                    text: "Nombre",
                    value: "nombre",
                    aling: "center",
                    sortable: false,
                },
                {
                    text: "Estado",
                    value: "estado",
                    aling: "center",
                    sortable: false,
                },
                {
                    text: "Acciones",
                    value: "actions",
                    align: "center",
                    sortable: false,
                },
            ],
            estado: [
                { text: "Activo", value: "1" },
                { text: "Inactivo", value: "0" },
            ],
        };
    },

    mounted() {
        this.listarAreas();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listarAreas() {
            this.setPreload(true);
            this.$axios
                .get("/areas-proveedores/listar-areas")
                .then((res) => {
                    this.areas = res.data;
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarFiltros() {
            this.buscar = "";
            this.listarAreas();
        },

        abrirModalCrear() {
            this.areaSeleccionada = null;
            this.modalArea = true;
        },

        abrirModalEditar(area) {
            this.areaSeleccionada = { ...area };
            this.modalArea = true;
        },

        GetColor(estado) {
            return Number(estado) ? "green" : "red";
        },

        asignarUsuario(item) {
            this.areaSeleccionada = item;
            this.modalAsignarUsuario = true;
            this.$nextTick(() => {
                this.$refs.modalAsignacionUsuario.cargarOperadores();
            });
        },

        cambiarEstado(item) {
            this.$swal({
                title: "¿Está Seguro?",
                text: "Esta opción modifica el estado del área " + item.id,
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .post("/areas-proveedores/cambiar-estado/" + item.id)
                        .then((res) => {
                            this.$toast.success(
                                "Se ha modificado el area exitosamente!."
                            );
                            this.listarAreas();
                        })
                        .finally(() => {
                            this.listarServiciosReps();
                        });
                }
            });
        },
    },
};
</script>
