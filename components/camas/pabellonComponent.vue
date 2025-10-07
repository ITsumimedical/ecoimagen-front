<template>

    <v-card class="rounded-xl">

        <v-card-title>
            <v-toolbar flat>
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
            <v-data-table :headers="headersPabellon" :search="campoBusqueda" :items="pabellones" :loading="loading"
                no-data-text="No hay pabellones para mostrar" dense>

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
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon :color="item.estado == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                                @click="cambiarEstado(item)">{{
                                item.estado == true ? "mdi-toggle-switch-off": "mdi-toggle-switch"}}
                            </v-icon>
                        </template>

                        <span>Cambiar Estado</span>
                    </v-tooltip>
                </template>
                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="getColor(item.estado)" dark>
                        {{ item.estado === true ? "Activo" : "Inactivo" }}
                    </v-chip>
                </template>

            </v-data-table>
        </v-card-text>

        <!-- Modal Crear/Editar -->
        <v-dialog v-model="dialogCrearEditar" persistent max-width="600px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                    <b>{{ editMode ? "Editar" : "Crear" }} Pabellón</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="pabellon">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field dense v-model="pabellon.nombre" label="Nombre" :rules="rules.nombre">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="cancelarCrearEditar()">Cerrar</v-btn>
                    <v-btn color="success" dark @click="guardarPabellon()">
                        {{ editMode ? "Guardar Cambios" : "Crear" }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>

</template>

<script>
    import {
        mapActions
    } from "vuex"
    export default {
        // middleware({ $can, redirect }) {
        //     if (!$can("cargos.vista")) {
        //         return redirect("/");
        //     }
        // },
        props: {
            ejecutar: {
                type: Boolean,
                default: false,
            },
        },
        name: "pabellon",
        data() {
            return {
                preload: false,
                loading: false,
                pabellones: [],
                headersPabellon: [{
                        text: "",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Pabellón",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Estado",
                        value: "estado",
                        align: "center"
                    },
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
                pabellon: {
                    nombre: "",
                },
                rules: {
                    nombre: [(v) => !!v || "El campo nombre es requerido"],
                },
            };
        },

        watch: {
            ejecutar: {
                handler(valor) {
                    if (valor) {
                        this.listarPabellon()
                    }
                },
                immediate: true

            }
        },
        mounted() {
            // this.listarPabellon();
        },
        methods: {
            ...mapActions('app', ['setPreload']),

            async listarPabellon() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.post(`/pabellon/listar`)
                    this.pabellones = response.data;
                } catch (error) {
                    console.log(error)
                } finally {
                    this.setPreload(false)
                }
            },

            abrirModalCrear() {
                this.dialogCrearEditar = true;
                this.editMode = false;
                this.pabellon = {
                    nombre: ""
                };
            },

            abrirModalEditar(item) {
                this.dialogCrearEditar = true;
                this.editMode = true;
                this.pabellon = {
                    ...item
                };
            },

            cancelarCrearEditar() {
                this.dialogCrearEditar = false;
                this.pabellon = {
                    nombre: "",
                    funciones: "",
                };
            },

            guardarPabellon() {

                if (!this.pabellon.nombre) {
                    return this.$toast.error("Todos los campos son obligatorios");
                }

                if (this.editMode) {
                    if (!this.$refs.pabellon.validate()) {
                        return
                    }
                    this.setPreload(true)
                    this.$axios
                        .put(`/pabellon/${this.pabellon.id}`, this.pabellon)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se actualizó el pabellon correctamente");
                            this.listarPabellon();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al actualizar el pabellon");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                } else {
                    if (!this.$refs.pabellon.validate()) {
                        return
                    }
                    this.setPreload(true)
                    this.$axios
                        .post(`/pabellon/crear`, this.pabellon)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se creó el pabellón correctamente");
                            this.listarPabellon();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al crear el pabellón");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                }
            },

            getColor(estado) {
                return estado == true ? "green" : "red";
            },

            cambiarEstado(item) {
                this.preload = true;
                this.$swal({
                    title: "Está seguro?",
                    text: "Desea cambiar el estado",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",

                }).then((result) => {
                    if (result.value) {
                        this.$axios
                            .put(`/pabellon/cambiarEstado/${item.id}`, {
                                'estado': item.estado == true ? false : true,
                            })
                            .then(() => {
                                this.$toast.success("Cambio de estado exitoso");
                                this.listarPabellon();
                            })
                            .catch((error) => {
                                this.$toast.error("Ocurrió un error al cambiar el estado");
                                console.log(error);
                            })
                            .finally(() => {
                                this.preload = false;
                            });
                    }
                });
            },
        },
    };

</script>
