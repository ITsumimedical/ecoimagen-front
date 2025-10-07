<template>
    <div>
        <!-- Preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Formulario de Roles -->
        <v-dialog v-model="mostrarRolesModal" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-sitemap">
                    <b>
                        Gestionar roles al usuario
                        {{
                            [usuario.operador?.nombre, usuario.operador?.apellido]
                                .filter(Boolean)
                        .join(' ')
                        }}
                    </b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="10">
                            <v-autocomplete dense v-model="rolesAsignar" :items="nuevosRoles"
                                :loading="loading.selectorRoles" chips deletable-chips clearable small-chips multiple
                                item-text="name" item-value="id" label="Seleccione roles para asignar"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                            <v-btn color="primary" small @click="asignarRoles">
                                Asignar Roles
                                <v-icon right>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar roles" single-line
                                hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table dense :headers="headersRoles" :items="filteredRoles"
                                :loading="loading.tablaRoles" item-key="id" loading-text="Cargando..." show-select
                                v-model:select="rolesRemover"
                                no-data-text="El usuario no tiene roles asignados"></v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="warning" small @click="removerRoles()">Remover Roles</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        mostrarRolesModal: Boolean,
        usuario: Object,
    },

    data() {
        return {
            preload: false,
            loading: {
                tablaRoles: false,
                selectorRoles: false,
            },
            headersRoles: [
                { text: "ID", value: "id" },
                { text: "Rol", value: "name" },
                { text: "Descripción", value: "descripcion" },
            ],
            rolesUsuario: [],
            nuevosRoles: [],
            rolesAsignar: [],
            rolesRemover: [],
            search: "",
            singleSelect: false,
        };
    },
    watch: {
        mostrarRolesModal(newVal) {
            if (newVal) {
                this.buscarRolesUsuario();
                this.listarRoles();
            }
        },
    },

    computed: {
        filteredRoles() {
            const searchLower = this.search.toLowerCase();
            return this.rolesUsuario.filter((role) => {
                return (
                    role.name.toLowerCase().includes(searchLower) ||
                    role.descripcion.toLowerCase().includes(searchLower)
                );
            });
        },
    },

    methods: {
        cerrarModal() {
            this.$emit("update:mostrarRolesModal", false);
            this.rolesAsignar = [];
            this.rolesRemover = [];
            this.search = ""; // Limpiar búsqueda al cerrar el modal
        },

        buscarRolesUsuario() {
            this.loading.tablaRoles = true;
            this.$axios
                .get(`/usuarios/buscarRoles/${this.usuario.id}`)
                .then((res) => {
                    this.rolesUsuario = res.data[0].roles;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los roles");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.tablaRoles = false;
                });
        },

        listarRoles() {
            this.loading.selectorRoles = true;
            this.$axios
                .get("/roles/listar")
                .then((res) => {
                    this.nuevosRoles = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar la lista de roles");
                })
                .finally(() => {
                    this.loading.selectorRoles = false;
                });
        },

        asignarRoles() {
            if (this.rolesAsignar.length == 0) {
                return this.$toast.error("Debe seleccionar al menos un rol");
            }

            const rolesYaAsignados = this.rolesUsuario.map((rol) => rol.id);
            const nuevosRoles = this.rolesAsignar.filter(
                (rol) => !rolesYaAsignados.includes(rol)
            );

            if (nuevosRoles.length === 0) {
                return this.$toast.error(
                    "Todos los roles seleccionados ya están asignados"
                );
            }

            this.$emit("actualizarRoles", nuevosRoles);
            this.buscarRolesUsuario();
            this.rolesAsignar = [];
        },

        removerRoles() {
            if (this.rolesRemover.length == 0) {
                return this.$toast.error("Debe seleccionar al menos un rol");
            }

            this.$emit("removerRoles", this.rolesRemover);
            this.buscarRolesUsuario();
            this.rolesRemover = [];
        },
    },
};
</script>
