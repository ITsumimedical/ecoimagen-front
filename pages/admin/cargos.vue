<template>

    <v-card class="rounded-xl">

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Cargos</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="success" small class="mb-2 white--text" @click="abrirModalCrear()">
                    Crear
                    <v-icon dark right>
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <v-data-table :headers="headersCargos" :search="campoBusqueda" :items="cargos" :loading="loading"
                no-data-text="No hay cargos para mostrar" dense>

                <template v-slot:top>
                    <v-row class="mx-2">
                        <v-col md="5" lg="5" xl="5" sm="6" cols>
                            <v-text-field dense v-model="campoBusqueda" label="Buscar ...">
                            </v-text-field>
                        </v-col>
                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark>
                                <v-btn small class="ml-2" color="error" @click="campoBusqueda = ''">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top v-if="$can('cargo.actualizar')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                @click="abrirModalEditar(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                </template>

            </v-data-table>
        </v-card-text>

        <!-- Modal Crear/Editar Cargo -->
        <v-dialog v-model="dialogCrearEditar" persistent max-width="800px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                    <b>{{ editMode ? "Editar" : "Crear" }} Cargo</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense v-model="cargoActual.nombre" label="Nombre"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea auto-grow dense label="Funciones" v-model="cargoActual.funciones"></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="cancelarCrearEditar()">Cerrar</v-btn>
                    <v-btn color="success" dark @click="guardarCargo()">
                        {{ editMode ? "Guardar Cambios" : "Crear" }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>

</template>

<script>
import { mapActions } from "vuex"
export default {
    middleware({ $can, redirect }) {
        if (!$can("cargos.vista")) {
            return redirect("/");
        }
    },
    name: "AdminCargos",
    data() {
        return {
            preload: false,
            loading: false,
            cargos: [],
            headersCargos: [
                { text: "", value: "id", align: "center" },
                { text: "Cargo", value: "nombre", align: "center" },
                { text: "Funciones", value: "funciones" },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: "center",
                    sortable: false,
                },
            ],
            pagina: 1,
            cantidad: 5,
            campoBusqueda: "",
            totalPages: 0,
            dialogCrearEditar: false,
            editMode: false,
            cargoActual: {
                nombre: "",
                funciones: "",
            },
        };
    },
    mounted() {
        this.listarCargos();
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarCargos() {
            try {
                this.setPreload(true)
                const response = await this.$axios.get(`/cargo/listarTodos`)
                this.cargos = response.data;
            } catch (error) {
                console.log(error)
            } finally {
                this.setPreload(false)
            }
        },

        abrirModalCrear() {
            this.dialogCrearEditar = true;
            this.editMode = false;
            this.cargoActual = {
                nombre: "",
                funciones: "",
            };
        },

        abrirModalEditar(item) {
            this.dialogCrearEditar = true;
            this.editMode = true;
            this.cargoActual = { ...item };
        },

        cancelarCrearEditar() {
            this.dialogCrearEditar = false;
            this.cargoActual = {
                nombre: "",
                funciones: "",
            };
        },

        guardarCargo() {

            if (!this.cargoActual.nombre || !this.cargoActual.funciones) {
                return this.$toast.error("Todos los campos son obligatorios");
            }

            this.preload = true;
            if (this.editMode) {
                this.$axios
                    .put(`/cargo/${this.cargoActual.id}`, this.cargoActual)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se actualizó el cargo correctamente");
                        this.listarCargos();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al actualizar el cargo");
                        console.log(error);
                    })
                    .finally(() => {
                        this.preload = false;
                    });
            } else {
                this.$axios
                    .post(`/cargo/crear`, this.cargoActual)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se creó el cargo correctamente");
                        this.listarCargos();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al crear el cargo");
                        console.log(error);
                    })
                    .finally(() => {
                        this.preload = false;
                    });
            }
        },
    },
};
</script>
