<template>

    <v-card class="rounded-xl">

        <v-card-title>

            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Usuarios</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn small class="mb-2 white--text" color="success" @click="abrirModalCrear()">Crear</v-btn>
            </v-toolbar>

        </v-card-title>

        <v-card-text>

            <!--  Filtro y tabla de usuarios -->
            <v-row>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field dense outlined v-model="filtroUsuarios.nombre" @keyup.enter="buscarUsuarios"
                        label="Nombre">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field dense outlined v-model="filtroUsuarios.documento" @keyup.enter="buscarUsuarios"
                        label="No. Documento">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-text-field dense outlined v-model="filtroUsuarios.correo" @keyup.enter="buscarUsuarios"
                        label="Correo Electrónico">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-btn color="primary" @click="buscarUsuarios()">Buscar</v-btn>
                    <v-btn color="error" @click="limpiarUsuarios()">Limpiar</v-btn>
                </v-col>
            </v-row>

        </v-card-text>


        <v-card-text>

            <v-data-table no-data-text="No hay resultados" loading-text="Cargando..." :loading="loading.usuarios" dense
                :headers="headersUsuarios" :items="usuarios">

                <template v-slot:[`item.operador_nombre`]="{ item }">
                    {{
                        [item.operador?.nombre, item.operador?.apellido]
                            .filter(Boolean)
                    .join(' ')
                    }}
                </template>


                <template v-slot:[`item.estado_user`]="{ item }">
                    <v-chip :color="item.activo ? 'success' : 'error'" small>{{
                        item.activo ? "Activo" : "Inactivo"
                    }}</v-chip>
                </template>

                <!-- acciones -->
                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="d-flex justify-space-between" style="gap: 5px">
                        <v-tooltip top v-if="item.activo">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="gray" v-bind="attrs" v-on="on"
                                    @click="abrirModalEntidades(item)">mdi-account-settings
                                </v-icon>
                            </template>
                            <span>Entidades del Usuario</span>
                        </v-tooltip>
                        <v-tooltip top v-if="item.activo">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="yellow" v-bind="attrs" v-on="on"
                                    @click="abrirModalEspecialidades(item)">mdi-star-settings
                                </v-icon>
                            </template>
                            <span>Especialidades del Usuario</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon :color="item.activo == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                                    @click="cambiarEstadoUsuario(item)">{{
                                        item.activo == true
                                            ? "mdi-toggle-switch-off"
                                            : "mdi-toggle-switch"
                                    }}
                                </v-icon>
                            </template>
                            <span>{{
                                item.activo == true ? "Desactivar Usuario" : "Activar Usuario"
                            }}</span>
                        </v-tooltip>
                    </div>
                </template>

                <!-- gestion -->
                <template v-slot:[`item.gestion`]="{ item }">
                    <div class="d-flex justify-space-between" style="gap: 5px">
                        <v-tooltip top v-if="item.activo">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                    @click="abrirModalEditar(item)">mdi-account-edit
                                </v-icon>
                            </template>
                            <span>Gestionar Usuario</span>
                        </v-tooltip>
                        <v-tooltip top v-if="item.activo">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" v-bind="attrs" v-on="on"
                                    @click="abrirModalRoles(item)">mdi-sitemap
                                </v-icon>
                            </template>
                            <span>Roles del Usuario</span>
                        </v-tooltip>
                        <v-tooltip top v-if="item.activo">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="#1B5E20" v-bind="attrs" v-on="on"
                                    @click="abrirModalPermisos(item)">mdi-shield-key
                                </v-icon>
                            </template>
                            <span>Permisos del Usuario</span>
                        </v-tooltip>
                    </div>
                </template>

                <!-- sesion -->
                <template v-slot:[`item.sesion`]="{ item }">
                    <div class="d-flex justify-space-between" style="gap: 5px">
                        <v-tooltip top v-if="item.o_auth_access_token_count > 0">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="error" v-bind="attrs" v-on="on"
                                    @click="cerrarSesion(item)">mdi-close-network
                                </v-icon>
                            </template>
                            <span>Cerrar sesion Usuario</span>
                        </v-tooltip>
                    </div>
                </template>

            </v-data-table>

        </v-card-text>


        <!-- Modal Crear usuario -->
        <CrearUsuarioModal :mostrarCrearModal.sync="mostrarCrearModal" @crearUsuario="crearUsuario">
        </CrearUsuarioModal>

        <!-- Modal Editar usuario -->
        <EditarUsuarioModal :mostrarEditarModal.sync="mostrarEditarModal" @actualizarUsuario="actualizarUsuario"
            :usuario="usuarioSeleccionado"></EditarUsuarioModal>

        <!-- Modal Roles -->
        <RolesModal :mostrarRolesModal.sync="mostrarRolesModal" @actualizarRoles="actualizarRoles"
            @removerRoles="removerRoles" :usuario="usuarioSeleccionado"></RolesModal>

        <!-- Modal Permisos -->
        <PermisosModal :mostrarPermisosModal.sync="mostrarPermisosModal" @actualizarPermisos="actualizarPermisos"
            @removerPermisos="removerPermisos" :usuario="usuarioSeleccionado"></PermisosModal>

        <!-- Modal Entidades -->
        <EntidadesModal :mostrarEntidadesModal.sync="mostrarEntidadesModal" @actualizarEntidades="actualizarEntidades"
            @removerEntidades="removerEntidades" :usuario="usuarioSeleccionado"></EntidadesModal>

        <!-- Modal Especialidades -->
        <EspecialidadesModal :mostrarEspecialidadesModal.sync="mostrarEspecialidadesModal"
            @actualizarEspecialidades="actualizarEspecialidades" @removerEspecialidades="removerEspecialidades"
            :usuario="usuarioSeleccionado"></EspecialidadesModal>

    </v-card>


