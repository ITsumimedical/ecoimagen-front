<template>
    <div>
        <!-- recomendaciones CUPS -->
        <v-alert text dense border="left" color="blue-grey" icon="mdi-doctor">
            <v-row align="center" justify="space-between">
                <span>Recomendaciones CUPS</span>
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
                                <v-autocomplete dense v-model="busquedaServicio" :items="cup" item-text="cups"
                                    item-value="id" label="CUP - Servicio" :search-input.sync="FiltroCups"
                                    no-data-text="Por favor escriba el nombre del servicio" @input="agregarCupArray" />
                                <v-chip-group column>
                                    <v-chip v-for="cup in form.cup_id" :key="cup.id" close small
                                        @click:close="eliminarCup(cup.id)">
                                        {{ cup.cups }}
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
    name: 'WorkspaceJsonRecomendacionesCups',

    data() {
        return {
            form: {
                descripcion: null,
                cup_id: [],
                user_id: null,
                estado_id: null,
                edad_minima: null,
                edad_maxima: null,
                sexo: null,
            },
            cup: [],
            busquedaServicio: '',
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
                text: 'Servicio CUP',
                align: 'start',
                sortable: false,
                value: 'cup.nombre',
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
            ],
            dialogo: false,
            editar: false,
            FiltroCups: ''
        };
    },

    watch: {
        FiltroCups(val) {
            if (val) {
                if (val.length === 4) {
                    this.listaCups();
                } else if (val.length < 4) {
                    this.cups = null;
                }
            } else {
                this.cups = null;

            }
        },
    },

    mounted() {
        this.listarRecomendaciones();
    },

    methods: {
        listarRecomendaciones() {
            this.$axios.post('recomendaciones/listar', {
                filtroCups: true
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
            if (!this.form.descripcion || !this.form.cup_id) {
                return this.$toast.error('Todos los campos son obligatorios');
            }
            this.form.user_id = this.$store.state.auth.usuario.id;
            this.form.estado_id = 1;
            const formData = new FormData();
            if (this.editar == false) {
                for (const key in this.form) {
                    if (key === 'cup_id') {
                        this.form.cup_id.forEach((item, index) => {
                            formData.append(`cup_id[${index}]`, item.id);
                        });
                    } else {
                        formData.append(key, this.form[key]);
                    }
                }
            }

            const url = this.editar ? `recomendaciones/actualizar/${this.form.id}` : 'recomendaciones/crear';
            const metodo = this.editar ? 'put' : 'post';

            this.$axios[metodo](url, formData).then(res => {
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

        agregarCupArray(cupId) {
            if (!Array.isArray(this.form.cup_id)) {
                this.form.cup_id = [];
            }

            if (cupId) {
                const seleccionado = this.cup.find(d => d.id === cupId);
                if (seleccionado && !this.form.cup_id.some(d => d.id === seleccionado.id)) {
                    this.form.cup_id.push(seleccionado);
                }
            }
            this.busquedaServicio = [];
        },

        eliminarCup(id) {
            this.form.cup_id = this.form.cup_id.filter(d => d.id !== id);
        },

        listaCups() {
            this.preload = true;
            this.$axios.get('/cup/BuscarCup/' + this.FiltroCups, {

            }).then(res => {
                this.cup = res.data.original
                this.preload = false;
            }).catch(e => {
                e.response
                this.preload = false;
            })
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
