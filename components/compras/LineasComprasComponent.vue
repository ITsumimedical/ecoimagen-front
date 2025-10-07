<template>
    <v-app>
        <v-card-actions>
            <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-btn color="success" small @click="abrirModalCrear()">
                    Nueva Línea
                    <v-icon right>mdi-plus-circle</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card-actions>

        <v-data-table
            :headers="headers"
            :items="lineas"
            dense
            :search="buscar"
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
                                label="Buscar Línea"
                                single-line
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn color="red" small dark @click="limpiarFiltros()">
                                Limpiar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small color="warning" class="mr-2" @click="abrirModalEditar(item)">
                    mdi-pencil
                </v-icon>
                <v-icon color="primary" class="mr-2" @click="cambiarEstado(item)">
                    mdi-list-status
                </v-icon>
            </template>
        </v-data-table>

        <!-- Modal de Crear/Editar Línea -->
        <v-dialog v-model="modalLinea" persistent max-width="500px">
            <ModalLineaComponent
                :linea="lineaSeleccionada"
                @cerrar="modalLinea = false"
                @actualizar="listarLineas"
            />
        </v-dialog>

        <v-dialog v-model="modalAsignarUsuario" persistent max-width="1200px">
            <modalAsignarUsuario
                :area="areaSeleccionada"
                @cerrar="modalAsignarUsuario = false"
            />
        </v-dialog>
    </v-app>
</template>

<script>
import ModalLineaComponent from "./modales/lineas/modalCrearLineaComponent.vue";
import modalAsignarUsuario from "./modales/areas/modalAsignacionUsuario.vue"
import { mapActions } from "vuex";

export default {
    components: {
        ModalLineaComponent,
        modalAsignarUsuario
    },

    data() {
        return {
            buscar: "",
            modalLinea: false,
            lineaSeleccionada: null,
            modalAsignarUsuario: false,
            cargando: false,
            areaSeleccionada: null,
            lineas: [],
            headers: [
                { text: "ID", value: "id", align: "center", sortable: false },
                { text: "Nombre", value: "nombre", align: "center", sortable: false },
                { text: "Estado", value: "estado", align: "center", sortable: false },
                { text: "Acciones", value: "actions", align: "center", sortable: false },
            ],
        };
    },

    mounted() {
        this.listarLineas();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listarLineas() {
            this.setPreload(true);
            this.$axios
                .get("/lineas-compras/listar-lineas")
                .then((response) => {
                    this.lineas = response.data;
                })
                .catch(() => {
                    this.$toast.error("Error al cargar las líneas");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarFiltros() {
            this.buscar = "";
            this.listarLineas();
        },

        abrirModalCrear() {
            this.lineaSeleccionada = { id: null, nombre: "" };
            this.modalLinea = true;
        },

        abrirModalEditar(linea) {
            this.lineaSeleccionada = { ...linea };
            this.modalLinea = true;
        },

        GetColor(estado) {
            return Number(estado) ? "green" : "red";
        },

        asignarUsuario(item) {
            this.areaSeleccionada = item;
            this.modalAsignarUsuario = true;
        },

        cambiarEstado(linea) {
            this.$swal({
                title: "¿Está seguro?",
                text: `Esta opción modificará el estado de la línea ${linea.id}`,
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .post(`/lineas-compras/cambiar-estado/${linea.id}`)
                        .then(() => {
                            this.$toast.success("Estado modificado correctamente");
                            this.listarLineas();
                        })
                        .catch(() => {
                            this.$toast.error("Error al cambiar el estado");
                        });
                }
            });
        },
    },
};
</script>
