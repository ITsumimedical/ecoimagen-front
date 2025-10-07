<template>
    <div>

        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <v-card>
            <div>
                <v-card-title>
                    <v-row dense>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="10" md="10">
                            <v-text-field dense v-model="buscar" append-icon="mdi-magnify" label="Buscar" single-line
                                hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                            <v-spacer></v-spacer>
                            <v-btn color="success" class="white--text ma-2 px-6" small
                                @click="crearZona()"  v-if="$can('contrato.zona.crear')">Crear<v-icon>mdi-plus
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
            </div>

            <v-data-table :search="buscar" :headers="headersZonas" :items="zonas" :loading="loading.zonas"
                :zonas="zonas" loading-text="cargando..." class="elevation-1 mt-4"
                no-data-text="Sin datos para mostrar">

                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="getColor(item.estado)" dark>
                        {{ item.estado == "1" ? "Activo" : "Inactivo" }}
                    </v-chip>
                </template>


                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                @click="editarZona(item)"  v-if="$can('contrato.zona.editar')">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small :color="item.estado == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                                @click="cambiarEstado(item)"  v-if="$can('contrato.zona.editar')">{{
                                    item.estado == true
                                        ? "mdi-toggle-switch-off"
                                        : "mdi-toggle-switch"
                                }}
                            </v-icon>
                        </template>

                        <span>Cambiar Estado</span>
                    </v-tooltip>
                </template>
            </v-data-table>

        </v-card>


        <v-dialog persistent v-model="crearModal" max-width="700px">
            <CrearEstadoComponent @cerrar="cerrarModal" @recargarZonas="listarZonas" />
        </v-dialog>

        <v-dialog v-model="editarModal" persistent max-width="800px">
            <EditarZonaComponent @cerrar="cerrarModal" :zonaSeleccionada="zonaSeleccionada" @recargarDatos="listarZonas" />
        </v-dialog>


    </div>
</template>

<script>
import CrearZonaComponent from './CrearZonaComponent.vue';
import EditarZonaComponent from './EditarZonaComponent.vue';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("contrato.zona.listar")) {
            return redirect("/");
        }
    },
    components: {
        CrearEstadoComponent: CrearZonaComponent,
        EditarZonaComponent: EditarZonaComponent
    },

    data() {
        return {
            loading: {
                zonas: false,
            },
            zonaSeleccionada: {},
            preload: false,
            zonas: [],
            buscar: "",
            headersZonas: [
                {
                    text: "Id",
                    value: "id",
                    align: "center",
                },
                {
                    text: "Nombre",
                    value: "nombre",
                    align: "center",
                },
                {
                    text: "Estado",
                    value: "estado",
                    align: "center",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: "center",
                    sortable: false,
                },
            ],

            crearModal: false,
            editarModal: false,

        }
    },


    mounted() {
        this.listarZonas()
    },

    methods: {
        async listarZonas() {
            try {
                this.preload = true;
                this.loading.zonas = true;
                const response = await this.$axios.get('/zonas/listar');
                this.zonas = response.data;
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al listar las Zonas");
            } finally {
                this.loading.zonas = false;
                this.preload = false;
            }
        },

        crearZona() {
            this.crearModal = true;
        },

        editarZona(item) {
            this.editarModal = true;
            this.zonaSeleccionada = {...item};
        },

        cerrarModal() {
            this.crearModal = false;
            this.editarModal = false;
        },

        getColor(estado) {
            return estado == 1 ? "green" : "red";
        },

        async cambiar() {
            try {
                this.preload = true;
                this.loading.zonas = true;
                const response = await this.$axios.get('/zonas/listar');
                this.zonas = response.data;
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al listar las Zonas");
            } finally {
                this.loading.zonas = false;
                this.preload = false;
            }
        },


        cambiarEstado(item) {
            this.preload = true;
            this.$swal({
                title: "Está seguro?",
                text: "Desea cambiar el estado de la Zona",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .put(`/zonas/cambiarEstado/${item.id}`)
                        .then(() => {
                            this.$toast.success("Cambio de estado exitoso");
                            this.listarZonas();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al cambiar el estado de la zona");
                            console.log(error);
                        })
                        .finally(() => {
                            this.preload = false;
                        });
                }
            });
        },

    },




}
</script>