</template>

<script>
import CrearUsuarioModal from "@/components/admin/CrearUsuarioModal.vue";
import EditarUsuarioModal from "@/components/admin/EditarUsuarioModal.vue";
import RolesModal from "@/components/admin/RolesModal.vue";
import PermisosModal from "@/components/admin/PermisosModal.vue";
import EntidadesModal from "@/components/admin/EntidadesModal.vue";
import EspecialidadesModal from "@/components/admin/EspecialidadesModal.vue";
import { mapActions } from "vuex";

export default {
    components: {
        CrearUsuarioModal,
        EditarUsuarioModal,
        RolesModal,
        PermisosModal,
        EntidadesModal,
        EspecialidadesModal,
    },
    data() {
        return {
            preload: false,
            mostrarCrearModal: false,
            loading: {
                usuarios: false,
            },
            filtroUsuarios: {
                nombre: "",
                documento: "",
                correo: "",
            },
            pagina: 1,
            cantidadRegistros: 5,
            opciones: [5, 10, 20, 50, 100],
            totalPaginas: 0,
            usuarios: [],
            headersUsuarios: [
                { text: "ID", value: "id" },
                { text: "Nombre", value: "operador_nombre" },
                { text: "Documento", value: "operador.tipo_documento_documento" },
                { text: "Correo Electrónico", value: "email" },
                { text: "Tipo de Usuario", value: "tipo_usuario.nombre" },
                { text: "Estado", value: "estado_user" },
                {
                    text: "Acciones",
                    value: "acciones",
                    sortable: false,
                    align: "center",
                },
                {
                    text: "Acceso",
                    value: "gestion",
                    sortable: false,
                    align: "center",
                },
                {
                    text: "Sesión",
                    value: "sesion",
                    sortable: false,
                    align: "center",
                },
            ],
            mostrarEditarModal: false,
            usuarioSeleccionado: {},
            mostrarRolesModal: false,
            mostrarPermisosModal: false,
            mostrarEntidadesModal: false,
            mostrarEspecialidadesModal: false,
        };
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        async buscarUsuarios() {
            if (
                !this.filtroUsuarios.documento &&
                !this.filtroUsuarios.correo &&
                !this.filtroUsuarios.nombre
            ) {
                this.$toast.error(
                    "Debe ingresar por lo menos un criterio de búsqueda"
                );
                return;
            }

            try {
                this.loading.usuarios = true;
                const response = await this.$axios.post(`/usuarios/busqueda-usuario`, this.filtroUsuarios);
                this.usuarios = response.data;
                if (this.usuarios.length <= 0) {
                    this.$toast.error('No se han encontrado registros de usuarios con los criterios ingresados')
                }
            } catch (error) {
                this.$toast.error("Ocurrió un error al cargar los usuarios");
                this.$toast.error(error.response.data);
            } finally {
                this.loading.usuarios = false;
            }
        },

        limpiarUsuarios() {
            this.filtroUsuarios = {
                nombre: "",
                documento: "",
                correo: "",
            };

            this.usuarios = [];
        },

        abrirModalCrear() {
            this.mostrarCrearModal = true;
        },

        crearUsuario(nuevoUsuario) {
            const formData = new FormData();

            formData.append("apellido", nuevoUsuario.apellido);
            formData.append("cargo_id", nuevoUsuario.cargo_id);
            formData.append("documento", nuevoUsuario.documento);
            formData.append("email", nuevoUsuario.email);
            formData.append("email_recuperacion", nuevoUsuario.email_recuperacion);

            // Verifica que nuevoUsuario.firma es un archivo
            if (
                nuevoUsuario.firma instanceof File ||
                nuevoUsuario.firma instanceof Blob
            ) {
                formData.append("firma", nuevoUsuario.firma);
            } else {
                console.error("La firma no es un archivo válido.");
            }

            formData.append("nombre", nuevoUsuario.nombre);
            formData.append("registro_medico", nuevoUsuario.registro_medico);
            formData.append("reps_id", nuevoUsuario.reps_id);
            formData.append(
                "telefono_recuperacion",
                nuevoUsuario.telefono_recuperacion
            );
            formData.append("tipo_doc", nuevoUsuario.tipo_doc);

            this.preload = true;
            this.$axios
                .post("/usuarios/crear", formData)
                .then(() => {
                    this.$toast.success("Usuario creado exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al crear el usuario");
                    console.error(error);
                })
                .finally(() => {
                    this.preload = false;
                });

            console.log("nuevoUsuario", formData);
        },

        abrirModalEditar(item) {
            this.usuarioSeleccionado = {
                id: item.id,
                nombre: item.operador.nombre,
                apellido: item.operador.apellido,
                tipo_doc: item.operador.tipo_doc,
                documento: item.operador.documento,
                email_recuperacion: item.operador.email_recuperacion,
                telefono_recuperacion: item.operador.telefono_recuperacion,
                cargo: item.operador.cargo,
                rep: item.operador.rep,
                email: item.email,
                registro_medico: item.operador.registro_medico,
            };
            this.mostrarEditarModal = true;
        },

        actualizarUsuario(editarUsuario) {
            const formData = new FormData();

            formData.append("apellido", editarUsuario.apellido);
            formData.append("cargo_id", editarUsuario.cargo_id);
            formData.append("documento", editarUsuario.documento);
            formData.append("email", editarUsuario.email);
            formData.append("email_recuperacion", editarUsuario.email_recuperacion);

            // Verifica que editarUsuario.firma es un archivo

            formData.append("nombre", editarUsuario.nombre);
            formData.append("registro_medico", editarUsuario.registro_medico);
            formData.append("reps_id", editarUsuario.reps_id);
            formData.append(
                "telefono_recuperacion",
                editarUsuario.telefono_recuperacion
            );
            formData.append("tipo_doc", editarUsuario.tipo_doc);

            if (editarUsuario.password) {
                formData.append("password", editarUsuario.password);
            }

            if (editarUsuario.firma) {
                formData.append("firma", editarUsuario.firma);
            }

            this.preload = true;
            this.$axios
                .post(`/usuarios/actualizar/${editarUsuario.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    this.$toast.success("Usuario actualizado exitosamente");
                    this.limpiarUsuarios();
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al actualizar el usuario");
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                    this.usuarioSeleccionado = {};
                });
        },

        abrirModalRoles(item) {
            this.mostrarRolesModal = true;
            this.usuarioSeleccionado = item;
        },

        actualizarRoles(data) {
            this.preload = true;

            // Asegurarse de que 'data' es un array plano de IDs
            if (!Array.isArray(data) || data.some((item) => Array.isArray(item))) {
                this.$toast.error("Formato de roles inválido.");
                this.preload = false;
                return;
            }

            this.$axios
                .post(`/usuarios/agregarRol/${this.usuarioSeleccionado.id}`, {
                    roles: data,
                })
                .then(() => {
                    this.$toast.success("Roles actualizados exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al actualizar los roles");
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },
        removerRoles(data) {
            this.preload = true;

            const roleIds = data.map((role) => role.id);

            this.$axios
                .post(`/usuarios/removerRol/${this.usuarioSeleccionado.id}`, {
                    roles: roleIds,
                })
                .then(() => {
                    this.$toast.success("Roles actualizados exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al actualizar los roles");
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        abrirModalPermisos(item) {
            this.mostrarPermisosModal = true;
            this.usuarioSeleccionado = item;
        },

        actualizarPermisos(data) {
            this.preload = true;

            if (!Array.isArray(data) || data.some((item) => Array.isArray(item))) {
                this.$toast.error("Formato de roles inválido.");
                this.preload = false;
                return;
            }

            this.$axios
                .post(`/usuarios/agregarPermiso/${this.usuarioSeleccionado.id}`, {
                    permissions: data,
                })
                .then(() => {
                    this.$toast.success("Permisos actualizados exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al actualizar los permisos");
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        removerPermisos(data) {
            const permissionIds = data.map((permission) => permission.id);

            this.$axios
                .post(`/usuarios/removerPermiso/${this.usuarioSeleccionado.id}`, {
                    permissions: permissionIds,
                })
                .then(() => {
                    this.$toast.success("Permisos removidos exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al remover los permisos");
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },
        abrirModalEntidades(item) {
            this.mostrarEntidadesModal = true;
            this.usuarioSeleccionado = item;
        },

        actualizarEntidades(data) {
            this.preload = true;
            if (!Array.isArray(data) || data.some((item) => Array.isArray(item))) {
                this.$toast.error("Formato de roles inválido.");
                this.preload = false;
                return;
            }

            this.$axios
                .post(`/usuarios/agregarEntidad/${this.usuarioSeleccionado.id}`, {
                    entidad_id: data,
                })
                .then(() => {
                    this.$toast.success("Entidades actualizadas exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurió un error al actualizar las entidades");
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        removerEntidades(data) {
            const entidadIds = data.map((entidad) => entidad.id);

            this.$axios
                .post(`/usuarios/removerEntidad/${this.usuarioSeleccionado.id}`, {
                    entidad_id: entidadIds,
                })
                .then(() => {
                    this.$toast.success("Entidades removidas exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurió un error al remover las entidades");
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        abrirModalEspecialidades(item) {
            this.mostrarEspecialidadesModal = true;
            this.usuarioSeleccionado = item;
        },

        actualizarEspecialidades(data) {
            this.preload = true;
            if (!Array.isArray(data) || data.some((item) => Array.isArray(item))) {
                this.$toast.error("Formato de especialidades inválido.");
                this.preload = false;
                return;
            }

            this.$axios
                .post(`/usuarios/asignarEspecialidad/${this.usuarioSeleccionado.id}`, {
                    especialidad_id: data,
                })
                .then(() => {
                    this.$toast.success("Especialidades actualizadas exitosamente");
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al actualizar las especialidades"
                    );
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        removerEspecialidades(data) {
            const especialidadIds = data.map((especialidad) => especialidad.id);

            this.$axios
                .post(`/usuarios/removerEspecialidad/${this.usuarioSeleccionado.id}`, {
                    especialidad_id: especialidadIds,
                })
                .then(() => {
                    this.$toast.success("Especialidades removidas exitosamente");
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al remover las especialidades");
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        cambiarEstadoUsuario(item) {
            this.preload = true;

            this.$swal({
                title: "Está seguro?",
                text: "Desea cambiar el estado del usuario",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .post(`/usuarios/cambiarEstado/${item.id}`)
                        .then(() => {
                            this.$toast.success("Cambio de estado exitoso");
                            this.buscarUsuarios();
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
