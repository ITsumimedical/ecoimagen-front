<template>

    <v-card class="rounded-xl">
        <v-card-title>

            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Roles</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn v-if="$can('rol.crear')" color="success" small class="mb-2 white--text" @click="dialog = true">
                    Crear
                    <v-icon dark right>
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </v-toolbar>

        </v-card-title>

        <v-card-text>
            <v-data-table :headers="headers" dense :search="buscarRol" :items="roles" loading-text="Cargando...">
                <template v-slot:top>

                    <v-row class="mx-2">
                        <v-col md="5" lg="5" xl="5" sm="6" cols>
                            <v-text-field dense v-model="buscarRol" label="Buscar ...">
                            </v-text-field>
                        </v-col>
                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark>
                                <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>

                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top v-if="$can('rol.actualizar')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip top v-if="$can('rol.agregarPermisoRol')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="info" small class="mr-2" v-bind="attrs" v-on="on"
                                @click="asignarPermisos(item)">
                                mdi-account-key
                            </v-icon>
                        </template>
                        <span>Gestionar permisos</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card-text>

        <!-- modal -->
        <v-dialog v-model="dialogoPermisos" persistent max-width="1200px">
            <v-card :loading="loading" :disabled="loading">
                <v-alert border="left" text dense color="info" icon="mdi-account-key">
                    <small>Gestión del rol</small><strong> - {{ asignarRol.name }}</strong>
                </v-alert>
                <v-container>
                    <v-row>
                        <v-col cols="11" sm="11" md="11">
                            <v-autocomplete clearable v-model="asignarRol.permissions" :items="permiso" dense
                                :item-text="concatenar" item-value="id" small-chips deletable-chips multiple
                                label="Seleccione los permisos para asignar al rol">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" small fab dark color="info" v-bind="attrs" v-on="on"
                                        @click="rolesapermiso(asignarRol.id)">
                                        <v-icon dark>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Asignar permisos</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-container>
                <v-col cols="6" sm="6" md="6">
                    <v-text-field v-model="buscarpermiso" label="Buscar permisos asignados"
                        prepend-inner-icon="mdi-magnify">
                    </v-text-field>
                </v-col>
                <v-data-table v-model="selected" dense :headers="headers2" :items="asignarRol.listapermisos"
                    :single-select="singleSelect" item-key="name" show-select :items-per-page="5"
                    :search="buscarpermiso">
                    <template v-slot:top>
                        <v-switch v-model="singleSelect" label="Selección única" class="pa-3"></v-switch>
                    </template>
                </v-data-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="closePermisos()">
                        Cancelar
                    </v-btn>
                    <v-btn color="warning" small @click="removerpermiso(selected)">
                        Remover permiso
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- modal -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card :loading="loading" :disabled="loading">
                <v-alert border="left" type="info" dense text>
                    Nuevo rol
                </v-alert>
                <form @submit.prevent="guardarRoles">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="rol.name" dense label="Nombre*" :error-messages="errors.name">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow v-model="rol.descripcion" dense
                                    :error-messages="errors.descripcion" label="Descripción*">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="close">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="guardarRoles">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>
        <!-- modal -->
        <v-dialog v-model="dialogoEditar" max-width="500px">
            <v-card :loading="loading" :disabled="loading">
                <v-alert dense text border="left" type="info" icon="mdi-account-cog">
                    Editar rol
                </v-alert>
                <form @submit.prevent="actualizarRol(editarRol.id)">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editarRol.name" dense :error-messages="errors.name"
                                        label="Nombre*">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea auto-grow v-model="editarRol.descripcion" dense
                                        :error-messages="errors.descripcion" label="Descripción*">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="dialogoEditar = false">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="actualizarRol(editarRol.id)">
                            Editar
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
import {
    guardarRoles,
    actualizarRol,
    removerpermiso,
    asignarPermisos
} from '@/api/admin/roles/roles'
import {
    listarPermisos
} from '@/api/permisos/permisos'
import { mapActions } from "vuex"
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('roles.vista')) {
            return redirect('/');
        }
    },
    name: 'roles',
    data() {
        return {
            preload: false,
            loading: false,
            dialog: false,
            dialogoEditar: false,
            dialogoPermisos: false,
            buscarRol: '',
            buscarpermiso: '',
            singleSelect: true,
            selected: [],
            asignarRol: {
                name: '',
                listapermisos: [],
                permission: [],
            },
            roles: [],
            permiso: [],
            rol: {
                name: '',
                descripcion: ''
            },
            editarRol: {
                name: '',
                descripcion: ''
            },
            errors: {
                name: '',
                descripcion: ''
            },
            headers: [{
                text: 'id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre',
                value: 'name'
            },
            {
                text: 'Descrpción del permiso',
                value: 'descripcion'
            },
            {
                text: 'Acciones',
                align: 'start',
                value: 'actions',
                sortable: false
            },
            ],
            headers2: [{
                text: 'id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre',

                value: 'name'
            },
            {
                text: 'Descripción',
                value: 'descripcion'
            },

            ],
        };
    },

    created() {
        this.listarRoles();
        this.listarPermisos();
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        concatenar(listarPermisos) {
            return `${listarPermisos.name} | ${listarPermisos.descripcion}`;
        },

        close() {
            this.dialog = false
            this.rol.name = ''
            this.rol.descripcion = ''
            this.limpiarError()
        },

        async listarRoles() {
            try {
                this.setPreload(true);
                const response = await this.$axios.get('/roles/listar')
                this.roles = response.data;
            } catch (error) {
                console.log(error)
            } finally {
                this.setPreload(false);
            }
        },

        limpiar() {
            this.buscarRol = '';
            this.editedIndex = -1
            this.dialog = false
        },

        async guardarRoles() {
            try {
                this.loading = true;
                const {
                    data
                } = await this.$loadingPostRequest(guardarRoles(), this.rol)
                this.$toast.success(data.mensaje)
                this.limpiarError()
                this.listarRoles()
                this.close()
            } catch (error) {
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje)
                } else if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            } finally {
                this.loading = true;
            }
        },
        
        editItem(item) {
            this.editarRol = item
            this.dialogoEditar = true
        },

        async actualizarRol(id) {
            try {
                const {
                    data
                } = await this.$loadingPutRequest(actualizarRol(id), this.editarRol)
                this.$toast.success(data.mensaje)
                this.dialogoEditar = false
                this.listarRoles()
            } catch (error) {

            }
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        async listarPermisos() {
            try {
                const {
                    data
                } = await this.$loadingPostRequest(listarPermisos(0, 0))
                this.permiso = data.data
            } catch (error) {
                this.$toast.error('Hubo un error!')
            }
        },

        async getPermisosPorRol(rol_id){
            return this.$axios.get('/permisos/listar-por-rol/' + rol_id).then(response => response.data)
        },

        async asignarPermisos(item) {
            try {
                this.setPreload(true);
                this.asignarRol.listapermisos = await this.getPermisosPorRol(item.id)
            } catch (error) {
                console.log(error)
            } finally {
                this.setPreload(false);
            }
            this.asignarRol.id = item.id
            this.asignarRol.name = item.name
            this.dialogoPermisos = true
        },

        async rolesapermiso(id) {
            try {
                await this.$loadingPostRequest(asignarPermisos(id), this.asignarRol)
                this.$toast.success('Permisos asignados correctamente')
                this.listarRoles()
                this.closePermisos()
            } catch (error) {

            }
        },

        closePermisos() {
            this.asignarRol.permissions = ''
            this.buscarpermiso = ''
            this.dialogoPermisos = false
        },

        async removerpermiso(selected) {
            try {
                const request = this.selected.map(item => {
                    return item.name
                })
                const {
                    data
                } = await this.$loadingPostRequest(removerpermiso(this.selected[0].pivot.role_id), {
                    permission: request
                })
                this.listarRoles()
                this.dialogoPermisos = false
                this.$toast.success(data.mensaje)
            } catch (error) {
                this.$toast.error(error.response.data.mensaje)
            }
        }

    },
}

</script>
