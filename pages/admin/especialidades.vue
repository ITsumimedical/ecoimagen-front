<template>
    <div>

        <v-card class="rounded-xl">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Especialidades</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn small color="success" dark class="mb-2" @click="dialog = true">
                        Crear Especialidad
                        <v-icon dark right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>
            <v-card-text>

                <v-data-table dense :headers="headersEspecialidades" :search="search" :items="especialidades"
                    no-data-text="Sin datos para mostrar">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-row>
                                <v-col md="5" lg="5" xl="5" sm="6" cols>
                                    <v-text-field dense v-model="search" label="Buscar ...">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-toolbar>
                    </template>

                    <template v-slot:[`item.estado`]="{ item }">
                        <v-chip small :color="getColor(item.estado)" dark>
                            {{ item.estado == '1' ? 'Activa' : 'Inactiva' }}
                        </v-chip>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <div style="display: flex; justify-content: center; gap: 0.3rem">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="editItem(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="deleteItemConfirm(item)">
                                        mdi-list-status
                                    </v-icon>
                                </template>
                                <span>{{ item.estado == true ? 'Inactivar' : 'Activar' }}</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="success" v-bind="attrs" v-on="on"
                                        @click="abrirModalGestionarEspecialidad(item)">
                                        mdi-group
                                    </v-icon>
                                </template>
                                <span>Gestionar Grupos</span>
                            </v-tooltip>
                        </div>
                    </template>

                </v-data-table>
            </v-card-text>

            <!--- modals -->
            <v-dialog v-model="dialog" max-width="500px">
                <v-card :loading="loading.form" :disabled="loading.form">
                    <v-card-title class="titulo black--text">
                        {{ formTitle }}
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedItem.nombre" label="Nombre"
                                        :error-messages="errors.nombre">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="clearErrores()">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="guardarEspecialidad()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="800px">
                <v-card>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" dark @click="closeDelete()">Cancelar</v-btn>
                        <v-btn small color="boton" dark @click="deleteItemConfirm(editedItem)">
                            {{ editedItem.estado == true ? 'Inactivar' : 'Activar' }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-card>

        <modal-gestionar-grupos-especialidad :especialidad-seleccionada="especialidadSeleccionada"
            :mostrar-modal-gestionar-grupos.sync="mostrarModalGestionarGrupos" />

    </div>
</template>

<script>
import { mapActions } from "vuex";
import ModalGestionarGruposEspecialidad from "@/components/especialidades/modalGestionarGruposEspecialidad.vue";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    components: {
        ModalGestionarGruposEspecialidad
    },
    name: "WorkspaceJsonEspecialidadesCoponent",

    data() {
        return {
            search: null,
            dialog: false,
            dialogDelete: false,
            loading: {
                form: false
            },
            editedIndex: -1,
            especialidades: [],
            editedItem: {
                nombre: null
            },
            errors: {
                nombre: null
            },
            headersEspecialidades: [
                {
                    text: 'id',
                    value: 'id',
                },
                {
                    text: 'Nombre',
                    align: 'start',
                    sortable: false,
                    value: 'nombre',
                },
                {
                    text: 'Estado',
                    value: 'estado',
                    sortable: false,
                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false,
                },
            ],
            mostrarModalGestionarGrupos: false,
            especialidadSeleccionada: {},
        };
    },

    created() {
        this.listarEspecialidad()
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Crear especialidad' : 'Editar especialidad'
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        async listarEspecialidad() {
            try {
                this.setPreload(true)
                const response = await this.$axios.post('/especialidades/listarTodas')
                this.especialidades = response.data;
            } catch (error) {
                console.error(error)
            } finally {
                this.setPreload(false)
            }
        },

        async guardarEspecialidad() {
            try {
                this.loading.form = true;
                if (this.editedIndex > -1) {
                    const response = await this.$axios.put('/especialidades/' + this.editedItem.id, this.editedItem)
                    this.$toast.success(response.data.mensaje)
                } else {
                    const response = await this.$axios.post('/especialidades/crear', this.editedItem)
                    this.$toast.success(response.data.mensaje)
                }
                this.dialog = false;
                this.listarEspecialidad()
            } catch (error) {

                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.message)
                }

                if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            } finally {
                this.loading.form = false;
            }
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        clearErrores() {
            this.dialog = false
            this.clearEspecialidad()
            this.editedIndex = -1
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        clearEspecialidad() {
            for (const key in this.editedItem) {
                this.editedItem[key] = ''
            }
        },

        getColor(estado) {
            if (estado == 1) return 'success'
            else return 'error'
        },

        deleteItemConfirm(item) {
            return this.$swal({
                title: "¿Está Seguro?",
                text: "Deseas cambiar el estado de esta especialidad",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    const request = {
                        'estado': item.estado == 1 ? 0 : 1,
                    };
                    this.$axios.put('/especialidades/' + item.id, request).then(res => {
                        this.$toast.success(res.data.mensaje)
                        this.listarEspecialidad()
                        this.closeDelete()
                    }).catch(error => {
                        if (error.response.data.error) {
                            this.$toast.error(error.response.data.error)
                        } else if (error.response.data) {
                            this.ErrorEntrada(error.response.data)
                        }
                    });
                }
            });

        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        limpiar() {
            this.preload = true;
            for (const prop of Object.getOwnPropertyNames(this.filtro)) {
                this.filtro[prop] = null;
            }
            for (const key in this.editedItem) {
                this.editedItem[key] = ''
            }
            this.editedIndex = -1
            this.dialog = false
            this.preload = false;
            this.listarEspecialidad();
        },

        editItem(item) {
            this.editedIndex = this.especialidades.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        abrirModalGestionarEspecialidad(item) {
            this.especialidadSeleccionada = item
            this.mostrarModalGestionarGrupos = true
        }

    },

}

</script>
