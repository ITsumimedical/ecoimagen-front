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

        <!-- Formulario de Entidades -->
        <v-dialog v-model="mostrarEntidadesModal" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-account-settings">
                    <b>
                        Gestionar Entidades del usuario
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
                            <v-autocomplete dense v-model="entidadesAsignar" :items="nuevasEntidades"
                                :loading="loading.selectorEntidades" chips deletable-chips clearable small-chips
                                multiple item-text="nombre" item-value="id" label="Seleccione entidades para asignar"
                                no-data-text="El usuario no posee entidades disponibles para asignar"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                            <v-btn color="primary" small @click="asignarEntidades">
                                Asignar Entidades
                                <v-icon right>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar entidades"
                                single-line hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table dense :headers="headersEntidades" :items="filteredEntidades"
                                :loading="loading.tablaEntidades" :single-select="singleSelect" item-key="id"
                                show-select v-model.select="entidadesRemover"
                                no-data-text="El usuario no posee entidades asignadas"></v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="warning" small @click="removerEntidades()">Remover Entidades</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        mostrarEntidadesModal: Boolean,
        usuario: Object,
    },
    data() {
        return {
            preload: false,
            loading: {
                tablaEntidades: false,
                selectorEntidades: false,
            },
            headersEntidades: [
                { text: "ID", value: "id" },
                { text: "Entidad", value: "nombre" },
            ],
            entidadesUsuario: [],
            nuevasEntidades: [],
            entidadesAsignar: [],
            entidadesRemover: [],
            search: "",
            singleSelect: false,
        };
    },
    watch: {
        mostrarEntidadesModal(newVal) {
            if (newVal) {
                this.buscarEntidadesUsuario();
                this.listarEntidades();
            }
        },
    },
    computed: {
        filteredEntidades() {
            const searchLower = this.search.toLowerCase();
            return this.entidadesUsuario.filter((entidad) => {
                return (
                    entidad.nombre.toLowerCase().includes(searchLower)
                );
            });
        },
    },
    methods: {
        cerrarModal() {
            this.$emit("update:mostrarEntidadesModal", false);
            this.entidadesAsignar = [];
            this.entidadesRemover = [];
            this.search = "";
        },

        buscarEntidadesUsuario() {
            this.loading.tablaEntidades = true;
            this.$axios
                .get(`/usuarios/buscarRoles/${this.usuario.id}`)
                .then((res) => {
                    this.entidadesUsuario = res.data[0].entidad;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar las entidades");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.tablaEntidades = false;
                });
        },

        listarEntidades() {
            this.loading.selectorEntidades = true;
            this.$axios
                .post(`/entidad/listarNoTiene`, { id: this.usuario.id })
                .then((res) => {
                    this.nuevasEntidades = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar la lista de entidades");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.selectorEntidades = false;
                });
        },

        asignarEntidades() {
            if (this.entidadesAsignar.length == 0) {
                return this.$toast.error("Debe seleccionar al menos una entidad");
            }

            const entidadesYaAsignadas = this.entidadesUsuario.map(
                (entidad) => entidad.id
            );
            const nuevasEntidades = this.entidadesAsignar.filter(
                (entidad) => !entidadesYaAsignadas.includes(entidad)
            );

            if (nuevasEntidades.length === 0) {
                return this.$toast.error(
                    "Todos las entidades seleccionadas ya fueron asignadas al usuario"
                );
            }

            this.$emit("actualizarEntidades", nuevasEntidades);
            this.buscarEntidadesUsuario();
            this.entidadesAsignar = [];
            this.listarEntidades();
        },

        removerEntidades() {
            if (this.entidadesRemover.length == 0) {
                return this.$toast.error("Debe seleccionar al menos una entidad");
            }

            this.$emit("removerEntidades", this.entidadesRemover);
            this.buscarEntidadesUsuario();
            this.listarEntidades();
            this.entidadesRemover = [];
        },
    },
};
</script>
