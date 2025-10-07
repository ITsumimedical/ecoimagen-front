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
            <v-data-table :headers="headersCama" :search="campoBusqueda" :items="camas" :loading="loading"
                no-data-text="No hay camas para mostrar" dense>

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
                    <v-tooltip top >
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                @click="abrirModalEditar(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }" v-if="item.estado_id ===1 || item.estado_id ===2">
                            <v-icon :color="item.estado_id === 1 ? 'success' : 'error'" v-bind="attrs" v-on="on"
                                @click="cambiarEstado(item)">{{
                             item.estado_id === 1 ? "mdi-toggle-switch-off" : "mdi-toggle-switch"
                               }}
                            </v-icon>
                        </template>

                        <span>Cambiar Estado</span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="getColor(item.estado_id)" dark>
                        {{ item.estado}}
                    </v-chip>
                </template>

            </v-data-table>
        </v-card-text>

        <!-- Modal Crear/Editar -->
        <v-dialog v-model="dialogCrearEditar" persistent max-width="900px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                    <b>{{ editMode ? "Editar" : "Crear" }} Cama</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="camaForm">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field dense v-model="cama.nombre" label="Nombre" :rules="rules.nombre">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field dense v-model="cama.descripcion" label="Descripcion">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field dense v-model="cama.precio" label="Precio" :rules="rules.precio">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-autocomplete dense v-model="cama.pabellon_id" label="Pabellon" :items="pabellones"
                                    item-value="id" item-text="nombre" :rules="rules.pabellon_id">
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="cancelarCrearEditar()">Cerrar</v-btn>
                    <v-btn color="success" dark @click="guardarCama()">
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
        name: "cama",
        data() {
            return {
                preload: false,
                loading: false,
                camas: [],
                headersCama: [{
                        text: "",
                        value: "id",
                        align: "center"
                    },
                    {
                        text: "Cama",
                        value: "nombre",
                        align: "center"
                    },
                    {
                        text: "Descripcion",
                        value: "descripcion",
                        align: "center"
                    },
                    {
                        text: "Precio",
                        value: "precio",
                        align: "center"
                    },
                    {
                        text: "Pabellón",
                        value: "pabellon",
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
                cama: {
                    nombre: "",
                },
                rules: {
                    nombre: [(v) => !!v || "El campo nombre es requerido"],
                    precio: [(v) => !!v || "El campo precio es requerido"],
                    pabellon_id: [(v) => !!v || "El campo pabellón es requerido"],
                },
                pabellones: []
            };
        },

        watch: {
            ejecutar: {
                handler(valor) {
                    if (valor) {
                        this.listarPabellon()
                        this.listarCamas()
                    }
                },
                immediate: true

            }
        },
        mounted() {
            // this.listarCamas();
        },
        methods: {
            ...mapActions('app', ['setPreload']),

            async listarCamas() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.get(`/cama/listar`)
                    this.camas = response.data;
                } catch (error) {
                    console.log(error)
                } finally {
                    this.setPreload(false)
                }
            },

            abrirModalCrear() {
                this.dialogCrearEditar = true;
                this.editMode = false;
                this.cama = {
                    nombre: ""
                };
            },

            abrirModalEditar(item) {
                this.dialogCrearEditar = true;
                this.editMode = true;
                this.cama = {
                    ...item
                };
            },

            cancelarCrearEditar() {
                this.dialogCrearEditar = false;
                this.cama = {
                    nombre: "",
                    funciones: "",
                };
            },

            guardarCama() {

                if (!this.cama.nombre) {
                    return this.$toast.error("Todos los campos son obligatorios");
                }

                if (this.editMode) {
                    if (!this.$refs.camaForm.validate()) {
                        return
                    }
                    this.setPreload(true)
                    this.$axios
                        .put(`/cama/${this.cama.id}`, this.cama)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se actualizó la cama correctamente");
                            this.listarCamas();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al actualizar la cama");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                } else {
                    if (!this.$refs.camaForm.validate()) {
                        return
                    }
                    this.setPreload(true)
                    this.$axios
                        .post(`/cama/crear`, this.cama)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se creó la cama correctamente");
                            this.listarCamas();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al crear la cama");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                }
            },

            async listarPabellon() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.post(`/pabellon/listar`, {
                        estado: true
                    })
                    this.pabellones = response.data;
                } catch (error) {
                    console.log(error)
                } finally {
                    this.setPreload(false)
                }
            },

            getColor(estado_id) {
                return estado_id == 1 ? "green" : "red";
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
                            .put(`/cama/cambiarEstado/${item.id}`, {
                                'estado_id': item.estado_id == 1 ? 2 : 1,
                            })
                            .then(() => {
                                this.$toast.success("Cambio de estado exitoso");
                                this.listarCamas();
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
