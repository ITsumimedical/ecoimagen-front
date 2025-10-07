<template>
    <v-card>
        <v-alert color="warning" border="left" type="info" text icon="mdi-account-check"
            class="text-left mr-2 ml-2 mt-2"><b>Asociar usuarios por defecto a los sucesos deseados</b></v-alert>
        <v-data-table :headers="headers" :items="sucesos" :items-per-page="10" :search="buscarTipoEvento"
            loading-text="Cargando..." no-data-text="Sin datos para mostrar"
            no-results-text="Ningún registro coincide con la búsqueda" :footer-props="{
                'items-per-page-text': '',
                'items-per-page-options': [5, 10, 15, 100, { text: 'Todos', value: -1 }],
                'show-first-last-page': true,
                'first-icon': 'mdi-page-first',
                'last-icon': 'mdi-page-last',
                'prev-icon': 'mdi-chevron-left',
                'next-icon': 'mdi-chevron-right',
                'page-text': '{0}-{1} de {2}'
            }">
            <template v-slot:top>
                <v-card-title>
                    <v-btn small color=" boton" class="mb-2 white--text" @click="abrirDialogo()">
                        Nuevo
                        <v-icon right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-btn small elevation="4" color="purple" class="ml-4 mb-2 white--text"
                        @click="abrirDialogoDefecto()">
                        Gestionar usuarios por defecto generales
                        <v-icon right>
                            mdi-account-supervisor-circle
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-text-field v-model="buscarTipoEvento" dense label="Buscar" append-icon="mdi-magnify" hide-details
                        single-line>
                    </v-text-field>
                </v-card-title>

            </template>
            <template v-slot:[`item.usuario`]="{ item }">
                <v-menu open-on-click right offset-y persistent>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-on="on" v-bind="attrs" color="primary">mdi-account-group</v-icon>
                    </template>
                    <v-list>
                        <v-list-item v-for="nombre in item.usuario" :key="nombre.id">
                            <v-list-item-content>
                                <v-chip label color="white" class="mt-0">
                                    <v-icon color="purple" class="mr-2">mdi-account-check</v-icon>
                                    <b>{{ nombre.nombre }}</b>
                                </v-chip>
                                <v-divider></v-divider>
                            </v-list-item-content>
                            <v-list-item-action end>
                                <template>
                                    <v-tooltip right>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="red" medium class="mr-2"
                                                @click="eliminar(nombre.id, nombre.suceso_id)" v-bind="attrs"
                                                v-on="on">mdi-delete</v-icon>
                                        </template>
                                        <span>Eliminar usuario</span>
                                    </v-tooltip>
                                </template>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>

                </v-menu>

            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="warning" medium class="mr-2" v-bind="attrs" v-on="on"
                            @click="agregarUsuario(item)">
                            mdi-plus-thick
                        </v-icon>
                    </template>
                    <span>Agregar usuario</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" medium class="mr-2" v-bind="attrs" v-on="on"
                            @click="eliminarUsuarios(item.id)">
                            mdi-delete-alert
                        </v-icon>
                    </template>
                    <span>Eliminar todos los usuarios</span>
                </v-tooltip>
            </template>

        </v-data-table>


        <v-dialog v-model="dialog" max-width="800px">
            <v-container fluid class="pa-0">
                <v-card>
                    <v-card-title>
                        <v-toolbar flat class="d-flex flex-wrap align-center">
                            <v-toolbar-title class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px" width="50px" />
                                <span class="ml-2 font-weight-bold">{{ titulo }}</span>
                            </v-toolbar-title>
                        </v-toolbar>
                    </v-card-title>
                    <v-form ref="form">
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-autocomplete v-if="tipoSuceso.nombre === ''" dense label="Suceso"
                                            v-model="tipoSuceso.id" :items="tiposSucesos" item-text="nombre"
                                            item-value="id" :loading="loading" :rules="regla.suceso">
                                        </v-autocomplete>
                                        <v-text-field dense label="Suceso" v-model="tipoSuceso.nombre" v-else>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-autocomplete dense v-model="tipoSuceso.usuario" :items="usuarios"
                                            item-text="nombre" item-value="id" label="Usuario" :loading="loading"
                                            :rules="regla.usuario">
                                        </v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error" small @click="close()">
                                Cancelar
                            </v-btn>
                            <v-btn color="boton" small dark @click="guardarSuceso()">
                                Guardar
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-container>
        </v-dialog>
        <UsuariosDefectoComponente :abrirDialogoUsuarioDefecto="dialogoVisible" @cerrar="dialogoVisible = $event" />



    </v-card>

</template>

