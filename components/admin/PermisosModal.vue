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

        <!-- Formulario de Permisos -->
        <v-dialog v-model="mostrarPermisosModal" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-account-key">
                    <b>
                        Gestionar permisos al usuario
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
                            <v-autocomplete dense v-model="permisosAsignar" :items="nuevosPermisos"
                                :loading="loading.selectorPermisos" chips deletable-chips clearable small-chips multiple
                                item-text="name" item-value="id"
                                label="Seleccione permisos para asignar"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                            <v-btn color="primary" small @click="asignarPermisos">
                                Asignar Permisos
                                <v-icon right>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar permisos" single-line
                                hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table dense :headers="headersPermisos" :items="filteredPermisos"
                                :loading="loading.tablaPermisos" item-key="id" loading-text="Cargando..." show-select
                                v-model:select="permisosRemover"
                                no-data-text="El usuario no tiene permisos asignados"></v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="warning" small @click="removerPermisos()">Remover Permisos</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        mostrarPermisosModal: Boolean,
        usuario: Object,
    },
    data() {
        return {
            preload: false,
            loading: {
                tablaPermisos: false,
                selectorPermisos: false,
            },
            headersPermisos: [
                { text: "ID", value: "id" },
                { text: "Permiso", value: "name" },
                { text: "Descripción", value: "descripcion" },
            ],
            permisosUsuario: [],
            permisosAsignar: [],
            nuevosPermisos: [],
            permisosRemover: [],
            search: "",
            singleSelect: false,
        };
    },
    watch: {
        mostrarPermisosModal(newVal) {
            if (newVal) {
                this.buscarPermisosUsuario();
                this.listarPermisos();
            }
        },
    },
    computed: {
        filteredPermisos() {
            const searchLower = this.search.toLowerCase();
            return this.permisosUsuario.filter((permiso) => {
                return (
                    permiso.name.toLowerCase().includes(searchLower) ||
                    permiso.descripcion.toLowerCase().includes(searchLower)
                );
            });
        },
    },
    methods: {
        cerrarModal() {
            this.$emit("update:mostrarPermisosModal", false);
            this.permisosAsignar = [];
            this.permisosRemover = [];
            this.search = ""; // Limpiar búsqueda al cerrar el modal
        },

        buscarPermisosUsuario() {
            this.loading.tablaPermisos = true;
            this.$axios
                .get(`/usuarios/buscarRoles/${this.usuario.id}`)
                .then((res) => {
                    this.permisosUsuario = res.data[0].permissions;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los permisos");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.tablaPermisos = false;
                });
        },

        listarPermisos() {
            this.loading.selectorPermisos = true;
            this.$axios
                .post("permisos/listar?page=0")
                .then((res) => {
                    this.nuevosPermisos = res.data.data.map((permiso) => {
                        return {
                            id: permiso.id,
                            name: `ID: ${permiso.id} | ${permiso.name} → ${permiso.descripcion}`,
                        };
                    });
                })
                .catch((e) => {
                    this.$toast.error("Ocurrio un error al cargar los permisos");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.selectorPermisos = false;
                });
        },

        asignarPermisos() {
            if (this.permisosAsignar.length == 0) {
                return this.$toast.error("Debe seleccionar al menos un permiso");
            }

            const permisosYaAsignados = this.permisosUsuario.map(
                (permiso) => permiso.id
            );
            const nuevosPermisos = this.permisosAsignar.filter(
                (permiso) => !permisosYaAsignados.includes(permiso)
            );

            if (nuevosPermisos.length === 0) {
                return this.$toast.error(
                    "Todos los permisos seleccionados ya fueron asignados al usuario"
                );
            }

            this.$emit("actualizarPermisos", nuevosPermisos);
            this.buscarPermisosUsuario();
            this.permisosAsignar = [];
        },

        removerPermisos() {
            if (this.permisosRemover.length == 0) {
                return this.$toast.error("Debe seleccionar al menos un permiso");
            }

            this.$emit("removerPermisos", this.permisosRemover);
            this.buscarPermisosUsuario();
            this.permisosRemover = [];
        },
    },
};
</script>
