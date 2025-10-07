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

        <!-- Formulario de Especialidades -->
        <v-dialog v-model="mostrarEspecialidadesModal" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-star-settings">
                    <b>
                        Gestionar Especialidades del usuario
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
                            <v-autocomplete dense v-model="especialidadesAsignar" :items="nuevasEspecialidades"
                                :loading="loading.selectorEspecialidades" chips deletable-chips clearable small-chips
                                multiple item-text="nombre" item-value="id"
                                label="Seleccione especialidades para asignar"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                            <v-btn color="primary" small @click="asignarEspecialidades">
                                Asignar
                                <v-icon right>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar especialidades"
                                single-line hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table dense :headers="headersEspecialidades" :items="filteredEspecialidades"
                                :loading="loading.tablaEspecialidades" loading-text="Cargando..." item-key="id"
                                show-select v-model:select="especialidadesRemover"
                                no-data-text="El usuario no posee especialidades asignadas"></v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="warning" small @click="removerEspecialidades()">Remover Especialidades</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        mostrarEspecialidadesModal: Boolean,
        usuario: Object,
    },
    data() {
        return {
            preload: false,
            loading: {
                selectorEspecialidades: false,
                tablaEspecialidades: false,
            },
            headersEspecialidades: [
                { text: "ID", value: "id" },
                { text: "Especialidad", value: "nombre" },
            ],
            especialidadesUsuario: [],
            especialidadesAsignar: [],
            nuevasEspecialidades: [],
            especialidadesRemover: [],
            search: "",
            singleSelect: false,
        };
    },
    watch: {
        mostrarEspecialidadesModal(newVal) {
            if (newVal) {
                this.buscarEspecialidadesUsuario();
                this.listarEspecialidades();
            }
        },
    },
    computed: {
        filteredEspecialidades() {
            const searchLower = this.search.toLowerCase();
            return this.especialidadesUsuario.filter((especialidad) => {
                return especialidad.nombre.toLowerCase().includes(searchLower);
            });
        },
    },
    methods: {
        cerrarModal() {
            this.$emit("update:mostrarEspecialidadesModal", false);
            this.especialidadesAsignar = [];
            this.especialidadesRemover = [];
            this.search = ""; // Limpiar búsqueda al cerrar el modal
        },

        buscarEspecialidadesUsuario() {
            this.loading.tablaEspecialidades = true;
            this.$axios
                .get(`/usuarios/buscarRoles/${this.usuario.id}`)
                .then((res) => {
                    this.especialidadesUsuario = res.data[0].especialidades;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar las especialidades");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.tablaEspecialidades = false;
                });
        },

        listarEspecialidades() {
            this.loading.selectorEspecialidades = true;
            this.$axios
                .post(`/especialidades/listarTodas`)
                .then((res) => {
                    this.nuevasEspecialidades = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar las especialidades");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.selectorEspecialidades = false;
                });
        },

        asignarEspecialidades() {
            if (this.especialidadesAsignar.length == 0) {
                return this.$toast.error("Debe seleccionar al menos una especialidad");
            }

            const especialidadesYaAsignadas = this.especialidadesUsuario.map(
                (especialidad) => especialidad.id
            );

            const nuevasEspecialidades = this.especialidadesAsignar.filter(
                (especialidad) => !especialidadesYaAsignadas.includes(especialidad)
            );

            if (nuevasEspecialidades.length == 0) {
                return this.$toast.error(
                    "Todas las especialidades seleccionadas ya estan asignadas"
                );
            }

            this.$emit("actualizarEspecialidades", nuevasEspecialidades);
            this.buscarEspecialidadesUsuario();
            this.especialidadesAsignar = [];
        },

        removerEspecialidades() {
            if (this.especialidadesRemover.length == 0) {
                return this.$toast.error("Debe seleccionar al menos una especialidad");
            }

            this.$emit("removerEspecialidades", this.especialidadesRemover);
            this.buscarEspecialidadesUsuario();
            this.especialidadesRemover = [];
        },
    },
};
</script>
