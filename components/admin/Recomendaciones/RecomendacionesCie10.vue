<template>
    <div>
        <!-- recomendaciones CIE10 -->
        <v-alert text dense border="left" color="blue-grey" icon="mdi-doctor">
            <v-row align="center" justify="space-between">
                <span>Recomendaciones CIE10</span>
                <v-btn small color="success" class="white--text" @click="abrirDialogoCrear">
                    Nuevo
                    <v-icon right>
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </v-row>
        </v-alert>

        <!-- Data table -->
        <v-data-table :items="recomendaciones" dense :headers="headersRecomendaciones">
            <template v-slot:[`item.estado_id`]="{ item }">
                <v-chip small :color="chipEstado(item.estado_id)" dark>{{ item.estado_id == '1' ? 'Activo' : 'Inactivo'
                }}
                </v-chip>
            </template>
            <template v-slot:[`item.usuario_operador_nombre`]="{ item }">
                {{
                    [item.usuario?.operador?.nombre, item.usuario?.operador?.apellido]
                        .filter(Boolean)
                        .join(' ')
                }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <!-- botón actualizar -->
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small color="warning" v-bind="attrs" v-on="on" @click="abrirDialogoEditar(item)">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>

                <!-- boton cambiar estado  -->
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon :color="item.estado_id == 1 ? 'error' : 'success'" v-bind="attrs" v-on="on"
                            @click="cambiarEstado(item)">
                            {{ item.estado_id == 1 ? "mdi-toggle-switch-off" : "mdi-toggle-switch" }}
                        </v-icon>
                    </template>
                    <span>{{ item.estado_id == 1 ? "Desactivar recomendación" : "Activar recomendación" }}</span>
                </v-tooltip>
            </template>
        </v-data-table>

        <!-- dialogo -->
        <v-dialog persistent max-width="1200px" v-model="dialogo">
            <v-card>
                <v-alert icon="mdi-stethoscope" text dense :color="editar ? 'warning' : 'info'">
                    <b>{{ editar ? 'Actualizar recomendación' : 'Crear recomendación' }}</b>
                </v-alert>
                <v-card-text>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12">
                                <v-textarea auto-grow label="Recomendación" v-model="form.descripcion"
                                    dense></v-textarea>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field type="number" hide-spin-buttons v-model="form.edad_minima" dense
                                    label="Edad mímina">
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field type="number" hide-spin-buttons v-model="form.edad_maxima" dense
                                    label="Edad máxima">
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-autocomplete :items="generos" v-model="form.sexo" item-text="text" item-value="value"
                                    dense label="Género"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="this.editar == false">
                                <v-autocomplete dense v-model="busquedaDiagnostico" :items="cie10"
                                    item-text="Codigo_Nombre" item-value="id" label="Diagnóstico"
                                    :search-input.sync="buscarCie10"
                                    no-data-text="Por favor escriba el nombre del diagnóstico"
                                    @input="agregarCie10Array" />
                                <v-chip-group column>
                                    <v-chip v-for="diagnostico in form.cie10_id" :key="diagnostico.id" close small
                                        @click:close="eliminarDiagnostico(diagnostico.id)">
                                        {{ diagnostico.Codigo_Nombre }}
                                    </v-chip>
                                </v-chip-group>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small @click="cerrarDialogo()" dark>Cerrar</v-btn>
                    <v-btn small :color="editar ? 'warning' : 'success'" @click="guardarRecomendacion()">
                        {{ editar ? 'Actualizar' : 'Guardar' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonRecomendacionesCie10',

    data() {
        return {
            form: {
                descripcion: null,
                cie10_id: [],
                user_id: null,
                estado_id: null,
                edad_minima: null,
                edad_maxima: null,
                sexo: null,
            },
            cie10: [],
            busquedaDiagnostico: '',
            recomendaciones: [],
            headersRecomendaciones: [{
                text: 'id',
                value: 'id',
            },
            {
                text: 'Recomendación',
                align: 'start',
                sortable: false,
                value: 'descripcion',
            },
            {
                text: 'Diagnóstico',
                align: 'start',
                sortable: false,
                value: 'cie10.Codigo_Nombre',
            },
            {
                text: 'Edad mínima',
                align: 'start',
                sortable: false,
                value: 'edad_minima',
            },
            {
                text: 'Edad máxima',
                align: 'start',
                sortable: false,
                value: 'edad_maxima',
            },
            {
                text: 'Sexo',
                align: 'start',
                sortable: false,
                value: 'sexo',
            },
            {
                text: 'Usuario registra',
                align: 'start',
                sortable: false,
                value: 'usuario_operador_nombre',
            },
            {
                text: 'Estado',
                value: 'estado_id',
                align: 'center',
                sortable: false,
            },
            {
                text: 'Acciones',
                value: 'actions',
                align: 'center',
                sortable: false
            },
            ],
            dialogo: false,
            editar: false,
            buscarCie10: null,
            filtroCie10: null,
            generos: [{
                text: 'Masculino',
                value: 'M'
            },
            {
                text: 'Femenino',
                value: 'F'
            },
            {
                text: 'Ambos',
                value: 'A'
            },
            ]
        };
    },

    watch: {
        buscarCie10(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarCie10();
                } else if (val.length < 4) {
                    this.cie10 = [];
                }
            } else {
                this.cie10 = [];
            }
        }
    },

    mounted() {
        this.listarRecomendaciones();
    },

    methods: {
        listarRecomendaciones() {
            this.$axios.post('recomendaciones/listar', {
                filtroCie10: true
            }).then(res => {
                this.recomendaciones = res.data;
            }).catch(res => {
                this.$toast.error('Error al listar las recomendaciones');
            });
        },

        chipEstado(estado_id) {
            if (estado_id == '1') return 'success'
            else return 'error'
        },

        abrirDialogoCrear() {
            this.editar = false;
            this.form = {
                descripcion: ''
            };
            this.dialogo = true;
        },

        abrirDialogoEditar(item) {
            this.editar = true;
            this.form = {
                ...item
            };
            this.dialogo = true;
        },

        cerrarDialogo() {
            this.form = {
                id: '',
                descripcion: ''
            },
                this.dialogo = false
        },

        guardarRecomendacion() {
            if (!this.form.descripcion || !this.form.cie10_id) {
                return this.$toast.error('Todos los campos son obligatorios');
            }
            this.form.user_id = this.$store.state.auth.usuario.id;
            this.form.estado_id = 1;

            const url = this.editar
                ? `recomendaciones/actualizar/${this.form.id}`
                : 'recomendaciones/crear';

            const metodo = this.editar ? 'put' : 'post';

            const payload = { ...this.form };

            if (this.editar) {
                payload.cie10_id = payload.cie10_id?.id || payload.cie10_id;
            }

            if (!this.editar) {
                payload.cie10_id = payload.cie10_id.map(item => item.id);
            }

            this.$axios[metodo](url, payload).then(res => {
                this.$toast.success(`Se ha ${this.editar ? 'actualizado' : 'creado'} la recomendación con éxito`);
                this.dialogo = false;
                this.listarRecomendaciones();
            }).catch(err => {
                console.error(err);
                this.$toast.error(
                    `Error al ${this.editar ? 'actualizar' : 'crear'}: ${err.response?.data?.message || 'intente nuevamente'}`
                );
            });
        },

        agregarCie10Array(diagnosticoId) {
            if (!Array.isArray(this.form.cie10_id)) {
                this.form.cie10_id = [];
            }

            if (diagnosticoId) {
                const seleccionado = this.cie10.find(d => d.id === diagnosticoId);
                if (seleccionado && !this.form.cie10_id.some(d => d.id === seleccionado.id)) {
                    this.form.cie10_id.push(seleccionado);
                }
            }
            this.busquedaDiagnostico = [];
        },

        eliminarDiagnostico(id) {
            this.form.cie10_id = this.form.cie10_id.filter(d => d.id !== id);
        },

        listarCie10() {
            const data = {
                valor: this.buscarCie10
            }
            this.$axios.post('cie10/listarFiltro', data).then(res => {
                this.cie10 = res.data
            }).catch(err => {
                console.log(err)
                this.$toast.error(err.response.data.mensaje)
            }).finally(() => { })
        },

        cambiarEstado(item) {
            this.$swal({
                title: "¿Está seguro?",
                text: "Desea cambiar el estado de la recomendación",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .post(`/recomendaciones/cambiarEstado/${item.id}`)
                        .then(() => {
                            this.$toast.success("Cambio de estado exitoso");
                            this.listarRecomendaciones();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al cambiar el estado");
                            console.log(error);
                        })
                        .finally(() => { });
                }
            });
        },

    },
};

</script>
