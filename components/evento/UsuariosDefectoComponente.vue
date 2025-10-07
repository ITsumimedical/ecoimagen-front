<template>
    <v-dialog persistent v-model="abrirDialogoDefecto" max-width="60%" scrollable>
        <v-card>
            <v-toolbar flat class="d-flex flex-wrap align-center">
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px" width="50px" />
                    <span class="ml-2 font-weight-bold">Parametrizar usuarios por defecto para todos los sucesos</span>
                </v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>

            <v-data-table :headers="headers" :items="usuariosDefecto" loading-text="Cargando..." hide-default-footer
                no-data-text="Sin datos para mostrar">
                <template v-slot:top>
                    <v-card-title>
                        <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogo()">
                            Nuevo usuario
                            <v-icon right>
                                mdi-plus-circle-outline
                            </v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-title>

                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="red" medium class="mr-2" @click="eliminar(item.user_id)" v-bind="attrs"
                                v-on="on">mdi-delete</v-icon>
                        </template>
                        <span>Eliminar usuario</span>
                    </v-tooltip>
                </template>

            </v-data-table>


            <v-dialog v-model="dialog" max-width="50%">
                <v-container fluid class="pa-0">
                    <v-card>
                        <v-card-title>
                            <v-toolbar flat class="d-flex flex-wrap align-center">
                                <v-toolbar-title class="d-flex align-center">
                                    <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px"
                                        width="50px" />
                                    <span class="ml-2 font-weight-bold">AGREGAR USUARIO POR DEFECTO</span>
                                </v-toolbar-title>
                            </v-toolbar>
                        </v-card-title>
                        <v-form ref="form">
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-autocomplete dense v-model="usuario.id" :items="usuariosOperadores"
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
                                <v-btn color="boton" small dark @click="guardarUsuario()">
                                    Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-container>
            </v-dialog>


            <v-card-actions class="d-flex justify-end">
                <v-btn color="error" @click="cerrar()" class="mb-2 white--text">
                    Cerrar
                    <v-icon right>
                        mdi-close-circle-outline
                    </v-icon>

                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'UsuariosAsociadosDefectoComponente',
    props: [
        'abrirDialogoUsuarioDefecto'
    ]
    ,
    data() {
        return {
            usuariosOperadores: [],
            usuariosDefecto: [],
            headers: [
                {
                    text: 'Id',
                    value: 'id',
                    align: "center",
                    sortable: false
                },

                {
                    text: 'Usuario',
                    value: 'usuario',
                    align: "center",
                    sortable: false

                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false,
                    align: "center"
                },
            ],
            dialog: false,
            loading: false,
            usuario: {
                id: null,
            },
            regla: {
                usuario: [(v) => !!v || 'Campo nombre de usuario es requerido'],
            },
            abrirDialogoDefecto: this.abrirDialogoUsuarioDefecto,
        }
    },

    watch: {
        abrirDialogoUsuarioDefecto(newVal) {
            this.abrirDialogoDefecto = newVal
            if (newVal) {
                this.listarUsuariosDefecto()
            }
        },
        abrirDialogoDefecto(val) {
            this.$emit('cerrar', val)
        }
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        async listarUsuariosDefecto() {
            this.setPreload(true)
            try {
                const data = await this.$axios.get('usuario-suceso/listar-usuario-defecto')
                this.usuariosDefecto = data.data.data
                this.setPreload(false)
            } catch (error) {
                this.$toast.error(error.response.data.error)
                this.setPreload(false)
            }
        },
        listarUsuario() {
            this.loading = true
            this.$axios.get('operador/listarActivos').then(res => {
                this.usuariosOperadores = res.data.map((usuario) => {
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
        eliminar(usuario_id) {
            if (this.usuariosDefecto.length != 1) {
                this.$swal({
                    title: "¿Está seguro/a?",
                    text: "Se eliminará el usuario para asignar por defecto en todos los sucesos",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar",
                }).then(res => {
                    if (res.value) {
                        this.setPreload(true);

                        this.$axios.post(`usuario-suceso/eliminar-usuario-defecto/${usuario_id}`).then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.usuariosDefecto = []
                            this.listarUsuariosDefecto()
                        }).catch(error => {
                            this.$toast.error(error.response.data.mensaje);

                        }).finally(() => {
                            this.setPreload(false);
                        });
                    }
                });

            } else {
                this.$swal({
                    title: "Acción no permitida",
                    text: "No se puede eliminar el último usuario por defecto",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "red",
                    confirmButtonText: "Cancelar",

                })
            }

        },
        guardarUsuario() {
            if (this.$refs.form.validate()) {


                this.setPreload(true);
                const data = {
                    usuario: this.usuario.id,
                }
                this.$axios.post('usuario-suceso/asignar-usuario-defecto', data).then(res => {
                    this.$toast.success(res.data.mensaje)
                    this.usuariosDefecto = []
                    this.listarUsuariosDefecto()
                    this.close()
                }).catch(error => {
                    this.$toast.error(error.response.data.mensaje)
                }).finally(() => {
                    this.setPreload(false);
                })

                this.$refs.form.reset()
            }

        },
        abrirDialogo() {
            this.dialog = true
            if (this.usuariosOperadores.length === 0) { this.listarUsuario() }
        },
        close() {
            this.dialog = false;
            this.usuario = {
                id: null
            }
            this.$refs.form.reset()
        },
        cerrar() {
            this.abrirDialogoDefecto = false
            this.usuariosDefecto = []
        }
    },
}

</script>
