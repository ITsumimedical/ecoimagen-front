<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Clientes Mesa Ayuda</span>
                        </div>
                    </v-toolbar-title>

                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="success" small class="mb-2 white--text" @click="dialogCrear = true">
                        Crear
                        <v-icon dark right>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>

            <v-row class="pa-4">
                <v-col md="5" sm="12">
                    <v-text-field v-model="busqueda" label="Buscar cliente" outlined dense clearable />
                </v-col>
                <v-col md="2" sm="6">
                    <v-btn-toggle background-color="white" dark>
                        <v-btn small color="error" @click="busqueda = null">Limpiar</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="clientes" class="elevation-1" :search="busqueda">
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-btn icon small color="blue" @click="editar(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- Modal crear Cliente -->
        <v-dialog v-model="dialogCrear" max-width="600px">
            <v-card elevation="6" class="rounded-lg">

                <v-card-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                    <span class="text-h6 font-weight-bold">Crear Cliente</span>
                </v-card-title>

                <v-divider></v-divider>

                <!-- Formulario -->
                <v-card-text>
                    <v-form ref="formCrear" v-model="formValido">
                        <v-text-field v-model="nuevoCliente.nombre" label="Nombre(s) *" prepend-inner-icon="mdi-account"
                            :rules="[rules.obligatorio]" />

                        <v-text-field v-model="nuevoCliente.endpoint_pendiente" label="Endpoint Pendientes"
                            prepend-inner-icon="mdi-clock-alert" :rules="[rules.obligatorio]" />

                        <v-text-field v-model="nuevoCliente.endpoint_accion_comentario_solicitante"
                            label="Endpoint Comentario Solicitante" prepend-inner-icon="mdi-message-text"
                            :rules="[rules.obligatorio]" />

                        <v-text-field v-model="nuevoCliente.endpoint_accion_reasignar" label="Endpoint Reasignar"
                            prepend-inner-icon="mdi-account-switch" :rules="[rules.obligatorio]" />

                        <v-text-field v-model="nuevoCliente.endpoint_accion_solucionar" label="Endpoint Solucionar"
                            prepend-inner-icon="mdi-lightbulb-on" :rules="[rules.obligatorio]" />
                    </v-form>
                </v-card-text>

                <!-- Botones -->
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text color="error" @click="dialogCrear = false">
                        <v-icon left>mdi-close-circle</v-icon> Cancelar
                    </v-btn>
                    <v-btn color="success" @click="guardarCliente">
                        <v-icon left>mdi-content-save</v-icon> Guardar
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="ModalEditar" max-width="600px">
            <v-card elevation="6" class="rounded-lg">

                <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-account-edit</v-icon>
                    <span class="text-h6 font-weight-bold">Editar Cliente</span>
                </v-card-title>


            </v-card>

        </v-dialog>

        <!-- Modal Editar Clientes -->

        <v-dialog v-model="dialogEditar" max-width="600px">
            <v-card elevation="6" class="rounded-lg">

                <v-card-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                    <span class="text-h6 font-weight-bold">Editar Cliente</span>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <v-form ref="formEditar" v-model="formValido">
                        <v-text-field v-model="clienteEditar.nombre" label="Nombre(s) *"
                            prepend-inner-icon="mdi-account" :rules="[rules.obligatorio]" />

                        <v-text-field v-model="clienteEditar.endpoint_pendiente" label="Endpoint Pendientes"
                            prepend-inner-icon="mdi-clock-alert" :rules="[rules.obligatorio]" />

                        <v-text-field v-model="clienteEditar.endpoint_accion_comentario_solicitante"
                            label="Endpoint Comentario Solicitante" prepend-inner-icon="mdi-message-text"
                            :rules="[rules.obligatorio]" />

                        <v-text-field v-model="clienteEditar.endpoint_accion_reasignar" label="Endpoint Reasignar"
                            prepend-inner-icon="mdi-account-switch" :rules="[rules.obligatorio]" />

                        <v-text-field v-model="clienteEditar.endpoint_accion_solucionar" label="Endpoint Solucionar"
                            prepend-inner-icon="mdi-lightbulb-on" :rules="[rules.obligatorio]" />
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text color="error" @click="dialogEditar = false">
                        <v-icon left>mdi-close-circle</v-icon> Cancelar
                    </v-btn>
                    <v-btn color="success" @click="actualizarCliente">
                        <v-icon left>mdi-content-save</v-icon> Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import {
        mounted
    } from 'vue2-dropzone';

    export default {
        data() {
            return {
                dialogEditar: false,
                ModalEditar: false,
                busqueda: null,
                dialogCrear: false,
                formValido: false,
                nuevoCliente: {
                    nombre: "",
                    endpoint_pendiente: "",
                    endpoint_accion_comentario_solicitante: "",
                    endpoint_accion_reasignar: "",
                    endpoint_accion_solucionar: "",
                },
                clienteEditar: {
                    nombre: "",
                    endpoint_pendiente: "",
                    endpoint_accion_comentario_solicitante: "",
                    endpoint_accion_reasignar: "",
                    endpoint_accion_solucionar: "",
                },

                headers: [{
                        text: "ID",
                        value: "id"
                    },
                    {
                        text: "Nombre",
                        value: "nombre"
                    },
                    {
                        text: "Endpoin Pendientes",
                        value: "endpoint_pendiente"
                    },
                    {
                        text: "Endpoin Comentario Solicitante",
                        value: "endpoint_accion_comentario_solicitante"
                    },
                    {
                        text: "Endpoin Reasignar",
                        value: "endpoint_accion_reasignar"
                    },
                    {
                        text: "Enpoin Solucionar",
                        value: "endpoint_accion_solucionar"
                    },
                    {
                        text: "Acciones",
                        value: "acciones",
                        sortable: false
                    },
                ],
                clientes: [],
                rules: {
                    obligatorio: v => !!v || "El campo es obligatorio",


                }
            }
        },

        mounted() {
            this.listarClienteMesaAyuda();

        },

        watch: {
            dialogCrear(val) {
                if (!val) this.resetForm()
            },
            dialogEditar(val) {
                if (!val) this.resetForm()
            }
        },

        methods: {

            async listarClienteMesaAyuda() {
                try {
                    const res = await this.$axios.get("/clientesMesaAyuda/listar");
                    this.clientes = res.data;
                } catch (error) {
                    this.$toast.error("Error cargando clientes");
                    console.error(error);
                }

            },

            resetForm() {
                if (this.$refs.formCrear) {
                    this.$refs.formCrear.reset();
                    this.$refs.formCrear.resetValidation();
                }
                this.nuevoCliente = {
                    nombre: "",
                    endpoint_pendiente: "",
                    endpoint_accion_comentario_solicitante: "",
                    endpoint_accion_reasignar: "",
                    endpoint_accion_solucionar: "",
                };
            },


            async guardarCliente() {
                if (!this.$refs.formCrear.validate()) {
                    this.$toast.error("Corrige los errores del formulario");
                    return;
                }
                try {
                    await this.$axios.post("/clientesMesaAyuda/crear-clientes", this.nuevoCliente);
                    this.$toast.success("Cliente creado exitosamente");

                    this.listarClienteMesaAyuda();

                    this.dialogCrear = false;
                    this.resetForm();
                } catch (error) {
                    if (error.response ?.status === 422) {
                        this.$toast.error(error.response.data.error);

                    } else {
                        this.$toast.error("Error inesperado");
                    }
                    this.resetForm();
                }
            },

            editar(item) {
                console.log(item)
                this.clienteEditar = Object.assign({}, item);
                this.dialogEditar = true;
            },

            async actualizarCliente() {
                if (!this.$refs.formEditar.validate()) {
                    this.$toast.error("Corrige los errores del formulario");
                    return;
                }
                try {
                    await this.$axios.post(`/clientesMesaAyuda/editar/${this.clienteEditar.id}`, this
                    .clienteEditar);
                    this.$toast.success("Cliente actualizado correctamente");

                    this.dialogEditar = false;
                    this.listarClienteMesaAyuda();
                    this.resetForm();
                } catch (error) {
                    this.$toast.error("Error al actualizar el cliente");
                }
            },
        }
    }

</script>