<script>
import { mapActions } from 'vuex';
import UsuariosDefectoComponente from '@/components/evento/UsuariosDefectoComponente.vue';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'UsuariosAsociadosEventosComponente',
    components: {
        UsuariosDefectoComponente
    },
    data() {
        return {
            sucesos: [],
            headers: [
                {
                    text: 'Id',
                    value: 'id',
                    align: "center"

                },
                {
                    text: 'Nombre',
                    value: 'nombre',
                    align: "center"

                },
                {
                    text: 'Usuarios relacionados',
                    value: 'usuario',
                    align: "center"
                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false,
                    align: "center"
                },
            ],
            buscarTipoEvento: '',
            dialog: false,
            loading: false,
            dialogoAgregarUsuario: false,
            tipoSuceso: {
                id: '',
                nombre: '',
                usuario: null,
            },
            editedIndex: -1,
            defecto: {
                id: '',
                nombre: '',
                usuario: null,
            },
            usuarios: [],
            tiposSucesos: [],
            regla: {
                suceso: [(v) => !!v || 'El campo suceso es requerido'],
                usuario: [(v) => !!v || 'Campo nombre de usuario es requerido'],
            },
            dialogoVisible: false,
            paginacion: {
                pagina: 1,
                total: 0,
                opcionActual: 5,
                opciones: [5, 10, 20, 50, 100]
            },
        }
    },
    mounted() {
        this.listarUsuariosSucesos()
    },
    computed: {
        titulo() {
            return this.editedIndex === -1 ? 'CREAR ASIGNACIÓN DE SUCESO' : 'AGREGAR USUARIO A SUCESO'
        }
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        async listarUsuariosSucesos() {
            this.setPreload(true)
            try {
                this.sucesos = []
                const data = await this.$axios.get('usuario-suceso/listar')
                const sucesosUsuarios = data.data.data
                this.sucesos = sucesosUsuarios
                this.setPreload(false)
            } catch (error) {
                this.$toast.error(error.response.data.error)
                this.setPreload(false)
            }
        },
        listarUsuario() {
            this.loading = true
            this.$axios.get('operador/listarActivos').then(res => {
                this.usuarios = res.data.map((usuario) => {
                    const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 'Sin nombre'
                    return {
                        id: usuario.user_id,
                        nombre: `${usuario.documento} - ${nombreCompleto}`
                    }
                })
            }).catch(error => {
                this.$toast.error(error.response.data.mensaje)
            }).finally(() => {
                this.loading = false
            })
        },
        listarSucesos() {
            this.loading = true
            this.$axios.get('sucesos/listar').then(res => {
                this.tiposSucesos = res.data.data.map((suceso) => {
                    return {
                        id: suceso.id,
                        nombre: `${suceso.id} - ${suceso.nombre}`
                    }
                })
            }).catch(error => {
                this.$toast.error(error.response.data.mensaje)
            }).finally(() => {
                this.loading = false
            })
        },
        eliminar(usuario_id, suceso_id) {
            this.$swal({
                title: "¿Está seguro/a?",
                text: "Se eliminará el usuario del suceso",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(res => {
                if (res.value) {
                    this.setPreload(true);

                    this.$axios.post(`usuario-suceso/eliminar-usuario-suceso/${suceso_id}/${usuario_id}`).then((res) => {
                        this.$toast.success(res.data.mensaje);
                        this.sucesos = []
                        this.listarUsuariosSucesos()
                    }).catch(error => {
                        this.$toast.error(error.response.data.mensaje);

                    }).finally(() => {
                        this.setPreload(false);
                    });
                }
            });
        },

        eliminarUsuarios(suceso_id) {
            this.$swal({
                title: "¿Está seguro/a?",
                text: "Se eliminarán todos los usuarios del suceso",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(res => {
                if (res.value) {
                    this.setPreload(true);

                    this.$axios.post(`usuario-suceso/eliminar-suceso/${suceso_id}`).then((res) => {
                        this.$toast.success(res.data.mensaje);
                        this.sucesos = []
                        this.listarUsuariosSucesos()
                    }).catch(error => {
                        this.$toast.error(error.response.data.mensaje);

                    }).finally(() => {
                        this.setPreload(false);
                    });
                }
            });
        },
        guardarSuceso() {
            if (this.$refs.form.validate()) {


                this.setPreload(true);
                const data = {
                    suceso: this.tipoSuceso.id,
                    usuario: this.tipoSuceso.usuario,
                }
                this.$axios.post('usuario-suceso/asignar', data).then(res => {
                    this.$toast.success(res.data.mensaje)
                    this.sucesos = []
                    this.listarUsuariosSucesos()
                    this.close()
                }).catch(error => {
                    this.$toast.error(error.response.data.mensaje)
                }).finally(() => {
                    this.setPreload(false);
                })

                this.$refs.form.resetValidation()
            }

        },
        agregarUsuario(item) {
            this.editedIndex = this.sucesos.indexOf(item)
            this.tipoSuceso = Object.assign({}, item)
            this.abrirDialogo()


        },
        abrirDialogo() {
            this.dialog = true
            if (this.usuarios.length === 0) { this.listarUsuario() }
            if (this.editedIndex === -1 && this.tiposSucesos.length === 0) {
                this.listarSucesos()
            }
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.tipoSuceso = Object.assign({}, this.defecto)
                this.editedIndex = -1
            })
            this.$refs.form.reset()
        },
        abrirDialogoDefecto() {
            this.dialogoVisible = true
        }
    },
}

</script>
